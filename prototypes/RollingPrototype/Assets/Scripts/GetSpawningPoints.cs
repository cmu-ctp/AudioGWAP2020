using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GetSpawningPoints : MonoBehaviour
{
    [HideInInspector]
    public List<Vector3> indoorList;
    [HideInInspector]
    public List<Vector3> outdoorList;
    [SerializeField]
    private string indoorTag;
    [SerializeField]
    private string outdoorTag;

    public void InitSpawningPoints()
    {
        indoorList = new List<Vector3>();
        outdoorList = new List<Vector3>();
        FindIndoor();
        FindOutdoor();
    }

    private void FindIndoor()
    {
        GameObject[] indoorObjs = GameObject.FindGameObjectsWithTag(indoorTag);
        
        int counter = 0;
        foreach (GameObject obj in indoorObjs)
        {
            indoorList.Add(obj.transform.position);
            counter++; 
        }    
    }

    private void FindOutdoor() {
        GameObject[] outdoorObjs = GameObject.FindGameObjectsWithTag(outdoorTag);
        
        int counter = 0;
        foreach (var obj in outdoorObjs)
        {
            outdoorList.Add(obj.transform.position);
            counter++; 
        }    
    }

    public Vector3 GetIndoorPos()
    {
        //if (indoorList.Count == 0)
        //    FindIndoor();
        //int index = Random.Range(0, indoorList.Count);
        //Vector3 pos = indoorList[index];
        //indoorList.RemoveAt(index);
        //return pos;

        if (indoorList.Count > 0)
        {
            int index = Random.Range(0, indoorList.Count);
            Vector3 pos = indoorList[index];
            indoorList.RemoveAt(index);
            return pos;
        }
        else
        {
            return Vector3.positiveInfinity;
        }
        
    }

    public Vector3 GetOutdoorPos()
    {
        //if (outdoorList.Count == 0) { }
        //    FindOutdoor();
        //int index = Random.Range(0, outdoorList.Count);
        //Vector3 pos = outdoorList[index];
        //outdoorList.RemoveAt(index);
        //return pos;

        if (outdoorList.Count > 0)
        {
            int index = Random.Range(0, outdoorList.Count);
            Vector3 pos = outdoorList[index];
            outdoorList.RemoveAt(index);
            return pos;       
        }
        else
        {
            return Vector3.positiveInfinity;
            //return GetIndoorPos();
        }
    }
}
