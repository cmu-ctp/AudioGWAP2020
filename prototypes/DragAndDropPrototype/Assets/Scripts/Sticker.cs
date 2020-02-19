using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class Sticker : MonoBehaviour, IDragHandler, IPointerEnterHandler, IPointerExitHandler
{
    [SerializeField]
    private Material grey;
    [SerializeField]
    private float scaleSpeed;
    [SerializeField]
    GameObject stickerImage;

    public Vector2 Size;

    bool mouseOver;
    bool active;


    void Start()
    {
        Deactivate();  
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.A))
            Activate();
        else if (Input.GetKeyDown(KeyCode.D))
            Deactivate();

        if (mouseOver)
        {
            if (Input.GetAxis("Mouse ScrollWheel") > 0f)
            {
                stickerImage.GetComponent<RectTransform>().sizeDelta += new Vector2(scaleSpeed, scaleSpeed);
            }
            else if (Input.GetAxis("Mouse ScrollWheel") < 0f)
            {
                if (stickerImage.GetComponent<RectTransform>().sizeDelta.x > Size.x)
                    stickerImage.GetComponent<RectTransform>().sizeDelta -= new Vector2(scaleSpeed, scaleSpeed);
            }
        }
    }

    public void OnDrag(PointerEventData eventData)
    {
        if (active)
            transform.position += (Vector3)eventData.delta;
    }

    public void AddSound()
    {
        if (!active)
        {
            GameManager.instance.ShowSoundLib(gameObject);
            GetComponent<RectTransform>().sizeDelta = new Vector2(Size.x + 12, Size.y + 12);
            GetComponent<Image>().color = Color.yellow;
        }  
    }

    public void Deactivate()
    {   
        active = false;
        stickerImage.GetComponent<Image>().material = grey;
    }

    public void Activate()
    {
        active = true;
        stickerImage.GetComponent<Image>().material = null;
    }

    public void AttachSound(AudioClip clip)
    {
        GetComponent<AudioSource>().clip = clip;
        Activate();
        ResetHighlight();
    }

    public void ResetHighlight()
    {
        GetComponent<RectTransform>().sizeDelta = Vector2.zero;
    }

    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.tag == "Library")
        {
            transform.SetParent(GameObject.Find("GameArea").transform);
            GameManager.instance.sceneObjects.Add(gameObject);
        }
    }

    private void OnMouseOver()
    {
        
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        mouseOver = true;
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        mouseOver = false;
    }
}
