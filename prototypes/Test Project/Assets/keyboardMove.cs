using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class keyboardMove : MonoBehaviour
{
    [SerializeField]
    private float speed;
    
    [SerializeField]
    private float brakeSpeed;
    

    private bool isBraking = false;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        Vector3 currentForce = Vector3.zero;
        // if (Input.GetKey("up")) {
        //     currentForce += new Vector3(0,0,1) * speed;
        // }
        // if (Input.GetKey("down")) {
        //     currentForce += new Vector3(0,0,-1) * speed;
        // }
        // if (Input.GetKey("left")) {
        //     currentForce += new Vector3(-1,0,0) * speed;
        // }
        // if (Input.GetKey("right")) {
        //     currentForce += new Vector3(1,0,0) * speed;
        // }

        currentForce = new Vector3(Input.GetAxis("Vertical"), 0, -Input.GetAxis("Horizontal")) * speed;
        
        if (currentForce != Vector3.zero) {        
            GetComponent<Rigidbody>().AddTorque(currentForce);
            isBraking = false;

        } else {
            Vector3 curSpeed = GetComponent<Rigidbody>().velocity;
            if (curSpeed.magnitude < 0.01f) {
                curSpeed = Vector3.zero;
                GetComponent<Rigidbody>().velocity = Vector3.zero; 
            }
            if (curSpeed != Vector3.zero) {
                isBraking = true;
            } else {
                isBraking = false;
            }
            if (isBraking == true) {
                GetComponent<Rigidbody>().velocity = GetComponent<Rigidbody>().velocity * brakeSpeed;
            }
        }

    }
}
