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
    public GetValidationSound getValidationSound = new GetValidationSound(); 

    public List<string> tagmanager;
    public List<string> chosentag = new List<string>();
    public string userchoosetag;
    public GameObject option1, option2, option3;
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

    public bool showErrorMessage;


    [SerializeField]
    private Button[] optionButtons;

    [SerializeField]
    private Text guideline;

    [SerializeField]
    private GameObject NoSoundScreen;

    [SerializeField]
    private Image NoSoundPopUp;

    [SerializeField]
    private GameObject confirmReportScreen;

    [SerializeField]
    private Button reportYes, reportNo;

    [SerializeField]
    private GameObject ErrorScreen;
    
    [SerializeField]
    private Image ErrorPopUp;

    
    // Start is called before the first frame update

    /* not used */
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

    /* not used */
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

    /* not used */
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

    /* option buttons -- set the tag and enable the submit button */
    void OnClickButton0()
    {
        optionButtons[8].interactable = true;
        tag = "Yes";

    }
    void OnClickButton1()
    {
        optionButtons[8].interactable = true;
        tag = "No";

    }
    void OnClickButton2()
    {
        optionButtons[8].interactable = true;
        tag = "Neither";
       
    }

    /* not used */
    void CompareTag()
    {
       
    }
    
    void ReportQuestion()
    {
        tag = "Abuse";
        confirmReportScreen.SetActive(true); 
        
    }

    public void OnClickReportNo() {
        confirmReportScreen.SetActive(false);
    }

    public void OnClickReportYes() {
        
        Debug.Log("Yes report this sound");
        confirmReportScreen.SetActive(false);
        SaveAudio();
    }

    /* not used */
    void UpdateAudio()
    {
        CompareTag();
        StopAudio();

        DownLoadPack downLoadPackToDelete = getValidationSound.newClip;

        getValidationSound.ClipDownLoaded.Remove(downLoadPackToDelete);
        ClipAmountsDid++;

        Debug.Log(getValidationSound.sounds.Count);
        if (ClipAmountsDid <= getValidationSound.sounds.Count)
        {
            //completepage.SetActive(false);
            loadTagList(getValidationSound.ClipDownLoaded[0].labelnames);
            UpdateTime(getValidationSound.newClip.downloadclips.length - Camera.main.GetComponent<AudioSource>().time);

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
        Debug.Log("clip downloaded num (in play audio):" + getValidationSound.ClipDownLoaded.Count);
        if (getValidationSound.newClip.downloadclips == null) {
            Debug.Log("sound clip is null");
            /* have an error message display here */
        }
        else {
            Debug.Log(getValidationSound.newClip.downloadclips);
            UpdateTime(getValidationSound.newClip.downloadclips.length - Camera.main.GetComponent<AudioSource>().time);
            // UpdateTime(getValidationSound.ClipDownLoaded[0].downloadclips.length - Camera.main.GetComponent<AudioSource>().time);
            Camera.main.GetComponent<AudioSource>().clip = getValidationSound.newClip.downloadclips; // getValidationSound.ClipDownLoaded[0].downloadclips; //audioclip from server
            Camera.main.GetComponent<AudioSource>().Play();
        }
        
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
        if (rawTime < 0) return;
        int millisecond = Mathf.FloorToInt(rawTime * 1000) % 1000;
        int time = Mathf.FloorToInt(rawTime);
        audioTime.text = $"{time / 60:D2}:{time % 60:D2}:{millisecond / 15:D2}";
    }


    /* not used */
    public void SkipAudio()
    {
        StopAudio();

        DownLoadPack downLoadPackToDelete = getValidationSound.ClipDownLoaded[0];

        getValidationSound.ClipDownLoaded.Remove(downLoadPackToDelete);
        ClipAmountsDid++;


        if (ClipAmountsDid <= getValidationSound.sounds.Count)
        {
            
            loadTagList(getValidationSound.ClipDownLoaded[0].labelnames);
            //StartCoroutine("DownloadAudioFromServer");
            UpdateTime(getValidationSound.newClip.downloadclips.length - Camera.main.GetComponent<AudioSource>().time);

        }
        else
        {
            completepage.SetActive(true);
            Debug.Log("finished");
        }

    }

    public void SaveAudio() {
        Debug.Log("save button clicked!");
        PauseAudio();
        StartCoroutine(UpdateAudioInServer());
    }

    /* not used */
    public void NextAudio() {
        Debug.Log("next button clicked!");
        // getNext = true;
    }


    IEnumerator UpdateAudioInServer() {
        List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
        Debug.Log("Updating audio data to the server");

        SoundData updatedSound = getValidationSound.sound;
        Debug.Log("new sound: "+updatedSound.path); 
            
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

        formData.Add(new MultipartFormDataSection("sound", JsonUtility.ToJson(updatedSound)));
        Debug.Log("new json: "+JsonUtility.ToJson(updatedSound));
        
        UnityWebRequest www = UnityWebRequest.Post("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/label/submit", formData);
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));
        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError) {
            Debug.Log("Error uploading sound to the server");
            Debug.Log(www.error + " : " + www.downloadHandler.text);
            getValidationSound.showErrorMessage = true;
        }
        else {
            Debug.LogError("Upload complete!");
            getNext = true; 
        }
        
    }



    void Start()
    {
        
        Debug.Log("Tag Manager Started");
        Debug.Log("clip downloaded length (in tm):" + getValidationSound.ClipDownLoaded.Count);

        Debug.Log("Setting button listeners");
        optionButtons[0].onClick.AddListener(OnClickButton0);
        optionButtons[1].onClick.AddListener(OnClickButton1);
        optionButtons[2].onClick.AddListener(OnClickButton2);
        optionButtons[3].onClick.AddListener(ReportQuestion);
        optionButtons[4].onClick.AddListener(PlayAudio);
        optionButtons[5].onClick.AddListener(PauseAudio);
        optionButtons[6].onClick.AddListener(SaveAudio);
        optionButtons[7].onClick.AddListener(SkipAudio);
        optionButtons[8].onClick.AddListener(SaveAudio); 
        optionButtons[8].interactable = false;
        reportYes.onClick.AddListener(OnClickReportYes);
        reportNo.onClick.AddListener(OnClickReportNo);
        Debug.Log("clip downloaded length 2 (in tm):" + getValidationSound.ClipDownLoaded.Count);
        
        if (getValidationSound.setPopUp) {
            NoSoundScreen.gameObject.SetActive(true); 
            NoSoundPopUp.gameObject.SetActive(true);
        }
        else {
            NoSoundScreen.gameObject.SetActive(false);
            NoSoundPopUp.gameObject.SetActive(false);
        }

        showErrorMessage = false;

    }

    // Update is called once per frame
    void Update()
    {
        if (getValidationSound.setPopUp) {
            NoSoundScreen.gameObject.SetActive(true); 
            NoSoundPopUp.gameObject.SetActive(true);
        }
        else {
            NoSoundScreen.gameObject.SetActive(false);
            NoSoundPopUp.gameObject.SetActive(false);
        }

        if (getValidationSound.showErrorMessage) {
            ErrorScreen.gameObject.SetActive(true);
            ErrorPopUp.gameObject.SetActive(true);
        }
        else {
            ErrorScreen.gameObject.SetActive(false);
            ErrorPopUp.gameObject.SetActive(false);
        }
        
        if (getValidationSound.label != "") {
            guideline.text = getValidationSound.label;
        }

        if (Camera.main.GetComponent<AudioSource>().isPlaying)
        {
            if (getValidationSound.ClipDownLoaded.Count != 0) {
                UpdateTime(getValidationSound.newClip.downloadclips.length - Camera.main.GetComponent<AudioSource>().time);
            }
        }
        else
        {
            playaudiobutton.SetActive(true);
            pauseaudiobutton.SetActive(false);
            if (getValidationSound.ClipDownLoaded.Count != 0) {
                UpdateTime(getValidationSound.newClip.downloadclips.length - Camera.main.GetComponent<AudioSource>().time);
            }
        }

        if (getNext) {
            getValidationSound.GetSound();
            optionButtons[8].interactable = false;
            Debug.Log("clip downloaded length after next:" + getValidationSound.ClipDownLoaded.Count);
            getNext = false;
        }
        
    }
}
