using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class EventDetails : MonoBehaviour
{
    [SerializeField]
    private Text eventTitle, streamerName, eventDate;

    [SerializeField]
    private ListOfIntVariable taskListCategoryValues, soundLabelValues; //firstPos, offset, heightChange

    [SerializeField]
    private ListOfStringsVariable categorySoundLabels;

    [SerializeField]
    private GameObject eventDetailsLoadingPage, eventDetailsPage;

    [SerializeField]
    private Scrollbar eventDetailsPageScroll;

    [SerializeField]
    private ResetScrollBar resetScroll;

    [SerializeField]
    private GameObject[] CateogoryTextObjects;

    [SerializeField]
    private GameObject soundLabelRecordPrefab;

    private int incrementValue = 0;

    public void StartGettingDetails(string id, string a, string b, string c)
    {
        eventTitle.text = a;
        streamerName.text = b;
        eventDate.text = c;

        GetEventDetails(id);
    }

    private void GetEventDetails(string eventId)
    {
        StartCoroutine(GetEventsDetailsFromServer(eventId));
    }

    IEnumerator GetEventsDetailsFromServer(string eventId)
    {
        int i;
        UnityWebRequest www = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/viewer/events/" + eventId);
        www.SetRequestHeader("Authorization", "Bearer " + PlayerPrefs.GetString("token"));
 
        //Wait for the response and then get our data
        yield return www.SendWebRequest();
        var data = www.downloadHandler.text;
        
        if(www.isNetworkError || www.isHttpError) {
            Debug.Log("Request error");
            Debug.Log(www.error);
        }
        else {
            Debug.Log("Got event details");
            List<string[]> categoryDetails = JsonClassEventDetails.getEventDetailsInfo(data);
            int index = 0;

            //destroy all previous sound label gameobjects
            for(i = 0; i < CateogoryTextObjects.Length; i++)
            {
                for(int j = 1; j < CateogoryTextObjects[i].transform.childCount; j++)
                {
                    GameObject.Destroy(CateogoryTextObjects[i].transform.GetChild(j).gameObject);
                }
            }

            incrementValue = 0;

            for(i = 0; i < categoryDetails.Count; i++)
            {
                if(categoryDetails[i].Length != 0)
                {
                    CateogoryTextObjects[i].SetActive(true);
                    int yInitPos = taskListCategoryValues.Value[0]; // initial position of task list
                    float xInitPos = CateogoryTextObjects[i].transform.localPosition.x;
                    Debug.Log("increment : " + incrementValue + " category : " + i);
                    CateogoryTextObjects[i].transform.localPosition = new Vector3(xInitPos, yInitPos - incrementValue, 0); // find offset of each category

                    int j;
                    for(j = 0; j < categoryDetails[i].Length; j++)
                    {
                        GameObject labelObject = Instantiate(soundLabelRecordPrefab);
                        labelObject.transform.SetParent(CateogoryTextObjects[i].transform);
                        labelObject.transform.GetChild(0).gameObject.GetComponent<Text>().text = categoryDetails[i][j];

                        labelObject.transform.localScale = new Vector3(0.7f, 0.7f, 1);

                        int x = 0;
                        int y = soundLabelValues.Value[2]; // init position of sound label

                        if(j % 3 == 0)
                        {
                            x = -soundLabelValues.Value[0];
                        }
                        else if(j % 3 == 2)
                        {
                            x = soundLabelValues.Value[0];
                        }

                        labelObject.transform.localPosition = new Vector3(x, y - (j / 3) * soundLabelValues.Value[1], 0); // adding soundlabel offset
                    }

                    incrementValue += Mathf.CeilToInt(j / 3.0f) * soundLabelValues.Value[1];
                    incrementValue += taskListCategoryValues.Value[1]; // offset of task list
                    index++;
                }
                else
                {
                    CateogoryTextObjects[i].SetActive(false);
                }
            }
            incrementValue += taskListCategoryValues.Value[1];
            CateogoryTextObjects[0].transform.parent.gameObject.GetComponent<RectTransform>().sizeDelta = new Vector2(0, incrementValue);

            eventDetailsLoadingPage.SetActive(false);
            eventDetailsPage.SetActive(true);
            resetScroll.SetVerticalScrollBarToStart(eventDetailsPageScroll);
        }
    }
}
