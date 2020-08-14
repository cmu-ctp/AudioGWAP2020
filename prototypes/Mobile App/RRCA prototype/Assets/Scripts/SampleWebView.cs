/*
 * Copyright (C) 2012 GREE, Inc.
 * 
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class SampleWebView : MonoBehaviour
{
    [SerializeField]
    private GameObject canvas, loginPage;

    [SerializeField]
    private GameObject nextPageToShow;

    [SerializeField]
    private StringVariable token;

    private static readonly string AUTH_TOKEN_URL = "https://hcii-gwap-01.andrew.cmu.edu/api/auth/twitch/token";

    public string Url;
    public Text status;
    WebViewObject webViewObject;

    IEnumerator Start()
    {
        Screen.orientation = ScreenOrientation.Portrait;
        webViewObject = (new GameObject("WebViewObject")).AddComponent<WebViewObject>();
        webViewObject.Init(
            cb: (msg) =>
            {
                Debug.Log(string.Format("cb : CallFromJS[{0}]", msg));
                //status.text = msg;
                //status.GetComponent<Animation>().Play();


                // Try validating with cookie
                if (!string.IsNullOrEmpty(msg))
                {
                    string authToken;
                    bool success = TryGetToken(msg, out authToken);
                    if (success)
                    {
                        FinishLogin(authToken);
                        return;
                    }
                }
            },
            err: (msg) =>
            {
                Debug.Log(string.Format("CallOnError[{0}]", msg));
                //status.text = msg;
                //status.GetComponent<Animation>().Play();
            },
            started: (msg) =>
            {
                Debug.Log(string.Format("started : CallOnStarted[{0}]", msg));
            },
            ld: (msg) =>
            {
                string currentUrl = msg;

                Debug.Log(string.Format("CallOnLoaded[{0}]", msg));

                canvas.SetActive(false);
                loginPage.SetActive(false);
                webViewObject.SetVisibility(true);

                if (!currentUrl.Contains(AUTH_TOKEN_URL))
                {
                    return;
                }

                string cookieValue = webViewObject.GetCookies(AUTH_TOKEN_URL);
                Debug.LogFormat("Cookies from {0}: {1}", currentUrl, cookieValue);

                // Try validating with cookie
                if (!string.IsNullOrEmpty(cookieValue))
                {
                    string authToken;
                    bool success = TryGetToken(cookieValue, out authToken);
                    if (success)
                    {
                        FinishLogin(authToken);
                        return;
                    }
                }

#if UNITY_EDITOR_OSX || !UNITY_ANDROID
                // NOTE: depending on the situation, you might prefer
                // the 'iframe' approach.
                // cf. https://github.com/gree/unity-webview/issues/189
#if true
                webViewObject.EvaluateJS(@"
                  if (window && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.unityControl) {
                    window.Unity = {
                      call: function(msg) {
                        window.webkit.messageHandlers.unityControl.postMessage(msg);
                      }
                    }
                  } else {
                    window.Unity = {
                      call: function(msg) {
                        window.location = 'unity:' + msg;
                      }
                    }
                  }
                ");
#else
                webViewObject.EvaluateJS(@"
                  if (window && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.unityControl) {
                    window.Unity = {
                      call: function(msg) {
                        window.webkit.messageHandlers.unityControl.postMessage(msg);
                      }
                    }
                  } else {
                    window.Unity = {
                      call: function(msg) {
                        var iframe = document.createElement('IFRAME');
                        iframe.setAttribute('src', 'unity:' + msg);
                        document.documentElement.appendChild(iframe);
                        iframe.parentNode.removeChild(iframe);
                        iframe = null;
                      }
                    }
                  }
                ");
#endif
#endif
                // Try getting cookie from js
                webViewObject.EvaluateJS(@"Unity.call(document.cookie)");
            },
            //ua: "custom user agent string",
            enableWKWebView: true);
#if UNITY_EDITOR_OSX || UNITY_STANDALONE_OSX
        webViewObject.bitmapRefreshCycle = 1;
#endif
        webViewObject.SetMargins(Screen.width / 8, Screen.height / 4, Screen.width / 8, Screen.height / 4);
        //webViewObject.SetVisibility(true);
        webViewObject.ClearCookies();

#if !UNITY_WEBPLAYER
        if (Url.StartsWith("http") || Url.StartsWith("https")) {
            webViewObject.LoadURL(Url.Replace(" ", "%20"));
        } else {
            var exts = new string[]{
                ".jpg",
                ".js",
                ".html"  // should be last
            };
            foreach (var ext in exts) {
                var url = Url.Replace(".html", ext);
                var src = System.IO.Path.Combine(Application.streamingAssetsPath, url);
                var dst = System.IO.Path.Combine(Application.persistentDataPath, url);
                byte[] result = null;
                if (src.Contains("://")) {  // for Android
                    var www = new WWW(src);
                    yield return www;
                    result = www.bytes;
                } else {
                    result = System.IO.File.ReadAllBytes(src);
                }
                System.IO.File.WriteAllBytes(dst, result);
                if (ext == ".html") {
                    webViewObject.LoadURL("file://" + dst.Replace(" ", "%20"));
                    break;
                }
            }
        }
#else
        if (Url.StartsWith("http") || Url.StartsWith("https")) {
            webViewObject.LoadURL(Url.Replace(" ", "%20"));
        } else {
            webViewObject.LoadURL("StreamingAssets/" + Url.Replace(" ", "%20"));
        }
        webViewObject.EvaluateJS(
            "parent.$(function() {" +
            "   window.Unity = {" +
            "       call:function(msg) {" +
            "           parent.unityWebView.sendMessage('WebViewObject', msg)" +
            "       }" +
            "   };" +
            "});");
#endif
        yield break;
    }

    private bool TryGetToken(string cookie, out string token)
    {
        string[] cookieKeyValues = cookie.Split(';');

        bool hadValue = false;

        for (int i = 0; i < cookieKeyValues.Length; i++)
        {
            if (cookieKeyValues[i].Contains("echoes_auth_token"))
            {
                token = cookieKeyValues[i].Split('=')[1];
                return true;
            }
        }

        token = null;
        return false;
    }

    private void FinishLogin(string authToken)
    {
        token.Value = authToken;

        PlayerPrefs.SetString("token", token.Value);
        PlayerPrefs.SetString("username", "");

        GameObject.Destroy(webViewObject.gameObject);
        gameObject.SetActive(false);
        canvas.SetActive(true);
        nextPageToShow.SetActive(true);
    }
}