using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Leaderboard : MonoBehaviour
{
    [SerializeField]
    GameObject timer;
    [SerializeField]
    GameObject instruction;

    [Header("Sounds collected")]
    [SerializeField]
    Text soundTop1Name;
    [SerializeField]
    Text soundTop1Count;
    [SerializeField]
    Text soundTop2Name;
    [SerializeField]
    Text soundTop2Count;
    [SerializeField]
    Text soundTop3Name;
    [SerializeField]
    Text soundTop3Count;

    [Header("Items collected")]
    [SerializeField]
    Text itemTop1Name;
    [SerializeField]
    Text itemTop1Count;
    [SerializeField]
    Text itemTop2Name;
    [SerializeField]
    Text itemTop2Count;
    [SerializeField]
    Text itemTop3Name;
    [SerializeField]
    Text itemTop3Count;
    [SerializeField]
    Text totalItemCount;
    [SerializeField]
    Text totalTaskCount;

    void Start()
    {

    }

    void Update()
    {
        
    }

    public void UpdateSoundBoard(string user1, int count1, string user2, int count2, string user3, int count3)
    {
        if (user1.Length > 0)
        {
            soundTop1Name.text = user1;
            soundTop1Count.text = count1.ToString();
        }
            
        if (user2.Length > 0)
        {
            soundTop2Name.text = user2;
            soundTop2Count.text = count2.ToString();
        }
            
        if (user3.Length > 0)
        {
            soundTop3Name.text = user3;
            soundTop3Count.text = count3.ToString();
        }       
    }

    public void UpdateItemBoard(string obj1, int count1, string obj2, int count2, string obj3, int count3, int totalItem, int tasks)
    {
        if (obj1.Length > 0)
        {
            itemTop1Name.text = obj1;
            itemTop1Count.text = count1.ToString();
        }
        
        if (obj2.Length > 0)
        {
            itemTop2Name.text = obj2;
            itemTop2Count.text = count2.ToString();
        }
        
        if (obj3.Length > 0)
        {
            itemTop3Name.text = obj3;
            itemTop3Count.text = count3.ToString();
        }

        totalItemCount.text = "Total items collected: " + totalItem;
        totalTaskCount.text = "Tasks completed: " + tasks;
    }
}
