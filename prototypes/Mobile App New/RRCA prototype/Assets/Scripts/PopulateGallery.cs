using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PopulateGallery : MonoBehaviour
{
    [SerializeField]
    private ListOfStringsVariable audioFilesNames, audioFilesLength, audioFilesValidations;

    [SerializeField]
    private IntVariable updatedIndex;

    [SerializeField]
    private IntVariable[] soundItemData; // firstPos, Offset, increment

    [SerializeField]
    private GameObject soundItemPrefab;

    private GameObject parentOfSoundItem;
    private int populatedNumberOfFiles;
    private Vector2 originalSize;
    
    public void StartPopulating()
    {
        populatedNumberOfFiles = 0;
        parentOfSoundItem = this.gameObject;
        originalSize = parentOfSoundItem.GetComponent<RectTransform>().sizeDelta;
        InitialPopulate();
    }

    public void Reset()
    {
        this.transform.localPosition = Vector3.zero;
    }

    void InitialPopulate()
    {
        for(int i = 0; i < PlayerPrefs.GetInt("NumberOfAudioFiles"); i++)
        {
            audioFilesNames.Value.Add(PlayerPrefs.GetString(i.ToString()));
            audioFilesLength.Value.Add(PlayerPrefs.GetString("Length_" + i.ToString()));
            audioFilesValidations.Value.Add(PlayerPrefs.GetString(i.ToString()));
        }

        foreach(string s in audioFilesNames.Value)
        {
            InstantiateSoundItem();
        }
    }

    public void UpdatePopulate()
    {
        if(populatedNumberOfFiles < audioFilesLength.Value.Count)
        {
            InstantiateSoundItem();
        }
        else
        {
            Transform ut = parentOfSoundItem.transform.GetChild(updatedIndex.Value).GetChild(2);
            ut.gameObject.GetComponent<Text>().text = audioFilesLength.Value[updatedIndex.Value];
        }
    }

    private void InstantiateSoundItem()
    {
        GameObject g = Instantiate(soundItemPrefab);
        if(parentOfSoundItem == null)
        {
            parentOfSoundItem = this.gameObject;
        }
        g.transform.SetParent(parentOfSoundItem.transform);

        int yPos = soundItemData[0].Value + soundItemData[1].Value * populatedNumberOfFiles;
        g.transform.localScale = Vector3.one;
        g.transform.localPosition = new Vector3(275, yPos, 0);

        g.transform.GetChild(1).gameObject.GetComponent<Text>().text = audioFilesNames.Value[populatedNumberOfFiles];
        g.transform.GetChild(2).gameObject.GetComponent<Text>().text = audioFilesLength.Value[populatedNumberOfFiles];
        g.transform.GetChild(3).gameObject.GetComponent<Text>().text = audioFilesValidations.Value[populatedNumberOfFiles];
        populatedNumberOfFiles++;

        parentOfSoundItem.GetComponent<RectTransform>().sizeDelta += new Vector2(0, soundItemData[2].Value);
    }
}