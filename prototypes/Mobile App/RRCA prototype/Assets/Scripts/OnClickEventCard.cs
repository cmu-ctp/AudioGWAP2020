using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class OnClickEventCard : MonoBehaviour
{
    [SerializeField]
    private Text eventTitleLoading, streamerNameLoading, eventDateLoading;

    [SerializeField]
    private GameObject eventDetailsLoadingPage;

    [SerializeField]
    private GameObject joinedEventsPage;

    [SerializeField]
    private StringVariable eventId;

    public void OnClickEventCardButton(string id, string eventTitle, string streamerName, string eventDate)
    {
        eventId.Value = id;
        eventTitleLoading.text = eventTitle;
        streamerNameLoading.text = streamerName;
        eventDateLoading.text = eventDate;
        joinedEventsPage.SetActive(false);
        eventDetailsLoadingPage.SetActive(true);
        eventDetailsLoadingPage.GetComponent<EventDetails>().StartGettingDetails(id, eventTitle, streamerName, eventDate);
    }
}
