using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class GetEvents : MonoBehaviour
{
    [SerializeField]
    private StringVariable token;

    [SerializeField]
    private IntVariable numberOfEvents, numberOfJoinedEvents;

    [SerializeField]
    private PopulateEvents populateEvents, populateJoinedEvents;

    private int previousNumberOfEvents = 0;

    
    private List<List<string>> joinedEvents, events, upcomingJoinedEvents, upcomingEvents = new List<List<string>>();

    public void StartGettingEvents()
    {
        Debug.LogError("Start Getting Events");
        numberOfEvents.Value = 0;
        numberOfJoinedEvents.Value = 0;
        StartCoroutine(GetJoinedEventsInfoFromServer());
        StartCoroutine(GetEventsInfoFromServer());
    }

    public void UpdateJoinedEvents()
    {
        StartCoroutine(GetJoinedEventsInfoFromServer());
    }

    public void UpdateEvents()
    {
        StartCoroutine(GetEventsInfoFromServer());
    }

    IEnumerator GetEventsInfoFromServer()
    {
        Debug.Log("Retrieving events from server");
        
        UnityWebRequest www = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/events");
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error + " : " + www.downloadHandler.text);
        }
        else {
            Debug.Log("successfully hit API");
            var data = www.downloadHandler.text;
            events = JsonClassEvents.getEventsInfo(data);

            int total = 0;

            if(events.Count == 0)
            {
                numberOfEvents.Value = 0;
            }
            else
            {
                for(int i = 0; i < events[3].Count; i++)
                {
                    if(System.DateTime.Compare(System.DateTime.Parse(events[3][i]), System.DateTime.Now) > 0)
                    {
                        total++;
                    }
                }
                Debug.Log("events total : " + total);
                numberOfEvents.Value = total;
                populateEvents.StartPopulating();
            }
            populateEvents.UpdateAllEventsJoinButtonInitial();
        }
    }

    IEnumerator GetJoinedEventsInfoFromServer()
    {
        Debug.Log("joined events");
        UnityWebRequest www = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/events/joined");
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token")); 
 
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error + " : " + www.downloadHandler.text);
        }
        else
        {
            Debug.Log("successfully hit API");
            var data = www.downloadHandler.text;
            joinedEvents = JsonClassEvents.getEventsInfo(data);
            
            int total = 0;

            if(joinedEvents.Count == 0)
            {
                numberOfJoinedEvents.Value = 0;
            }
            else
            {
                for(int i = 0; i < joinedEvents[3].Count; i++)
                {
                    if(System.DateTime.Compare(System.DateTime.Parse(joinedEvents[3][i]), System.DateTime.Now) > 0)
                    {
                        total++;
                    }
                }
                
                Debug.Log("joined events total : " + total);
                numberOfJoinedEvents.Value = total;
                populateJoinedEvents.StartPopulating();
            }
        }
    }

    public int GetPreviousNumberOfEvents()
    {
        return previousNumberOfEvents;
    }

    public List<List<string>> GetEventsInfo(bool isJoinedEvents)
    {
        if(isJoinedEvents)
        {
            return joinedEvents;
        }
        return events;
    }
}
