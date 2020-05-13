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

    // Get the sound list of this event from server.
    // TO DO: change the url to the new server's url
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

        // Maybe a better way to avoid networking burst - adding this will at least
        // not temporarily make the network down.
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

    // Used by generating game pieces to map.
    void InitObjectIndexDict()
    {
        objectIndexes = new Dictionary<string, int>();
        for(int i = 0; i < objectPrefabs.Length; i++)
        {
            objectIndexes[objectPrefabs[i].name] = i;
        }
    }

    // Spawn each individual game piece into the game, by get the type of 
    // the game piece, the user who upload the sound, the sound attached to it,
    // and the sound id (determine if this sound is unique).
    IEnumerator Spawn(string displayName, string modelName, string path, string id)
    {
        // increase the number of objects in scene
        GameManager.instance.objectsInScene++;
        int objectIndex;
        if (!objectIndexes.TryGetValue(modelName, out objectIndex))
        {
            objectIndex = 0;
        }

        // Will always fill the outdoor spaces first, then indoor. This is by
        // design since during playtest streamers tend not to get into the interior.
        // Change it if the design changes.
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

        // Found the position, instantiate it at that position.
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
    
    // Delayed files are those not spawning due to capacity issue at the beginning
    public IEnumerator SpawnDelayedFiles(int number)
    {
        for (int i = 0; i < number; i++)
        {
            SoundObject sound = delayedFiles.Dequeue();
            yield return StartCoroutine(Spawn(sound.displayName, sound.modelName, sound.path, sound.id));
        }
    }


}
