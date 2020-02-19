using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
#if PLATFORM_ANDROID
using UnityEngine.Android;
#endif
using UnityEngine.UI;
using Button = UnityEngine.UI.Button;

public class RecordController : MonoBehaviour
{
    private enum State { Init, Prepare, Recording, Finish, Playing }

    [SerializeField]
    private Button recordBtn;
    private Text recordBtnTxt;

    [SerializeField]
    private Button retryBtn;

    [SerializeField]
    private Text timeTxt;

    [SerializeField]
    private AudioSource audioSrc;
    private AudioClip audioClip;

    private State recordState = State.Init;

    private float prepareStartTime = 0f;

    private void Start()
    {
        recordBtnTxt = recordBtn.GetComponentInChildren<Text>();

        recordBtn.onClick.AddListener(OnRecordBtnClick);
        retryBtn.onClick.AddListener(OnRetryBtnClick);

        Init();
    }
    
    private void Update()
    {
        if (recordState == State.Prepare)
        {
            if (!CheckPermission())
            {
                // Wait for 15s to gain permission
                if (Time.realtimeSinceStartup - prepareStartTime > 15f)
                {
                    timeTxt.text = "Failed to enable microphone";
                    Init();
                }
            }
            else
            {
                StartRecord();
            }
        }
        else if (recordState == State.Recording)
        {
            float recordedPos = Microphone.GetPosition(null);
            float recordedTime = recordedPos / (float)(audioClip.channels * audioClip.frequency);
            UpdateTime(recordedTime);
        }
        else if (recordState == State.Playing)
        {
            if (audioSrc.isPlaying)
            {
                UpdateTime(audioSrc.time);
            }
            else
            {
                StopPlay();
            }
        }
    }

    private void Init()
    {
        State lastState = recordState;

        recordState = State.Init;

        if (lastState != State.Prepare)
        {
            timeTxt.text = "";
        }

        recordBtn.interactable = true;
        recordBtnTxt.text = "●";
        recordBtnTxt.color = Color.red;
        retryBtn.gameObject.SetActive(false);
    }

    private void PrepareRecord()
    {
        recordState = State.Prepare;
        recordBtn.interactable = false;
        prepareStartTime = Time.realtimeSinceStartup;

        if (!CheckPermission())
        {
            timeTxt.text = "Requesting microphone permission...";
            TryGainPermission();
        }
    }

    private void StartRecord()
    {
        recordState = State.Recording;
        recordBtn.interactable = true;
        if (audioClip != null)
        {
            AudioClip.DestroyImmediate(audioClip);
        }

        // Maximum record length is one hour
        audioClip = Microphone.Start(null, false, 3599, 44100);

        timeTxt.text = "00:00";
        recordBtnTxt.text = "■";
        recordBtnTxt.color = Color.red;
    }

    private void StopRecord()
    {
        recordState = State.Finish;
        int recordEndPos = Microphone.GetPosition(null);
        Microphone.End(null);

        // No audio recorded
        if (recordEndPos <= 0)
        {
            Init();
            return;
        }

        ClipAudio(ref audioClip, recordEndPos);

        // Force GC to save memory
        System.GC.Collect();

        UpdateTime(audioClip.length);
        recordBtnTxt.text = "▶";
        recordBtnTxt.color = Color.blue;
        retryBtn.gameObject.SetActive(true);
    }

    private void ClipAudio(ref AudioClip clip, int endPos)
    {
        // from https://answers.unity.com/questions/544264/record-dynamic-length-from-microphone.html
        // Capture the current clip data
        var soundData = new float[endPos * clip.channels];
        clip.GetData(soundData, 0);

        // One does not simply shorten an AudioClip,
        //    so we make a new one with the appropriate length
        var newClip = AudioClip.Create(clip.name,
            endPos,
            clip.channels,
            clip.frequency,
            false);

        newClip.SetData(soundData, 0);        // Give it the data from the old clip

        // Replace the old clip
        AudioClip.DestroyImmediate(clip);
        clip = newClip;
    }

    private void StartPlay()
    {
        recordState = State.Playing;
        audioSrc.clip = audioClip;
        audioSrc.Play();

        recordBtnTxt.text = "■";
        recordBtnTxt.color = Color.blue;
    }

    private void StopPlay()
    {
        recordState = State.Finish;
        audioSrc.Stop();

        UpdateTime(audioClip.length);
        recordBtnTxt.text = "▶";
        recordBtnTxt.color = Color.blue;
    }

    private void UpdateTime(float rawTime)
    {
        int millisecond = Mathf.FloorToInt(rawTime * 1000) % 1000;
        int time = Mathf.FloorToInt(rawTime);
        timeTxt.text = $"{time / 60:D2}:{time % 60:D2}.{millisecond:D3}";
    }

    private void TryGainPermission()
    {
#if PLATFORM_ANDROID
        if (!Permission.HasUserAuthorizedPermission(Permission.Microphone)) {
            Permission.RequestUserPermission(Permission.Microphone);
        }
#endif
    }

    private bool CheckPermission()
    {
#if PLATFORM_ANDROID
        if (!Permission.HasUserAuthorizedPermission(Permission.Microphone))
        {
            return false;
        }
#endif
        return true;
    }

    private void OnRecordBtnClick()
    {
        switch (recordState)
        {
            case State.Init:
                PrepareRecord();
                break;
            case State.Recording:
                StopRecord();
                break;
            case State.Finish:
                StartPlay();
                break;
            case State.Playing:
                StopPlay();
                break;
        }
    }

    private void OnRetryBtnClick()
    {
        if (recordState == State.Playing)
        {
            StopPlay();
        }

        Init();
    }
}
