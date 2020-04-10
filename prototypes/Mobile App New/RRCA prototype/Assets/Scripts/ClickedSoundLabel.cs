using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ClickedSoundLabel : MonoBehaviour
{
    [SerializeField]
    private GameObject eventDetailsPage, canvas, customize, soundLabelling;

    [SerializeField]
    private Toggle customizeBox;

    [SerializeField]
    private Text eventName;

    public void OnClickLabelRecord(string soundLabel)
    {
        eventDetailsPage.SetActive(false);
        //canvas.GetComponent<RecordManager>().PrepareRecord();
        canvas.GetComponent<SoundGalleryBackButton>().SetPreviousPage(eventDetailsPage);
        soundLabelling.GetComponent<SoundLabellingDetails>().SetSoundLabelValue(soundLabel);
        soundLabelling.GetComponent<SoundLabellingDetails>().SetEventNameValue(eventName.text);

        //GameObject soundLabelName = GameObject.Find("CanvasDebug");
        //soundLabelName.transform.GetChild(0).GetComponent<Text>().text = soundLabel;
        //soundLabelName.transform.GetChild(1).GetComponent<Text>().text = eventName.text;

        customizeBox.isOn = false;
        customize.SetActive(false);
        canvas.GetComponent<RecordManager>().PrepareRecord();
    }
}