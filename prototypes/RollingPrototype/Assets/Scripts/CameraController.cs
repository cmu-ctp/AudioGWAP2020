using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour {

    [SerializeField]
    private Vector3 dir;
    [SerializeField]
    private float verticalOffset;
    [SerializeField]
    float rorateSpeed;
    [SerializeField]
    GameObject player;

    private float horizontal = 0f;
    private float vertical = 0f;

    private Vector3 velocity = Vector3.zero;

	void Start ()
    {
        transform.position = player.transform.position;
	}

    void Update()
    {
        //Follow
        // transform.position = Vector3.SmoothDamp(transform.position, player.position + dir, ref velocity, smoothTime);

        //Viewing Angle
        if (GameManager.instance.gameState == GameState.Playing)
        {
            horizontal += rorateSpeed * Input.GetAxis("Mouse X");
            vertical -= rorateSpeed * Input.GetAxis("Mouse Y");

            vertical = Mathf.Clamp(vertical, 15, 45);

            transform.rotation = Quaternion.Euler(new Vector3(transform.localEulerAngles.x, horizontal, 0));
        }           
    }

    private void LateUpdate()
    {
        Quaternion rotation = Quaternion.Euler(vertical, horizontal, 0);
        transform.position = player.transform.position + rotation * dir;
        transform.LookAt(player.transform.position + new Vector3(0, verticalOffset, 0));
    }
}
