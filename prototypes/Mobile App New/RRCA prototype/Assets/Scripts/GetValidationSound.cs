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

    public SoundData sound;

    /* get one sound from the server and play the sound */
    [SerializeField]
    private Text guideline;

    public bool setPopUp = false;

    public DownLoadPack newClip;

    void Start()
    {
        Debug.Log("Start requesting validation sound");
        // this.GetComponent<Button>().onClick.AddListener(GetSound);
        StartCoroutine(RequestSoundList());
        
    }

    public void GetSound()
    {
        Debug.Log("Get sound");
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
    public IEnumerator RequestSoundList()
    {
        Debug.Log("in Request Sound List");
        string responseBody;
        // https://hcii-gwap-01.andrew.cmu.edu/api/viewer/sound/retrieve
        using (UnityWebRequest req = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/sound/retrieve"))
        {
            Debug.Log("making api call");
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
        string displayName = ""; // not used
        string labelName;
        string id = ""; // not used
        List<JsonVotedLabel> votedLabels;

        SoundFetchAPIResult result = JsonUtility.FromJson<SoundFetchAPIResult>(responseBody);
        Debug.Log("result message: "+result.msg);

        if (result.msg != "Success") {
            setPopUp = true;
            label = "Is this the sound of ... ";
        }

        else {
            setPopUp = false;
            if (result.result != null)
            {
                Debug.Log("result: "+result.result);
                
                sound = result.result;
            
                path = "https://hcii-gwap-01.andrew.cmu.edu" + sound.path;
                Debug.Log(path);
                labelName = sound.meta.category; //sound.game_meta.sound_label;
                label = "Is this the sound of a(n) " + labelName + "?";
                votedLabels = sound.votedLabels;
            
                Debug.Log("voting round: "+sound.votingRound);
            
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
        }

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
            newClip = new DownLoadPack();
            newClip.downloadclips = DownloadHandlerAudioClip.GetContent(req);
            newClip.labelnames = labelName;

            Debug.Log("Audio clip successfully downloaded");
            ClipDownLoaded.Add(newClip);
            
            Debug.Log("clip downloaded count: "+ClipDownLoaded.Count);

            
        }

    }
}
