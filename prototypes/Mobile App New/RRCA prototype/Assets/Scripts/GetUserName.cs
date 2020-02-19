using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class GetUserName : MonoBehaviour
{
    [SerializeField]
    private StringVariable token;

    [SerializeField]
    private StringVariable name;

    void Start()
    {
        StartCoroutine(GetUsername());
    }

    IEnumerator GetUsername()
    {
        UnityWebRequest www = UnityWebRequest.Get("https://echoes.etc.cmu.edu/api/users/info");
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));
        //Debug.Log("username : ");
 
         //Wait for the response and then get our data
         yield return www.SendWebRequest();
         var data = www.downloadHandler.text;

         //Debug.Log(data);
         
         //text.text = //data;//token.Value;
         name.Value = JsonClassUserInfo.getDisplayName(data);
         if(PlayerPrefs.GetString("username") == "")
         {
             PlayerPrefs.SetString("username", name.Value);
         }
         yield return null;
    }
}
