using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class RotateGamePiece : MonoBehaviour
{
    [SerializeField]
    RecordManager recordManager;

    [SerializeField]
    private ListOfStringsVariable gamePiecesList;

    [SerializeField]
    private IntVariable chosenGamePiece;

    [SerializeField]
    private Transform gamePieces;

    [SerializeField]
    private Button[] gamePieceMovingButtons; // left, right

    [SerializeField]
    private Button confirmButton, backHomeButton;

    [SerializeField]
    private IntVariable rotateSpeed;

    private int index;
    private bool keepRotating;


    void Start()
    {
        //index = chosenGamePiece.Value;
        //if(PlayerPrefs.GetInt("chosenGamePiece") == -1)
        //{
            index = 0;
            gamePieceMovingButtons[0].onClick.AddListener(OnClickLeftButton);
            gamePieceMovingButtons[1].onClick.AddListener(OnClickRightButton);
            confirmButton.onClick.AddListener(OnConfirmButtonClick);
        //}
    //    else
    //    {
    //        index = PlayerPrefs.GetInt("chosenGamePiece");
    //        keepRotating = false;
    //         gamePieceMovingButtons[0].gameObject.SetActive(false);
    //         gamePieceMovingButtons[1].gameObject.SetActive(false);
    //         confirmButton.gameObject.SetActive(false);
    //         backHomeButton.gameObject.SetActive(true);
    //    }
        keepRotating = false;
        ActivateGamePiece();
    }

    void OnClickLeftButton()
    {
        gamePieces.GetChild(index).gameObject.SetActive(false);

        index--;
        if(index < 0)
        {
            index = gamePiecesList.Value.Count - 1;
        }

        ActivateGamePiece();
    }

    void OnClickRightButton()
    {
        gamePieces.GetChild(index).gameObject.SetActive(false);

        index++;
        if(index >= gamePiecesList.Value.Count)
        {
            index = 0;
        }

        ActivateGamePiece();
    }

    void OnConfirmButtonClick()
    {
        chosenGamePiece.Value = index;
        PlayerPrefs.SetInt("chosenGamePiece", index);
        recordManager.GamepieceUpdate(gamePiecesList, index);
        //keepRotating = false;
        //gamePieceMovingButtons[0].gameObject.SetActive(false);
        //gamePieceMovingButtons[1].gameObject.SetActive(false);
        //confirmButton.gameObject.SetActive(false);
        if(!backHomeButton.gameObject.activeSelf)
        {
            backHomeButton.gameObject.SetActive(true);
        }
    }

    void ActivateGamePiece()
    {
        gamePieces.GetChild(index).gameObject.SetActive(true);
    }

    void OnClickGamePiece()
    {
        if(!keepRotating)
        {
            Transform gamePiece = gamePieces.GetChild(index);
            StartCoroutine(RotatingGamePieceOnTouch(gamePiece));
        }
    }

    IEnumerator RotatingGamePieceOnTouch(Transform gamePiece)
    {
        keepRotating = true;

        while(keepRotating)
        {
            foreach(Touch touch in Input.touches)
            {
                if(touch.phase == TouchPhase.Ended)
                {
                    keepRotating = false;
                }
            }
            gamePiece.Rotate(0, rotateSpeed.Value * Time.deltaTime, 0);
            yield return null;
        }
    }
}
