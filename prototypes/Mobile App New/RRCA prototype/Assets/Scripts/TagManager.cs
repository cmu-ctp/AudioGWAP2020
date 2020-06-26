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
public class TagManager : MonoBehaviour
{
    // public CrossAudioList crossAudioList;
    public GetValidationSound crossAudioList = new GetValidationSound(); 
    // would this mess things up because im creating a new instance


    public List<string> tagmanager;
    public List<string> chosentag = new List<string>();
    public string userchoosetag;
    public GameObject option1;
    public GameObject option2;
    public GameObject option3;
    private string target;
    int ClipAmountsDid = 1 ;

    private string tag;

    public bool getNext = false;

    public UnityWebRequest www;
    public Text audioTime;
    private AudioClip download_audioClip;

    public GameObject completepage;

    public GameObject playaudiobutton;
    public GameObject pauseaudiobutton;


    [SerializeField]
    private Button[] optionButtons;

    [SerializeField]
    private Text guideline;



    //public int audioindex = 0;
    // Start is called before the first frame update

    public void generateTagList()
    {
        Debug.Log("generating tag list");
        string[] labelinput = {
            "Sink/Faucet","Disposer","Garbage bin","Microwave","Oven","Toaster","Cooktop","Kettle","Refrigerator","Cooking","Silverwave","Plates","Mopping floor",
            "Sink","Bathtub","Shower","Hairdryer","Mirror cabinet","Toothbrush","Toilet flush","Toilet paper","Hand wash","Electric trimmer","Soap dispenser","Deodorant","Extractor fan",
            "Door","Doorbell","TV","Stereo","Children playing","Phone Ringing","Typing Keyboard","Window","Chair/Coach","Air conditioner","Vacuum cleaner","Fireplace","Clock",
            "Door","Car","Bike","Motorbike","Tools","Washer","Dryer","Furnace","Water leaking","Repair trimmer","Wood work",
            "Footsteps","Drinking","Eating","Baby crying","Dog/Cat","Light switch","Walking","Running","Car sounds","Bird sounds","Rain",
            "Person falling","Snoring","Coughing","Sneezing","Call for help","Smoke detector","Security alarm","Glass break"
        };

        tagmanager = new List<string>(labelinput);

    }
    public void loadTagList(string t)
    {
        Debug.Log("loading tag list");
        randomMnumber(3, tagmanager.Count);
        if (chosentag.Contains(t))
        {
                //NO PROBLEM
        }
        else
        {
            chosentag[Random.Range(0,3)] = t;
                //add right tag
        }
        option1.GetComponent<Text>().text = chosentag[0];
        option2.GetComponent<Text>().text = chosentag[1];
        option3.GetComponent<Text>().text = chosentag[2];

        target = t;
    } 

    void randomMnumber(int m, int n)
    {
        chosentag.Clear();
        System.Random rand = new System.Random();
        for(int i = 0; i < n; i++)
        {
            int temp = rand.Next() % (n - i);
            if (temp < m)
            {
                chosentag.Add(tagmanager[i]);
                m--;
                //Debug.LogError(i);
            }
        }
    }

    void OnClickButton0()
    {
        Debug.Log("Yes button clicked");
        // userchoosetag = chosentag[0];
        tag = "Yes";
        Debug.Log("tag: "+tag);

    }
    void OnClickButton1()
    {
        Debug.Log("button one clicked!");
        // userchoosetag = chosentag[1];
        tag = "No";

    }
    void OnClickButton2()
    {
        // userchoosetag = chosentag[2];
        tag = "Neither";
       
    }

    void CompareTag()
    {
        if (userchoosetag == target)
        {
            Debug.Log("yeeeeee");
        }
        else
        {
            Debug.Log("noooooooo");
        }
    }
    
    void ReportQuestion()
    {
        SkipAudio();
        Debug.Log("questionnnnnnnnn");
        //UpdateAudio();
    }



    void UpdateAudio()
    {
        CompareTag();
        StopAudio();

        DownLoadPack downLoadPackToDelete = crossAudioList.ClipDownLoaded[0];
        //AudioClip clipToDelete = crossAudioList.clips[audioindex];
        //string lableToDelete = crossAudioList.labelnames[audioindex];
        //crossAudioList.clips.Remove(clipToDelete);
        //crossAudioList.labelnames.Remove(lableToDelete);

        crossAudioList.ClipDownLoaded.Remove(downLoadPackToDelete);
        ClipAmountsDid++;


        Debug.Log(crossAudioList.sounds.Count);
        if (ClipAmountsDid <= crossAudioList.sounds.Count)
        {
            //completepage.SetActive(false);
            loadTagList(crossAudioList.ClipDownLoaded[0].labelnames);
            UpdateTime(crossAudioList.ClipDownLoaded[0].downloadclips.length - Camera.main.GetComponent<AudioSource>().time);

        }
        else
        {
            completepage.SetActive(true);
            Debug.Log("finished");
        }

  
    }



    public void PlayAudio()
    {
        Debug.Log("PlayAudio()");
        Debug.Log("clip downloaded num (in play audio):" + crossAudioList.ClipDownLoaded.Count);
        if (crossAudioList.ClipDownLoaded[0].downloadclips == null) {
            Debug.Log("sound clip is null");
        }
        UpdateTime(crossAudioList.ClipDownLoaded[0].downloadclips.length - Camera.main.GetComponent<AudioSource>().time);
        Camera.main.GetComponent<AudioSource>().clip = crossAudioList.ClipDownLoaded[0].downloadclips; //audioclip from server
        Camera.main.GetComponent<AudioSource>().Play();

    }

    public void PauseAudio()
    {
        Camera.main.GetComponent<AudioSource>().Pause();
        Debug.Log("Pause!");
    }

    public void StopAudio()
    {
        Camera.main.GetComponent<AudioSource>().Stop();
        Debug.Log("Stop!");
    }
    
    private void UpdateTime(float rawTime)
    {
        // Debug.Log("In UpdateTime()");
        int millisecond = Mathf.FloorToInt(rawTime * 1000) % 1000;
        int time = Mathf.FloorToInt(rawTime);
        audioTime.text = $"{time / 60:D2}:{time % 60:D2}:{millisecond / 15:D2}";
    }

    public void SkipAudio()
    {
        StopAudio();

        DownLoadPack downLoadPackToDelete = crossAudioList.ClipDownLoaded[0];

        crossAudioList.ClipDownLoaded.Remove(downLoadPackToDelete);
        //Debug.Log(" YI gong duoshao ge"+ crossAudioList.sounds.Count + " zuole duoshao ge  " + ClipAmountsDid + " haishng duoshao ge " + crossAudioList.ClipDownLoaded.Count);
        ClipAmountsDid++;


        if (ClipAmountsDid <= crossAudioList.sounds.Count)
        {
            
            loadTagList(crossAudioList.ClipDownLoaded[0].labelnames);
            //StartCoroutine("DownloadAudioFromServer");
            UpdateTime(crossAudioList.ClipDownLoaded[0].downloadclips.length - Camera.main.GetComponent<AudioSource>().time);

        }
        else
        {
            completepage.SetActive(true);
            Debug.Log("finished");
        }

    }

    public void SaveAudio() {
        Debug.Log("save button clicked!");
        // Debug.Log("sound path in TM: "+crossAudioList.sound.path);
        StartCoroutine(UpdateAudioInServer());
    }

    public void NextAudio() {
        Debug.Log("next button clicked!");
        getNext = true;
    }


    IEnumerator UpdateAudioInServer() {
        List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
        Debug.Log("Updating audio data to the server");

        SoundData updatedSound = crossAudioList.sound;
        Debug.Log("new sound: "+updatedSound.path); 
        // from RecordManager.cs 
    
        List<JsonVotedLabel> votedLabels = updatedSound.votedLabels;
        JsonVotedLabel newLabel = new JsonVotedLabel();
        newLabel.uid = "null";
        newLabel.label = tag;
        if (votedLabels == null) {
            Debug.Log("validated array was null");
            votedLabels = new List<JsonVotedLabel>();
        }
        votedLabels.Add(newLabel);
        updatedSound.votedLabels = votedLabels;
        
        Debug.Log("voting array: "+ updatedSound.votedLabels);
        Debug.Log("voting array count: "+updatedSound.votedLabels.Count);
    

        formData.Add(new MultipartFormDataSection("sound", JsonUtility.ToJson(updatedSound)));
        Debug.Log("new json: "+JsonUtility.ToJson(updatedSound));
        
        UnityWebRequest www = UnityWebRequest.Post("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/label/submit", formData);
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log("Error uploading sound to the server");
            Debug.Log(www.error + " : " + www.downloadHandler.text);
        }
        else {
            //Debug.Log(RecordTimestamp);
            Debug.Log("Upload complete!");
            
        }
        
        
    }



    void Start()
    {
        
        // generateTagList(); 
        /* no longer need to generate tag list with a guideline based system */

        // loadTagList(crossAudioList.ClipDownLoaded[0].labelnames);
        Debug.LogError("Tag Manager Started");
        // crossAudioList.GetSound();
        // Debug.Log("clip downloaded length after next:" + crossAudioList.ClipDownLoaded.Count);
        Debug.Log("clip downloaded length (in tm):" + crossAudioList.ClipDownLoaded.Count);

        /*
        if (crossAudioList.ClipDownLoaded[0].downloadclips == null) {
            Debug.Log("sound clip is null");
        }
        else {
            Debug.Log("sound clip is not null");
        }
        */
        // UpdateTime(crossAudioList.ClipDownLoaded[0].downloadclips.length - Camera.main.GetComponent<AudioSource>().time);

        Debug.Log("Setting button listeners");
        optionButtons[0].onClick.AddListener(OnClickButton0);
        optionButtons[1].onClick.AddListener(OnClickButton1);
        optionButtons[2].onClick.AddListener(OnClickButton2);
        optionButtons[3].onClick.AddListener(ReportQuestion);
        optionButtons[4].onClick.AddListener(PlayAudio);
        optionButtons[5].onClick.AddListener(PauseAudio);
        optionButtons[6].onClick.AddListener(SaveAudio);
        // optionButtons[6].onClick.AddListener(UpdateAudio);
        optionButtons[7].onClick.AddListener(SkipAudio);
        optionButtons[8].onClick.AddListener(NextAudio);
        Debug.Log("clip downloaded length 2 (in tm):" + crossAudioList.ClipDownLoaded.Count);
        if (optionButtons[8].enabled) {
            Debug.Log("next button enabled");
        }
        else {
            Debug.Log("next button not enabled");
        }

    }

    // Update is called once per frame
    void Update()
    {
        
        if (crossAudioList.label != "") {
            guideline.text = crossAudioList.label;
        }

        if (Camera.main.GetComponent<AudioSource>().isPlaying)
        {
            UpdateTime(crossAudioList.ClipDownLoaded[0].downloadclips.length - Camera.main.GetComponent<AudioSource>().time);
        }
        else
        {
            playaudiobutton.SetActive(true);
            pauseaudiobutton.SetActive(false);
            UpdateTime(crossAudioList.ClipDownLoaded[0].downloadclips.length - Camera.main.GetComponent<AudioSource>().time);
        }

        if (getNext) {
            getNext = false;
            crossAudioList.GetSound();
            Debug.Log("clip downloaded length after next:" + crossAudioList.ClipDownLoaded.Count);

        }
        
    }
}
