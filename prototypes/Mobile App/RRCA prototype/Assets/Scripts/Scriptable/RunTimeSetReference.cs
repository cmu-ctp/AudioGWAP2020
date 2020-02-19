using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public abstract class RunTimeSetReference<T> : ScriptableObject
{
    [SerializeField]
    private List<T> items = new List<T>();

    private int countOfNumbers;

    public List<T> list
    {
        get { return items;}
        set { this.items = value;}
    }

    public int count
    {
        get {return list.Count;}
        set {this.countOfNumbers = value;}
    }

    public void Add(T t)
    {
        if(!items.Contains(t))
        { 
            items.Add(t);
        }
    }

    public void Remove(T t)
    {
        if(items.Contains(t)) items.Remove(t);
    }

    public void RemoveAll()
    {
        foreach(T t in items)
        {
            Debug.Log("yes");
            items.Remove(t);
        }
    }
}