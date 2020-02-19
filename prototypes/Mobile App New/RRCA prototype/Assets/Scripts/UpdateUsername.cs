using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UpdateUsername : MonoBehaviour
{
    [SerializeField]
    private InputField username;

    [SerializeField]
    private StringVariable name;

    private void Start() {
        this.GetComponent<Text>().text = PlayerPrefs.GetString("username");
    }
}
