using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class StickerReader : MonoBehaviour
{
    [SerializeField]
    GameObject stickerPrefab;
    [SerializeField]
    RectTransform content;

    Sprite[] stickers;
    List<GameObject> stickerObjects;
    AudioClip[] soundClips;
    void Start()
    {
        stickerObjects = new List<GameObject>();
        stickers = Resources.LoadAll<Sprite>("Stickers/");
        InitializeStickers(stickers);
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    void InitializeStickers(Sprite[] stickers)
    {
        foreach(Sprite s in stickers)
        {
            GameObject stickerObj = Instantiate(stickerPrefab, content, false);
            stickerObj.name = s.name;
            Vector2 size = s.bounds.size;
            Image childImage = stickerObj.GetComponentsInChildren<Image>()[1];
            childImage.sprite = s;
            childImage.preserveAspect = true;
            childImage.SetNativeSize();
            stickerObj.GetComponent<BoxCollider2D>().size = size * 100;
            stickerObj.GetComponent<BoxCollider2D>().offset = new Vector2((size.x / 2), 0);
            //float scaledWidth = s.rect.width;
            //float scaledHeight = s.rect.height;
            //stickerObj.GetComponent<RectTransform>().sizeDelta = new Vector2(scaledWidth, scaledHeight);
            stickerObj.GetComponent<Sticker>().Size = new Vector2(s.rect.width, s.rect.height);
            
            content.sizeDelta = new Vector2(content.rect.width, content.rect.height + 250f);
            stickerObjects.Add(stickerObj);

            // Correct Position (if not using vertical layout group)
            //for (int i = 0; i < stickerObjects.Count; i++)
            //{
            //    RectTransform rt = stickerObjects[i].GetComponent<RectTransform>();
            //    if (i == 0)
            //    {
            //        rt.position = new Vector3(rt.position.x, rt.position.y + 125); // 125 should be replaced
            //    }
            //    else
            //    {
            //        rt.position = new Vector3(rt.position.x, 
            //            stickerObjects[i - 1].GetComponent<RectTransform>().position.y -
            //            stickerObjects[i].GetComponent<Image>().sprite.rect.height / 2f -
            //            stickerObjects[i - 1].GetComponent<Image>().sprite.rect.height / 2f - 125);
            //    }
            //}

        }
    }
}
