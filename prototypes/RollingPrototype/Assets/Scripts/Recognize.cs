using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Recognize : MonoBehaviour
{
    [SerializeField]
    float fadeTime;
    Text recognizeText;
    CanvasGroup canvasGroup;
    // Start is called before the first frame update
    void Start()
    {
        recognizeText = GetComponent<Text>();
        canvasGroup = GetComponent<CanvasGroup>();

        Debug.Assert(recognizeText != null, gameObject.name + ": no recognizeText found");
        Debug.Assert(canvasGroup != null, gameObject.name + ": no canvasGroup found");
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    // Show real-time recognition (ignore my typo for the method name for now) 
    // of whose sound is being collected now.
    public IEnumerator ShowRecognization(string userName)
    {

        recognizeText = GetComponent<Text>();
        canvasGroup = GetComponent<CanvasGroup>();

        Debug.Assert(recognizeText != null, gameObject.name + ": no recognizeText found");
        Debug.Assert(canvasGroup != null, gameObject.name + ": no canvasGroup found");

        recognizeText.text = "Sound from <color=#F85797>" + userName + "</color> is collected!";
        float elapsedTime = 0f;
        while (elapsedTime < fadeTime)
        {
            elapsedTime += Time.deltaTime;
            canvasGroup.alpha = elapsedTime / fadeTime;
            yield return null;
        }
        yield return new WaitForSeconds(3);
        while (elapsedTime > 0f)
        {
            elapsedTime -= Time.deltaTime;
            canvasGroup.alpha = elapsedTime / fadeTime;
            yield return null;
        }

    }
}
