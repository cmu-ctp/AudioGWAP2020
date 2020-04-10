using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class OnClickSoundLabelRecordButton : MonoBehaviour
{
    public void OnClick(Text soundLabel)
    {
        this.transform.parent.parent.gameObject.GetComponent<ClickedSoundLabel>().OnClickLabelRecord(soundLabel.text);
        //GameObject soundLabelName = GameObject.Find("CanvasDebug");
        //soundLabelName.transform.GetChild(0).GetComponent<Text>().text = soundLabel.text;

    }
}