using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CheckSoundPreview : MonoBehaviour
{
    private Color origColor;
    private void Start()
    {
        origColor = Color.white;
    }

    // Update is called once per frame
    void Update()
    {
        if(Camera.main.GetComponent<AudioSource>().isPlaying)
        {
            Color newColor = new Color();
            newColor.r = 0.6f;
            newColor.g = 0f;
            newColor.b = 1;
            newColor.a = 1;
            this.GetComponent<Image>().color = newColor;
        }
        else
        {
            this.GetComponent<Image>().color = origColor;
        }
    }
}
