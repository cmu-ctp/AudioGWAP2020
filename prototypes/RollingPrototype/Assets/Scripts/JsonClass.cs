using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

[Serializable]
public class SoundFetchAPIResult
{
    public string msg;
    public SoundData[] result;
}

[Serializable]
public class SoundData
{
    public string path;
    public SoundGameMeta game_meta;
    public UserData user;
    public string id;
}

[Serializable]
public class SoundGameMeta
{
    public string model;
}

[Serializable]
public class UserData
{
    public string uid;
    public string display_name;
}
