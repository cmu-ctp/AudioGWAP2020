using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;

public class InputToken : MonoBehaviour
{
    [SerializeField]
    Text errorText;

    InputField inputField;
    // Start is called before the first frame update
    void Start()
    {
        inputField = GetComponent<InputField>();
        inputField.ActivateInputField();
    }

    // Update is called once per frame
    void Update()
    {
        if (!inputField.isFocused && inputField.text != "")
        {
            if (Input.GetKeyDown(KeyCode.Return))
            {
                StartCoroutine(ParseToken(inputField.text));
            }
        }
    }

    // Handling if the input token is valid or not.
    // TO DO: change the url into the new server's url
    IEnumerator ParseToken(string token)
    {    
        string responseBody;
        // "https://echoes.etc.cmu.edu
        using (UnityWebRequest req = UnityWebRequest.Get("https://hcii-gwap-01.andrew.cmu.edu/api/game/events/" + token + "/sound"))
        {
            yield return req.SendWebRequest();
            if (req.isNetworkError || req.isHttpError)
            {
                if (req.responseCode == 404L)
                {
                    errorText.text = "Invalid token. Please enter again.";
                }
                inputField.text = "";
                inputField.ActivateInputField();
                StartCoroutine(ClearErrorText());
                yield break;
            }
            responseBody = DownloadHandlerBuffer.GetContent(req);
            PlayerPrefs.SetString("body", responseBody);
            SceneManager.LoadScene(1);
        }
    }

    IEnumerator ClearErrorText()
    {
        yield return new WaitForSeconds(2);
        errorText.text = "";
    }

    public void Parse()
    {
        StartCoroutine(ParseToken(inputField.text));
    }
}
