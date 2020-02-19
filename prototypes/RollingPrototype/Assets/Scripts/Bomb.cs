using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bomb : MonoBehaviour
{
    [SerializeField]
    float explosionForce;
    [SerializeField]
    float explosionRadius;
    [SerializeField]
    float upwardModifier;
    [SerializeField]
    float movingRadius;
    [SerializeField]
    float moveSpeed;
    [SerializeField]
    float rotationSpeed;

    bool movingToNext;
    Vector3 origin;
    Vector3 nextPos;
    Vector3 currPos;
    

    // Start is called before the first frame update
    void Start()
    {
        movingToNext = false;
        origin = transform.position;
    }

    // Update is called once per frame
    void Update()
    {
        if (!movingToNext)
        {
            movingToNext = true;
            currPos = transform.position;
            Vector2 nextPosRaw = Random.insideUnitCircle * movingRadius;
            nextPos = new Vector3(nextPosRaw.x, 0, nextPosRaw.y) + origin;
        }
        else
        {
            Vector3 dir = (nextPos - currPos).normalized;
            transform.Translate(dir * Time.deltaTime * moveSpeed / dir.magnitude);
            //transform.Rotate(new Vector3(dir.z, 0, rotationSpeed * dir.x));
            float distance = HorizontalDistance(nextPos, transform.position);
            if (distance < 1f || distance > movingRadius)
                movingToNext = false;
        }

    }

    public void Explode(Rigidbody rb)
    {
        rb.AddExplosionForce(explosionForce, transform.position, explosionRadius, upwardModifier);
    }

    float HorizontalDistance(Vector3 a, Vector3 b)
    {
        return Mathf.Sqrt((a.x - b.x) * (a.x - b.x) + (a.z - b.z) * (a.z - b.z));
    }
}
