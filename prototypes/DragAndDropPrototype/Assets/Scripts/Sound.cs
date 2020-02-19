using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class Sound : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void Attach()
    {
        GameManager.instance.AttachSound(GetComponent<AudioSource>().clip);
        GameManager.instance.CloseSoundLib();
    }
}
