using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

#if UNITY_ANDROID
using UnityEngine.Android;
#elif UNITY_IOS
using UnityEngine.iOS;
#endif

public class CrossValiManager : MonoBehaviour
{
    public UnityWebRequest www;
    public AudioClip download_audioClip;
    public Button button_playsound;

    IEnumerator DownloadAudioFromServer()
    {
        //www = UnityWebRequest.Get("https://echoes.etc.cmu.edu/api/viewer/events/" + eventId + "/sound");
        //yield return www.SendWebRequest();


        www = UnityWebRequestMultimedia.GetAudioClip("https://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_1MG.wav", AudioType.WAV);
        yield return www.SendWebRequest();



        if (www.isNetworkError || www.isHttpError)
        {
            Debug.Log(www.error + " : " + www.downloadHandler.text);
        }
        else
        {
            Debug.Log("Download complete!");
            download_audioClip = DownloadHandlerAudioClip.GetContent(www);
            //PlayAudio();
        }
     
    }

    public void PlayAudio()
    {
        Camera.main.GetComponent<AudioSource>().clip = download_audioClip;//audioclip from server
        Camera.main.GetComponent<AudioSource>().Play();
        Debug.Log("Play!");
    }

    public void UpdateTime(float rawTime)
    {

    }


    // Start is called before the first frame update
    void Start()
    {
        StartCoroutine("DownloadAudioFromServer");
        //PlayAudio();

        button_playsound.onClick.AddListener(PlayAudio);


    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
