using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using UnityEngine.Networking;

public class ObjectSpawner : MonoBehaviour
{
    [SerializeField]
    Vector3[] spawningSpots;
    [SerializeField]
    float spawningRadius;
    [SerializeField]
    GameObject[] objectPrefabs;
    [SerializeField]
    Dictionary<string, int> objectIndexes;
    [SerializeField]
    GetSpawningPoints spawningPoints;

    [HideInInspector]
    public Queue<SoundObject> delayedFiles;

    List<SoundObject> sounds;

    void Start()
    {
        sounds = new List<SoundObject>();
        InitObjectIndexDict();
        StartCoroutine(GetSoundList());
        delayedFiles = new Queue<SoundObject>();
    }

    void Update()
    {

    }

    IEnumerator GetSoundList()
    {
        string responseBody = PlayerPrefs.GetString("body");

        SoundFetchAPIResult result = JsonUtility.FromJson<SoundFetchAPIResult>(responseBody);
        if (result.result != null)
        {
            foreach (SoundData sound in result.result)
            {
                string path = "https://echoes.etc.cmu.edu" + sound.path;
                string displayName = sound.user.display_name;
                string modelName = sound.game_meta.model;
                string id = sound.id;

                sounds.Add(new SoundObject(path, displayName, modelName, id));
            }
        }

        yield return null;

        GameManager.instance.totalNumObjects = sounds.Count;
        int repetition = GameManager.instance.totalNumPoints / GameManager.instance.totalNumObjects;
        for (int i = 0; i < Mathf.Max(1, repetition); i++)
        {
            foreach (SoundObject sound in sounds)
            {
                if (GameManager.instance.objectsInScene < GameManager.instance.totalNumPoints)
                {

                    yield return StartCoroutine(Spawn(sound.displayName, sound.modelName, sound.path, sound.id));
                }
                else
                {
                    delayedFiles.Enqueue(sound);
                }
            }
        }      
    }

    void InitObjectIndexDict()
    {
        objectIndexes = new Dictionary<string, int>();
        for(int i = 0; i < objectPrefabs.Length; i++)
        {
            objectIndexes[objectPrefabs[i].name] = i;
        }
    }

    IEnumerator Spawn(string displayName, string modelName, string path, string id)
    {
        GameManager.instance.objectsInScene++;
        int objectIndex;
        if (!objectIndexes.TryGetValue(modelName, out objectIndex))
        {
            objectIndex = 0;
        }

        Vector3 position = spawningPoints.GetOutdoorPos();
        bool isOutdoor = false;
        if (!float.IsInfinity(position.x))
            isOutdoor = true;
        else
            position = spawningPoints.GetIndoorPos();

        if (float.IsInfinity(position.x))
        {
            Debug.Log(position);
            yield break;
        }       

        GameObject spawnedObj = Instantiate(objectPrefabs[objectIndex], position, Quaternion.identity);
        spawnedObj.GetComponent<ViewerObject>().SetObjectInfo(displayName, position, isOutdoor, id);
        if (isOutdoor)
            GameManager.instance.objectsOutdoor++;
        else
            GameManager.instance.objectsIndoor++;

        AudioClip clip;
        using (UnityWebRequest req = UnityWebRequestMultimedia.GetAudioClip(path, AudioType.WAV))
        {
            yield return req.SendWebRequest();
            if (req.isNetworkError || req.isHttpError)
            {
                Debug.LogError(req.error);
                yield break;
            }
            clip = DownloadHandlerAudioClip.GetContent(req);
        }
        spawnedObj.GetComponent<AudioSource>().clip = clip;

        GameManager.instance.allObjectsInScene.Add(spawnedObj);
    }
    
    public IEnumerator SpawnDelayedFiles(int number)
    {
        for (int i = 0; i < number; i++)
        {
            SoundObject sound = delayedFiles.Dequeue();
            yield return StartCoroutine(Spawn(sound.displayName, sound.modelName, sound.path, sound.id));
        }
    }


}
