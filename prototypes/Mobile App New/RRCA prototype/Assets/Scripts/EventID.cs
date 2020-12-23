using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class EventID : MonoBehaviour
{
    [SerializeField]
    private Text eventTitle, streamerName, eventDate;

    private string id;

    public void SetId(string Value)
    {
        id = Value;
    }

    public string GetId()
    {
        return id;
    }

    public void OnClickEventCard()
    {
        this.transform.parent.gameObject.GetComponent<OnClickEventCard>().OnClickEventCardButton(id, eventTitle.text, streamerName.text, eventDate.text);
    }

    public void OnClickValidateButton()
    {
        this.transform.parent.gameObject.GetComponent<OnClickEventCard>().OnClickValidateButton(id);
    }
}
