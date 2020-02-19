using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PrepCameraController : MonoBehaviour
{
    [SerializeField]
    GameObject playerPrefab;
    [SerializeField]
    GameObject gameCamera;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        transform.position += new Vector3(Input.GetAxis("Horizontal"), -Input.GetAxis("Mouse ScrollWheel") * 15, Input.GetAxis("Vertical"));

        if (Input.GetMouseButtonUp(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            Vector3 pos;
            if (Physics.Raycast(ray, out hit))
            {
                pos = new Vector3(hit.point.x, 3, hit.point.z);
                GameObject player = Instantiate(playerPrefab, pos, Quaternion.identity);
                gameCamera.SetActive(true);
                //gameCamera.GetComponent<CameraController>().player = player;
                player.GetComponent<Player>().mainCamera = gameCamera.transform;
                gameObject.SetActive(false);
            }
        }
    }
}
