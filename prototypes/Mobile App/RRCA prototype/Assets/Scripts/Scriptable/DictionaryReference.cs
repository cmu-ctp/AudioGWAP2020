using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DictionaryReference : ScriptableObject
{
    [SerializeField] private string data;
    [SerializeField] private int index;
    public string Value
    {
        get { return data;}
        set { this.data = value; }
    }

    public int Index
    {
        get { return index;}
        set { this.index = value; }
    }
}