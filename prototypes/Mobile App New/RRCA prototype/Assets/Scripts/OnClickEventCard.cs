using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class OnClickEventCard : MonoBehaviour
{
    public GetValidationSound crossAudioList = new GetValidationSound();

    [SerializeField]
    private Text eventTitleLoading, streamerNameLoading, eventDateLoading;

    [SerializeField]
    private GameObject eventDetailsLoadingPage;

    [SerializeField]
    private GameObject joinedEventsPage;

    [SerializeField]
    private GameObject guessGuessPage;

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

    public void OnClickValidateButton(string id)
    {
        joinedEventsPage.SetActive(false);
        guessGuessPage.SetActive(true);
        // get unvalidated sound from current event
        crossAudioList.GetSoundFromEvent(id);
    }
}
