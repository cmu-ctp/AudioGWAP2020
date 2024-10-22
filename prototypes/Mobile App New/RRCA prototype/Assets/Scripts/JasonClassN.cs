﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

[Serializable]
public class SoundFetchAPIResult
{
    public string msg;
    public SoundData result;
    
}

[Serializable]
public class SoundData
{
    
    public string path;
    public string sid;
    public int votingRound;
    public bool isValidated;
    public List<JsonVotedLabel> votedLabels;
    public string validatedLabel;
    public SoundMeta meta;
    public SoundGameMeta game_meta;
    
}

[Serializable]
public class SoundMeta
{
    public string category;

}

[Serializable]
public class SoundGameMeta
{
    public string model;
    public string sound_label;
}

[Serializable]
public class UserData
{
    public string uid;
    public string display_name;
}

[Serializable]
public class DownLoadPack
{
    public AudioClip downloadclips;
    public string labelnames;
}
