using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GuessGuessCall : MonoBehaviour
{
    public GetValidationSound crossAudioList = new GetValidationSound(); 
    // Start is called before the first frame update
    [SerializeField]
    private Button guessButton;

    void Start()
    {
        Debug.Log("on guess guess button click");
        guessButton.onClick.AddListener(GetAudio);
        
    }

    public void GetAudio() {
        Debug.Log("on guess guess button click get audio");
        crossAudioList.GetSound();
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
