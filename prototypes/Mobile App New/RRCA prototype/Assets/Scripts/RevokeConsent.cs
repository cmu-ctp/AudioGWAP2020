using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class RevokeConsent : MonoBehaviour
{

    [SerializeField]
    private GameObject canvas, sampleWebView, loginPage, consentPage, homePage, soundItems;//, loading;

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
            //GoToWebView();
        }
        else
        {
            StartCoroutine(sendRequest());
        }
    }

    // Update is called once per frame
    /*void Update()
    {
        StartCoroutine(GetEventsInfoFromServer());
    }*/

     IEnumerator sendRequest()
    {
        
        UnityWebRequest www = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/consent/revoke/");
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error + " : " + www.downloadHandler.text);
        }
        /*else {
            Debug.Log("Successfully hit API");
        }*/
    }

     public void GoToWebView()
    {
        PlayerPrefs.SetInt("chosenGamePiece", -1);
        this.gameObject.SetActive(false);
        //loading.SetActive(true);
        //canvas.SetActive(false);
        //loginPage.SetActive(false);
        //consentPage.SetActive(true);
        soundItems.GetComponent<PopulateGallery>().StartPopulating();
        sampleWebView.SetActive(true);
    }

}
