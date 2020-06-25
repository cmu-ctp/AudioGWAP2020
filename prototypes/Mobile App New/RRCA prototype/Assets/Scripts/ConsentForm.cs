using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ConsentForm : MonoBehaviour
{
    [SerializeField]
    private Toggle checkbox1;
    [SerializeField]
    private Toggle checkbox2;
    [SerializeField]
    private Toggle checkbox3;

    [SerializeField]
    private Button acceptButton;
    // Start is called before the first frame update
    void Start()
    {
        acceptButton.gameObject.SetActive(false);
        
    }

    // Update is called once per frame
    void Update()
    {
        if (checkbox1.isOn && checkbox2.isOn && checkbox3.isOn) {
            Debug.Log("toggle is on");
            acceptButton.gameObject.SetActive(true);
        }
        else {
            acceptButton.gameObject.SetActive(false);
        }
        
    }
}
