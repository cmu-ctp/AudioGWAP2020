﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class SoundLabellingDetails : MonoBehaviour
{
    [SerializeField]
    private Dropdown eventDropDown, soundLabelDropDown;

    [SerializeField]
    private GameObject eventArrow, soundLabelArrow, soundLabel, saveButton, deleteButton, saveText, customize, consentcheckbox; // saveButton
    
    [SerializeField]
    private GetEvents canvas;

    [SerializeField]
    private RecordManager recordManager;

    [SerializeField]
    private StringVariable idOfEvent;

    private string soundLabelValue, eventNameValue;
    private List<Dropdown.OptionData> option = new List<Dropdown.OptionData>();
    private Dropdown.OptionData eventsData = new Dropdown.OptionData();
    private Dropdown.OptionData soundLabelData = new Dropdown.OptionData();
    public List<List<string>> eventsJoined = new List<List<string>>();

    private void Start() {
        Debug.Log("Starting sound labelling details");
        saveButton.GetComponent<Button>().interactable = false;
        // consentcheckbox.SetActive(false);
        saveButton.GetComponent<Button>().onClick.AddListener(SaveAudio);
    }

    public void SaveAudio() {
        Debug.Log("Save button clicked");
    }

    public void SetSoundLabelValue(string value)
    {
        soundLabelValue = value;
    }

    public void SetEventNameValue(string value)
    {
        eventNameValue = value;
    }

    public void ChangeOptions()
    {
        if(soundLabelValue != "" && eventNameValue != "")
        {
            Debug.LogError("if true");
            saveButton.GetComponent<Button>().interactable = false;
            //saveButton.GetComponent<Button>().interactable = true;
            eventArrow.SetActive(false);
            soundLabelArrow.SetActive(false);
            eventDropDown.interactable = false;
            soundLabelDropDown.interactable = false;

            eventDropDown.ClearOptions();
            option.Clear();
            eventsData.text = eventNameValue;
            option.Add(eventsData);
            eventDropDown.AddOptions(option);

            soundLabelDropDown.ClearOptions();
            option.Clear();
            soundLabelData.text = soundLabelValue;
            option.Add(soundLabelData);
            soundLabelDropDown.AddOptions(option);
            //if(consentcheckbox.GetComponent<Toggle>().isOn == true)
            //{
            //    saveButton.GetComponent<Button>().interactable = true;
            //}
            consentcheckbox.SetActive(true);
        }
        else
        {
            Debug.Log("if not true");
            saveButton.GetComponent<Button>().interactable = false;
            consentcheckbox.SetActive(true);
            eventArrow.SetActive(true);
            soundLabelArrow.SetActive(true);
            eventDropDown.gameObject.SetActive(true);
            soundLabelDropDown.gameObject.SetActive(true);
            eventDropDown.interactable = true;
            soundLabelDropDown.transform.parent.gameObject.SetActive(false);
            // customize.SetActive(false);
            soundLabelDropDown.interactable = true;

            eventsJoined = canvas.GetEventsInfo(true);
            eventDropDown.ClearOptions();
            option.Clear();
            for(int i= 0; i < recordManager.numberOfJoinedEvents.Value; i++)
            {
                Dropdown.OptionData tempData = new Dropdown.OptionData();
                
                if(i == 0)
                {
                    Dropdown.OptionData t = new Dropdown.OptionData();
                    t.text = "Choose One";
                    option.Add(t);
                    eventDropDown.AddOptions(option);
                }
                option.Clear();
                tempData.text = eventsJoined[1][i];
                option.Add(tempData);
                eventDropDown.AddOptions(option);
            }

            consentcheckbox.SetActive(false);
        }
    }

    public void OnChangeEvent()
    {
        if(eventDropDown.value > 0)
        {
            // customize.SetActive(true);
            saveText.SetActive(false);
            soundLabel.SetActive(true);
            consentcheckbox.SetActive(true); // added
            StartCoroutine(GetEventDetailsFromServer(eventsJoined[0][eventDropDown.value - 1]));
           
        }
        else
        {
            // customize.SetActive(false);
            saveText.SetActive(true);
            saveButton.GetComponent<Button>().interactable = false;
            soundLabel.SetActive(false);
        }
    }
    public void AgreetoSendData()
    {
        if (consentcheckbox.GetComponentInChildren<Toggle>().isOn == true)
        {
            saveButton.GetComponent<Button>().interactable = true;
            //saveButton.GetComponent<Button>().interactable = true;
        }
        else
        {
            saveButton.GetComponent<Button>().interactable = false;
        }
    }

    IEnumerator GetEventDetailsFromServer(string eventId)
    {
        idOfEvent.Value = eventId;
        UnityWebRequest www = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/events/" + eventId);
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));
 
        //Wait for the response and then get our data
        yield return www.SendWebRequest();
        var data1 = www.downloadHandler.text;
        
        if(www.isNetworkError || www.isHttpError) {
            Debug.Log("Request error");
            Debug.Log(www.error);
        }
        else {
            List<string[]> categoryDetails = JsonClassEventDetails.getEventDetailsInfo(data1);

            soundLabelDropDown.ClearOptions();
            option.Clear();
            // consentcheckbox.SetActive(false);
            for(int i= 0; i < categoryDetails.Count; i++)
            {
                for(int j = 0; j < categoryDetails[i].Length; j++)
                {
                    Dropdown.OptionData tempData = new Dropdown.OptionData();
                    // if(i == 0 && j == 0)
                    // {
                    //     Dropdown.OptionData t = new Dropdown.OptionData();
                    //     t.text = "Choose One";
                    //     option.Add(t);
                    //     soundLabelDropDown.AddOptions(option);
                    // }
                    option.Clear();
                    tempData.text = categoryDetails[i][j];
                    option.Add(tempData);
                    soundLabelDropDown.AddOptions(option);
                }
            }
        }
    }
}
