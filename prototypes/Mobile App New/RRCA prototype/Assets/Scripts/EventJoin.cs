using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class EventJoin : MonoBehaviour
{
    private string eventId;

    public void onClickJoinEventButton(EventID eventCard)
    {
        eventId = eventCard.GetId();
        StartCoroutine(JoinEvent());
    }

    IEnumerator JoinEvent()
    {
        UnityWebRequest www = UnityWebRequest.Post("https://echoes.etc.cmu.edu/api/viewer/events/" + eventId + "/join", "");
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log("Request error");
            Debug.Log(www.error);
        }
        else {
            Debug.Log("Joined event " + this.transform.parent.gameObject.name);
            this.transform.parent.gameObject.GetComponent<PopulateEvents>().AddValueToJoinedEventsList(eventId);
            //GameObject.Destroy(this.transform.parent.gameObject);
            this.GetComponent<EventID>().OnClickEventCard();
        }
    }
}