using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

[Serializable]
public class JsonClassAuthResponse
{
    public string msg;
    public JsonClassAuthResult result;
}

[Serializable]
public class JsonClassAuthResult
{
    public string token;
    public string type;
}

[Serializable]
public class JsonClassUserInfo
{
    public string msg;
    public JsonClassUserInfoResult result;

    public static string getDisplayName(string jsonString)
    {
        return JsonUtility.FromJson<JsonClassUserInfo>(jsonString).result.display_name;
    }
}

[Serializable]
public class JsonClassUserInfoResult
{
    public string uid;
    public string user_name;
    public string display_name;
    public string avatar_url;
}

[Serializable]
public class JsonClassEvents
{
    public string msg;
    public JsonClassEventsInfo[] result;

    public static List<List<string>> getEventsInfo(string jsonString)
    {
        JsonClassEventsInfo[] eventDetails;
        List<string> eventId = new List<string>();
        List<string> eventTitle = new List<string>();
        List<string> eventDesc = new List<string>();
        List<string> eventTime = new List<string>();
        List<string> creatorName = new List<string>();
        List<List<string>> eventsInfo = new List<List<string>>();

        eventDetails = JsonUtility.FromJson<JsonClassEvents>(jsonString).result;

        TimeZoneInfo infos = TimeZoneInfo.Local;
        string dateStr;
        DateTime convertedDate;

        for(int i = 0; i < eventDetails.Length; i++)
        {
            dateStr = "";
            convertedDate = new DateTime();

            //change time to local time
            dateStr = eventDetails[i].time.Split('T')[0];
            dateStr += " " + eventDetails[i].time.Split('T')[1];
            convertedDate = DateTime.Parse(dateStr);
            convertedDate = TimeZone.CurrentTimeZone.ToLocalTime(convertedDate);

            //if convertedDate is an active time add the details of the event to the list

            eventId.Add(eventDetails[i].id);
            eventTitle.Add(eventDetails[i].title);
            eventDesc.Add(eventDetails[i].desc);
            eventTime.Add(convertedDate.ToString());

            creatorName.Add(eventDetails[i].creator.display_name);
        }

        if(eventDetails.Length > 0)
        {
            eventsInfo.Add(eventId);
            eventsInfo.Add(eventTitle);
            eventsInfo.Add(eventDesc);
            eventsInfo.Add(eventTime);
            eventsInfo.Add(creatorName);
        }

        return eventsInfo;
    }
}

[Serializable]
public class JsonClassEventsInfo
{
    public string title;
    public string desc;
    public string time;
    public string id;
    public JsonClassEventCreatorInfo creator;
}

[Serializable]
public class JsonClassEventCreatorInfo
{
    public string display_name;
}

[Serializable]
public class JsonClassEventDetails
{
    public JsonClassEventDetailsCategories result;

    public static List<string[]> getEventDetailsInfo(string jsonString)
    {
        JsonClassEventDetailsCategories eventCategories = JsonUtility.FromJson<JsonClassEventDetails>(jsonString).result;
        List<string[]> categoryDetails = new List<string[]>();

        categoryDetails.Add(eventCategories.categories.Kitchen);
        categoryDetails.Add(eventCategories.categories.Bathroom);
        categoryDetails.Add(eventCategories.categories.Living);
        categoryDetails.Add(eventCategories.categories.Garage);
        categoryDetails.Add(eventCategories.categories.Ambience);
        categoryDetails.Add(eventCategories.categories.Concerning);

        return categoryDetails;
    }
}

[Serializable]
public class JsonClassEventDetailsCategories
{
    public JsonClassEventDetailsInfo categories;
}

[Serializable]
public class JsonClassEventDetailsInfo
{
    public string[] Kitchen;
    public string[] Bathroom;
    public string[] Living;
    public string[] Garage;
    public string[] Ambience;
    public string[] Concerning;
}

[Serializable]
public class JsonSoundMeta
{
    public string category;
    public string label;
    // public string validated; //new field
}

[Serializable]
public class JsonSoundMetaWithoutLabel
{
    public string category;
    // public string validated; //new field
}

[Serializable]
public class JsonSoundGameMeta
{
    public string model;
}

[Serializable]
public class JsonVotedLabel
{
    public string uid; /* uid of the user submitting validation */
    public string label; /* label the user guesses */
}

[Serializable]
public class JsonSoundDataWithLabel
{
    public JsonSoundGameMeta game_meta;
    public JsonSoundMeta meta;
    public string sid;
    public bool isValidated; /* true/false. is the sound validated */
    public int votingRound; /* round of voting */
    public List<JsonVotedLabel> votedLabels = new List<JsonVotedLabel>();
    public string validatedLabel; /* label after validation is complete */
    public string uploadTime;
    public string validateTime;
}

[Serializable]
public class JsonSoundDataWithoutLabel
{
    public JsonSoundGameMeta game_meta;
    public JsonSoundMetaWithoutLabel meta;
    public bool isValidated; /* true/false */
    public int votingRound; /* round of voting */
    public List<JsonVotedLabel> votedLabels = new List<JsonVotedLabel>();
    public string validatedLabel; /* label after validation is complete */
    public string sid;
    public string uploadTime;
    public string validateTime;
}

[Serializable]
public class JsonGamePieceDataUpdate
{
    public JsonGamePieceData game_meta;

    public string SaveToString()
    {
        return JsonUtility.ToJson(this);
    }
}

[Serializable]
public class JsonGamePieceData
{
    public string model;
}