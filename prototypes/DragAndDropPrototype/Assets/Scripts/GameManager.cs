using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;

    [HideInInspector]
    public List<GameObject> sceneObjects;
    [HideInInspector]
    public GameObject stickerToAttach;

    [SerializeField]
    GameObject soundLib;
    [SerializeField]
    float interval;

    

    // Start is called before the first frame update
    void Start()
    {
        if (instance == null)
            instance = this;
        sceneObjects = new List<GameObject>();
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            PlaySymphony(1);
        }
        else if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            PlaySymphony(2);
        }
        else if (Input.GetKeyDown(KeyCode.Alpha3))
        {
            PlaySymphony(3);
        }

        if (Input.GetMouseButtonDown(1))
        {
            if (stickerToAttach != null)
            {
                stickerToAttach.GetComponent<Sticker>().ResetHighlight();
                CloseSoundLib();
            }
        }
    }

    void PlaySymphony(int mode)
    {
        StopAllCoroutines();
        foreach (GameObject o in sceneObjects)
        {
            o.GetComponent<AudioSource>().Stop();
        }

        switch (mode)
        {
            case 1: // Play all together
                if (sceneObjects.Count > 0)
                {
                    foreach (GameObject o in sceneObjects)
                    {
                        o.GetComponent<AudioSource>().Play();
                    }
                }
                break;
            case 2: // Play with interval in order of adding into the scene
                StartCoroutine(PlayInterval(false));
                break;
            case 3: // Play with interval with shuffled order
                StartCoroutine(PlayInterval(true));
                break;
            default:
                break;
        }
    }

    IEnumerator PlayInterval(bool shuffle)
    {
        if (sceneObjects.Count > 0)
        {
            if (shuffle)
            {
                for (int i = 0; i < sceneObjects.Count; i++)
                {
                    GameObject temp = sceneObjects[i];
                    int randomIndex = Random.Range(i, sceneObjects.Count);
                    sceneObjects[i] = sceneObjects[randomIndex];
                    sceneObjects[randomIndex] = temp;
                }
            }
            foreach (GameObject o in sceneObjects)
            {
                o.GetComponent<AudioSource>().Play();
                yield return new WaitForSeconds(interval);
            }
        }
    }

    public void ShowSoundLib(GameObject sticker)
    {
        if (stickerToAttach != null)
        {
            stickerToAttach.GetComponent<Sticker>().ResetHighlight();
        }
        soundLib.SetActive(true);
        stickerToAttach = sticker;
    }

    public void CloseSoundLib()
    {
        soundLib.SetActive(false);
    }

    public void AttachSound(AudioClip clip)
    {
        stickerToAttach.GetComponent<Sticker>().AttachSound(clip);
    }
}
