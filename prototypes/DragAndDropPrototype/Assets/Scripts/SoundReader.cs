using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SoundReader : MonoBehaviour
{
    [SerializeField]
    GameObject soundPrefab;
    [SerializeField]
    RectTransform content;

    AudioClip[] soundClips;
    bool loaded = false;

    // Start is called before the first frame update
    void Awake()
    {
        if (!loaded)
        {
            soundClips = Resources.LoadAll<AudioClip>("Sounds/");
            InitializeSounds(soundClips);
            loaded = true;
        }
        
    }
    // Update is called once per frame
    void Update()
    {
        
    }

    void InitializeSounds(AudioClip[] clips)
    {
        foreach (AudioClip c in clips)
        {
            GameObject soundObj = Instantiate(soundPrefab, content, false);
            soundObj.name = c.name;
            soundObj.GetComponent<AudioSource>().clip = c;
            soundObj.GetComponentInChildren<Text>().text = c.name;

            content.sizeDelta = new Vector2(0, content.rect.height + 260f);
        }
    }
}
