using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class CheckValidLogin : MonoBehaviour
{
    [SerializeField]
    private GameObject canvas, sampleWebView, loginPage, consentPage, homePage, soundItems;//, loading;

    [SerializeField]
    private IntVariable chosenGamePieceIndex;

    private void Start() {
        this.GetComponent<Button>().onClick.AddListener(CheckToken);
    }

    private void CheckToken()
    {
        if(PlayerPrefs.GetString("token") == "")
        {
            GoToWebView();
        }
        else
        {
            StartCoroutine(sendRequest());
        }
    }

    IEnumerator sendRequest()
    {
        UnityWebRequest www = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/users/info");
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));

        //Wait for the response and then get our data
        yield return www.SendWebRequest();
        var data = www.downloadHandler.text;

        if(www.responseCode == 200)
        {
            GoToNextPage();
        }
        else
        {
            GoToWebView();
        }
    }

    void GoToConsentPage()
    {
        loginPage.SetActive(false);
        consentPage.SetActive(true);
        soundItems.GetComponent<PopulateGallery>().StartPopulating();
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

    public void GoToNextPage()
    {
        chosenGamePieceIndex.Value = PlayerPrefs.GetInt("chosenGamePiece");
        canvas.GetComponent<GetEvents>().StartGettingEvents();
        loginPage.SetActive(false);
        homePage.SetActive(true);
        soundItems.GetComponent<PopulateGallery>().StartPopulating();
    }
}
