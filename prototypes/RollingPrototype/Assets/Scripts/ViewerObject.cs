using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Prerequisites:
// 1.  All models should have the correct relative sizes
// 2a. Should make it works for all kinds of models later,
//     so the model reference should be changed, or
// 2b. Customized script for each type of models because 
//     of many small differences might need to be handled,
//     such as collider

public class ViewerObject : MonoBehaviour
{
    [SerializeField]
    Material[] materials;
    [SerializeField]
    SkinnedMeshRenderer model;
    [SerializeField]
    float minScale;
    [SerializeField]
    float maxScale;
    [SerializeField]
    public Mesh replaceModel;

    [HideInInspector]
    public float immuneToBeCollected;
    [HideInInspector]
    public string uploaderName;
    [HideInInspector]
    public Vector3 spawnPoint;
    [HideInInspector]
    public bool isOutdoor;
    [HideInInspector]
    public string soundId;

    string[] tags;
    bool playStarted;
    float playedTime;
    

    void Start()
    {
        if (materials.Length > 0)
        {
            int materialIndex = Random.Range(0, materials.Length);
            model.material = materials[materialIndex];
        }
        
        float scaleFactor = Random.Range(minScale, maxScale);
        transform.localScale = new Vector3(scaleFactor * transform.localScale.x, 
            scaleFactor * transform.localScale.y, scaleFactor * transform.localScale.z);

        immuneToBeCollected = 0f;
        playStarted = false;
        playedTime = 0f;
    }

    // Update is called once per frame
    void Update()
    {
        if (immuneToBeCollected > 0)
        {
            immuneToBeCollected -= Time.deltaTime;
            if (immuneToBeCollected <= 0f)
                Destroy(gameObject);
        }

        if (transform.position.y < 0)
        {
            transform.position = new Vector3(transform.position.x, 0.5f, transform.position.z);
        }

        if (playStarted)
        {
            playedTime += Time.deltaTime;
            if (playedTime >= 15f)
            {
                GetComponent<AudioSource>().Stop();
                playStarted = false;
            }
        }
    }

    public void SetTags(string[] tags)
    {
        this.tags = tags;
    }

    public void Collected()
    {
        GetComponent<AudioSource>().Play();
        playStarted = true;
        if (GetComponent<Animator>() != null)
            GetComponent<Animator>().enabled = false;
        if (GetComponent<Animation>() != null)
            GetComponent<Animation>().enabled = false;
        GetComponent<Rigidbody>().isKinematic = true;

        GameManager.instance.EmptyPoint(spawnPoint, isOutdoor);
        GameManager.instance.CheckEnoughSpace();
        GameManager.instance.totalItemCollected++;
        
        switch (GameManager.instance.currentTask)
        {
            case TaskType.Indoor:
                if (!isOutdoor)
                    GameManager.instance.UpdateGoal(1, gameObject);
                break;
            case TaskType.Outdoor:
                if (isOutdoor)
                    GameManager.instance.UpdateGoal(1, gameObject);
                break;
            case TaskType.UniqueInRow:
                if (GameManager.instance.playerCollected.Contains(gameObject.name))
                {
                    GameManager.instance.playerCollected.Clear();
                    GameManager.instance.UpdateGoal(-100, gameObject);
                }
                else
                {
                    GameManager.instance.playerCollected.Add(gameObject.name);
                    GameManager.instance.UpdateGoal(1, gameObject);
                }
                    
                break;
            case TaskType.UniqueTotal:
                if (!GameManager.instance.playerCollected.Contains(gameObject.name))
                {
                    GameManager.instance.playerCollected.Add(gameObject.name);
                    GameManager.instance.UpdateGoal(1, gameObject);
                }
                break;
            case TaskType.Destination:
                break;
        }  
    }

    public void SetObjectInfo(string name, Vector3 pos, bool outdoor, string id)
    {
        uploaderName = name;
        spawnPoint = pos;
        isOutdoor = outdoor;
        soundId = id;
    }
}
