using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PopulateEvents : MonoBehaviour
{
    [SerializeField]
    private GetEvents getEvents;

    [SerializeField]
    private CheckEvents checkAnyEvents;

    [SerializeField]
    private GameObject eventCardPrefab;

    [SerializeField]
    private IntVariable numberOfEvents;

    [SerializeField]
    private IntVariable[] eventItemData; // firstPos, Offset, increment

    [SerializeField]
    private bool isJoinedEvents;

    [SerializeField]
    private ListOfStringsVariable joinedEventIds;

    private GameObject eventParent;
    public int populatedNumber, eventNumber;
    private bool isPopulated = false;

    public bool updatedEvents = false;

    public void UpdateJoinedEvents() {
       
        getEvents.UpdateJoinedEvents();
    
    }

    public void StartPopulating()
    {
        populatedNumber = 0;
        eventNumber = 0;

        if(getEvents.GetEventsInfo(isJoinedEvents).Count != 0)
        {
            checkAnyEvents.EventsExist();
        }
        else
        {
            checkAnyEvents.NoEvents();
        }

        eventParent = this.gameObject;
        if(!isPopulated)
        {
            // Debug.Log("isPopulated is false");
            InitialPopulate();
            numberOfEvents.Value = populatedNumber;
            Debug.Log("populated number: "+populatedNumber);
        }
        else
        {
            UpdatePopulate();
        }
    }

    void InitialPopulate()
    {
        Debug.Log("initial populate");
        isPopulated = true;
        Debug.Log("isJoined : " + isJoinedEvents + " , number  : " + numberOfEvents.Value );
        for(int i = 0; i < numberOfEvents.Value; i++)
        {
            if(isJoinedEvents)
            {
                joinedEventIds.Value.Add(getEvents.GetEventsInfo(isJoinedEvents)[0][i]);
            }
            InstantiateEventCard(i);
        }
    }

    public void UpdateAllEventsJoinButtonInitial()
    {
        Debug.LogError("in UpdateAllEventsJoinButtonInitial");
        if(joinedEventIds.Value.Count > 0)
        {
            updateAllEventCards();
        }
    }

    void updateAllEventCards()
    {
        Debug.Log("joined ids not count : " + (numberOfEvents.Value - joinedEventIds.Value.Count));
        for(int i = 0; i < numberOfEvents.Value; i++)
        {
            if(CheckIfInJoined(eventParent.transform.GetChild(i).gameObject.GetComponent<EventID>().GetId()))
            {
                // Debug.Log("Check in in joined is true");
                if(eventParent.transform.GetChild(i).gameObject.activeSelf)
                {
                    /* eventParent.transform.GetChild(i).GetChild(5).gameObject is the join button on the event card */
                    eventParent.transform.GetChild(i).gameObject.SetActive(false); 
                    eventParent.GetComponent<RectTransform>().sizeDelta -= new Vector2(0, eventItemData[2].Value);
                }
            }
            else
            {
                // Debug.Log("Check if in joined is false");
                eventParent.transform.GetChild(i).gameObject.SetActive(true);
                eventParent.transform.GetChild(i).GetChild(5).gameObject.SetActive(true);
            }
        }

        populatedNumber = 0;

        for(int i = 0; i < numberOfEvents.Value; i++)
        {
            if(eventParent.transform.GetChild(i).gameObject.activeSelf)
            {
                int yPos = eventItemData[0].Value + eventItemData[1].Value * populatedNumber++;
                eventParent.transform.GetChild(i).localPosition = new Vector3(275, yPos, 0);
            }
        }
    }

    bool CheckIfInJoined(string id)
    {
        Debug.Log("in CheckIfInJoined");
        for(int i = 0; i < joinedEventIds.Value.Count; i++)
        {
            // Debug.Log("id : " + id + " , " + "joinedid : " + joinedEventIds.Value[i]);
            if(id == joinedEventIds.Value[i])
            {
                return true;
            }
        }
        return false;
    }

    public void UpdateEvents()
    {
        Debug.Log("in UpdateEvents");
        // updatedEvents = false;
        if(isJoinedEvents)
        {
            // Debug.Log("update joined events");
            getEvents.UpdateJoinedEvents();
        }
        else
        {
            Debug.Log("update all events join button");
            getEvents.UpdateEvents();
                
        }
    }

    public void UpdatePopulate()
    {
        Debug.Log("update populate");
        if(eventParent.transform.childCount <= numberOfEvents.Value)
        {
            Debug.Log("# of events displayed < number of events");
            if(eventParent.transform.childCount != 0)
            {
                // Debug.Log("# of events displayed != 0");
                /* instantiate event cards for new events */
                for(int i = eventParent.transform.childCount; i < numberOfEvents.Value; i++)
                {
                    populatedNumber = i; 
                    InstantiateEventCard(i);
                }
                /* update all event cards */
                for(int i = 0; i < numberOfEvents.Value; i++)
                {
                    UpdateEventCard(i);
                }
            }
            else
            {
                /* instantiate first event card */
                // Debug.Log("# of events displayed == 0");
                populatedNumber = 0;
                InstantiateEventCard(0);
            }
        }
        else
        {
            /* no new events */
            for(int i = 0; i < numberOfEvents.Value; i++)
            {
                UpdateEventCard(i);
            }
            for(int i = numberOfEvents.Value; i < eventParent.transform.childCount; i++)
            {
                GameObject.Destroy(eventParent.transform.GetChild(i).gameObject);
            }
        }
    }

    void InstantiateEventCard(int index)
    {
        Debug.Log("in Instantiate Event Card: "+index);
        if(System.DateTime.Compare(System.DateTime.Parse(getEvents.GetEventsInfo(isJoinedEvents)[3][index]), System.DateTime.Now) > 0)
        {
            GameObject e = Instantiate(eventCardPrefab);
            if(eventParent == null)
            {
                eventParent = this.gameObject;
            }

            e.transform.SetParent(eventParent.transform);
            e.GetComponent<EventID>().SetId(getEvents.GetEventsInfo(isJoinedEvents)[0][populatedNumber]);
            
            e.transform.GetChild(2).gameObject.GetComponent<Text>().text = getEvents.GetEventsInfo(isJoinedEvents)[1][populatedNumber];
            e.transform.GetChild(3).gameObject.GetComponent<Text>().text = getEvents.GetEventsInfo(isJoinedEvents)[4][populatedNumber];
            e.transform.GetChild(4).gameObject.GetComponent<Text>().text = getEvents.GetEventsInfo(isJoinedEvents)[3][populatedNumber];

            Debug.Log("eventItemData[0].Value: "+eventItemData[0].Value);
            Debug.Log("eventItemData[1].Value: "+eventItemData[1].Value);
            Debug.Log("populatedNumber: "+populatedNumber);
            int yPos = eventItemData[0].Value + eventItemData[1].Value * populatedNumber;
            populatedNumber++;
            e.transform.localScale = new Vector3(1.3f, 1.3f, 1);
            e.transform.localPosition = new Vector3(275, yPos, 0);
            Debug.Log("position: " + e.transform.localPosition);

            /* expands the scroll view (expanding it double the amount needed for wiggle room)*/
            eventParent.GetComponent<RectTransform>().sizeDelta += new Vector2(0, eventItemData[2].Value);
            eventParent.GetComponent<RectTransform>().sizeDelta += new Vector2(0, eventItemData[2].Value);
        }
    }

    void UpdateEventCard(int i)
    {
        Debug.Log("in UpdateEventCard");
        eventParent.transform.GetChild(i).GetComponent<EventID>().SetId(getEvents.GetEventsInfo(isJoinedEvents)[0][i]);
        eventParent.transform.GetChild(i).GetChild(2).gameObject.GetComponent<Text>().text = getEvents.GetEventsInfo(isJoinedEvents)[1][i];
        eventParent.transform.GetChild(i).GetChild(3).gameObject.GetComponent<Text>().text = getEvents.GetEventsInfo(isJoinedEvents)[4][i];
        eventParent.transform.GetChild(i).GetChild(4).gameObject.GetComponent<Text>().text = getEvents.GetEventsInfo(isJoinedEvents)[3][i];
    }

    public void AddValueToJoinedEventsList(string eventId)
    {
        Debug.Log("in AddValueToJoinedEventsList");
        joinedEventIds.Value.Add(eventId);
    }
}
