using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Button = UnityEngine.UI.Button;
using UnityEngine.Networking;

public class GetValidationSound : MonoBehaviour
{

    public List<DownLoadPack> ClipDownLoaded = new List<DownLoadPack>();
    public List<SoundObject> sounds; /* not being used currently */
    // Start is called before the first frame update

    public string label = "";

    /* get one sound from the server and play the sound */
    [SerializeField]
    private Text guideline;

    void Start()
    {
        Debug.Log("Start requesting validation sound");
        // this.GetComponent<Button>().onClick.AddListener(GetSound);
        StartCoroutine(RequestSoundList());
        
    }

    private void GetSound()
    {
        StartCoroutine(RequestSoundList());
    }

    // Update is called once per frame
    void Update()
    {
        if (label != "") {
            guideline.text = label;
        }
        
    }

    /* from CrossAudioList */
    IEnumerator RequestSoundList()
    {
        string responseBody;
        // https://hcii-gwap-01.andrew.cmu.edu/api/viewer/sound/retrieve
        using (UnityWebRequest req = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/sound/retrieve"))
        {

            req.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));

            yield return req.SendWebRequest();


            if (req.isNetworkError || req.isHttpError)
            {
                Debug.Log(req.error + " : " + req.downloadHandler.text);
            }

            responseBody = DownloadHandlerBuffer.GetContent(req);
            PlayerPrefs.SetString("body", responseBody);
        }

        Debug.Log("Got sound response");
        Debug.Log("response: " + responseBody);
        StartCoroutine(GetSoundList());

    }

    IEnumerator GetSoundList()
    {
        string responseBody = PlayerPrefs.GetString("body");
        SoundObject soundObject; 
        string path;
        string displayName;
        string labelName;
        string id;

        SoundFetchAPIResult result = JsonUtility.FromJson<SoundFetchAPIResult>(responseBody);
        Debug.Log("result message: "+result.msg);
        
        if (result.result != null)
        {
            Debug.Log("result: "+result.result);
            
            SoundData sound = result.result;
           
            path = "https://hcii-gwap-01.andrew.cmu.edu" + sound.path;
            Debug.Log(path);
            displayName = sound.user.display_name;
            labelName = sound.meta.category; //sound.game_meta.sound_label;
            id = sound.id;
            label = guideline.text + labelName + " ?";
           
            Debug.Log("guideline text: "+label);
            //guideline.text = guideline.text + " " + labelName;

            soundObject = new SoundObject(path, displayName, labelName, id);
            
            // yield return new WaitForEndOfFrame();
            StartCoroutine(DownloadAudioFromSoundList(soundObject.displayName, soundObject.labelName, soundObject.path, soundObject.id));

        }
        else {
           Debug.Log("result.result IS null"); 
        }

        Debug.Log("Made request for sound audio file");

        yield return new WaitForEndOfFrame();
        // StartCoroutine(DownLoadClipRoutine());

        // StartCoroutine(DownloadAudioFromSoundList(soundObject.displayName, soundObject.labelName, soundObject.path, soundObject.id));

        //foreach (SoundObject sound in sounds)
        //{

        //    StartCoroutine(DownloadAudioFromSoundList(sound.displayName, sound.labelName, sound.path, sound.id));

        //}

    }

    IEnumerator DownloadAudioFromSoundList(string displayName, string labelName, string path, string id)
    {

        Debug.Log("In DownloadAudioFromSoundList");
        using (UnityWebRequest req = UnityWebRequestMultimedia.GetAudioClip(path, AudioType.WAV))
        {
            yield return req.SendWebRequest();
            if (req.isNetworkError || req.isHttpError)
            {
                Debug.Log("Error downloading audio file");
                Debug.LogError(req.error);
                yield break;
            }
            else {
                Debug.Log("No error downloading audio file");
            }
            DownLoadPack newClip = new DownLoadPack();
            newClip.downloadclips = DownloadHandlerAudioClip.GetContent(req);
            newClip.labelnames = labelName;

            Debug.Log("Audio clip successfully downloaded");
            ClipDownLoaded.Add(newClip); // do I need this?

            // notdownloading = true;
            
            Debug.Log("clip downloaded count: "+ClipDownLoaded.Count);

            //clips.Add(DownloadHandlerAudioClip.GetContent(req));
            //labelnames.Add(labelName);
            //clips_labels.Add(DownloadHandlerAudioClip.GetContent(req), labelName);
            //dictionaries.Add(clips_labels);
            
        }
        



    }
}
