using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CheckEvents : MonoBehaviour
{
    [SerializeField]
    private GameObject myEvents, noEventsText;

    private List<List<string>> eventsToCheck;

    public void NoEvents()
    {
        myEvents.SetActive(false);
        noEventsText.SetActive(true);
    }

    public void EventsExist()
    {
        myEvents.SetActive(true);
        noEventsText.SetActive(false);
    }
}
