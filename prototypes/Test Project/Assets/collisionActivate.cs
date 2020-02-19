using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class collisionActivate : MonoBehaviour
{
    public bool activate = false;
    private void OnCollisionEnter(Collision other) {
        if (other.collider.tag == "Objects" && activate == true) {
            Transform newSon = other.collider.transform;
            newSon.parent = transform;
            // newSon.gameObject.GetComponent<Collider>().enabled = false;
            //newSon.gameObject.GetComponent<Rigidbody>().isKinematic  = true;
            //newSon.gameObject.layer = layerNum;
            newSon.gameObject.GetComponent<AudioSource>().Play();
        }
    }
}
