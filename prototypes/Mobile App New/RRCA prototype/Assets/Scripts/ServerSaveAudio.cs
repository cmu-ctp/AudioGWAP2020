using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
 
public class MyBehavior : MonoBehaviour {

    byte[] audioData;

    void Start() {
        StartCoroutine(Upload());
    }
 
    //
    IEnumerator Upload() {
        string token = "";
        List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
        byte[] myData = System.Text.Encoding.UTF8.GetBytes("This is some test data");
        formData.Add(new MultipartFormFileSection("file", myData, "myfile.wav", "audio/wav"));
        formData.Add(new MultipartFormDataSection("sound", "{}"));//"{'meta':{'gamepiece:'...]}"));
        UnityWebRequest www = UnityWebRequest.Post("https://echoes.etc.cmu.edu/api/viewer/events/fake/sound", formData);
        www.SetRequestHeader("Authorization", "Bearer " + token);
        yield return www.SendWebRequest();
 
        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
        }
        else {
            Debug.Log("Upload complete!");
        }
    }
}