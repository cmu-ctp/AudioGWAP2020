using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class RevokeConsent : MonoBehaviour
{

    [SerializeField]
    private GameObject canvas, sampleWebView, loginPage, consentPage, homePage, soundItems, revokeConfirmPage;//, loading;

    [SerializeField]
    private IntVariable chosenGamePieceIndex;

    // Start is called before the first frame update
    private void Start()
    {
        this.GetComponent<Button>().onClick.AddListener(CheckToken);
    }

    private void CheckToken()
    {
        
        if(PlayerPrefs.GetString("token") == "")
        {
            Debug.Log("Coroutine not started");
            //GoToWebView();
        }
        else
        {
            Debug.Log("Coroutine started");
            StartCoroutine(sendRequest());
        }
        
    }

    IEnumerator sendRequest()
    {

        Debug.Log("Sending request!");
        UnityWebRequest www = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/consent/revoke/");
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error + " : " + www.downloadHandler.text);
        }
        else {
            Debug.Log("Successfully hit API and revoked consent");
        }

        if(www.responseCode == 200)
        {
            Debug.Log("Going to next screen");
            GoToNextPage();
        }
    }

    public void GoToNextPage()
    {
        
        revokeConfirmPage.SetActive(false);
        
    }


}
