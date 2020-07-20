using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class FeedbackForm : MonoBehaviour
{

    private const string GFormBaseURL = "https://docs.google.com/forms/d/e/1FAIpQLSe6sBQoLrZACIVxsRlGSrdTblNnBchqLTuSqcQgx942DzE1IQ/";

    [SerializeField]
    private Button feedbackButton;
    // Start is called before the first frame update
    void Start()
    {
        this.GetComponent<Button>().onClick.AddListener(GetForm);
    }

    private void GetForm()
    {
        string urlGFormView = GFormBaseURL + "viewform";
        OpenLink(urlGFormView);
        
    }

    public void OpenLink(string link) {
        string linkNoSpaces = link.Replace(" ","%20");
        Application.OpenURL(linkNoSpaces);
    }
    // Update is called once per frame
    void Update()
    {
        
    }
}
