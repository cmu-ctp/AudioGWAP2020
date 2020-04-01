using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SelfDestruction : MonoBehaviour
{
    public void DestroySelf()
    {
        Destroy(gameObject, 5f);
    }
}
