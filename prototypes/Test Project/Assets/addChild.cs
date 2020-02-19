using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class addChild : MonoBehaviour
{
    private int layerNum;
    private void Start() {
        layerNum = LayerMask.NameToLayer("Player");
        //Physics.IgnoreLayerCollision(layerNum, layerNum);
    }
    private void OnCollisionEnter(Collision other) {
        if (other.collider.tag == "Objects") {
            Transform newSon = other.collider.transform;
            newSon.parent = transform;
            // newSon.gameObject.GetComponent<Collider>().enabled = false;
            //newSon.gameObject.GetComponent<Rigidbody>().isKinematic  = true;
            //newSon.gameObject.layer = layerNum;
            if (newSon.gameObject.GetComponent<AudioSource>() != null) {
                newSon.gameObject.GetComponent<AudioSource>().Play();
            }
            if (newSon.gameObject.GetComponent<collisionActivate>() != null) {
                newSon.gameObject.GetComponent<collisionActivate>().activate = true;
            }
            
        }
    }
}
