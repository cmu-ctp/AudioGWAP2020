using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Timer : MonoBehaviour
{
    [SerializeField]
    float timeCount;
    [SerializeField]
    GameObject leaderboard;

    float timeLeft;
    Text timerText;
    int lastSecond;
    void Awake()
    {
        timeLeft = timeCount;
        timerText = GetComponent<Text>();
    }

    // The timer of the game. End the game if reaches 0. 
    // It updates the associated UI element, and will show special effect
    // if there is not too much time left.
    void Update()
    {
        if (timeLeft > 0f)
            timeLeft -= Time.deltaTime;
        int minutePart = Mathf.Max(0, Mathf.FloorToInt(timeLeft / 60));
        int secondPart = Mathf.Max(0, Mathf.FloorToInt(timeLeft % 60));
        if (secondPart > 9)
            timerText.text = minutePart + ":" + secondPart;
        else
            timerText.text = minutePart + ":0" + secondPart;

        // Show red blinking if less than 30 seconds left
        if(timeLeft <= 30f && lastSecond != secondPart)
        {
            timerText.color = new Color(1, 0, 0);
            Debug.Log("inside");
        }

        lastSecond = secondPart;
        timerText.color = new Color(timerText.color.r,
            Mathf.Min(timerText.color.g + (Time.deltaTime), 1),
            Mathf.Min(timerText.color.b + (Time.deltaTime), 1));


        if (timeLeft <= 0f)
        {
            // Trigger result        
            GameManager.instance.SortAndDisplayLeaderboard();
            GameManager.instance.GameEndWrapper();
            //leaderboard.SetActive(true);
            gameObject.SetActive(false);
        }
    }
}
