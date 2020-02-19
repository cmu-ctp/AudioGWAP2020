using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Reference<T> : ScriptableObject
{
    [SerializeField] private T data;
    public T Value
    {
        get { return data;}
        set { this.data = value; }
    }
}