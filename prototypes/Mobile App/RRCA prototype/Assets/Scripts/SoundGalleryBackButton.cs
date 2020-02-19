using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SoundGalleryBackButton : MonoBehaviour
{
    [SerializeField]
    private Text BackButtontext;

    private GameObject previousPage;

    public void SetPreviousPage(GameObject page)
    {
        previousPage = page;
        BackButtonSet();
    }

    public void GoBackToPreviousPage()
    {
        previousPage.SetActive(true);
    }

    public void BackButtonSet()
    {
        if(previousPage.name == "Home Page")
        {
            BackButtontext.text = "< Back to Home";
        }
        else
        {
            BackButtontext.text = "< Back to Tasklist";
        }
    }
}
