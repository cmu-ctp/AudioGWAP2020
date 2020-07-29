using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{

    [SerializeField]
    private float moveSpeed;
    [SerializeField]
    private float maxAngularVelocity;
    [SerializeField]
    private float jumpForce;
    [SerializeField]
    private float fallFactor;
    [SerializeField]
    private float lowJumpFactor;
    [SerializeField]
    private float brakeSpeed;
    [SerializeField]
    MeshRenderer model;
    [SerializeField]
    float enlargeFactor;
    [SerializeField]
    Transform ball;
    [SerializeField]
    public Transform mainCamera;
    [SerializeField]
    Recognize recognizeText;

    private Rigidbody rb;
    private bool onGround;
    private bool isBraking;
    private int objectCount;
    List<Transform> collectedObjects;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        objectCount = 0;
        collectedObjects = new List<Transform>();
        rb.maxAngularVelocity = maxAngularVelocity;
        Debug.Log("Player started");
    }

    void Update()
    {
        if (GameManager.instance.gameState == GameState.Playing)
        {
            //Move and rotate. It will brake automatically if the keys are not held.
            float x = Input.GetAxis("Horizontal");
            float z = Input.GetAxis("Vertical");

            Vector3 torque = new Vector3(z * moveSpeed, 0, -x * moveSpeed);

            Vector3 turnedTorque = Quaternion.Euler(0, mainCamera.eulerAngles.y, 0) * torque;

            if (turnedTorque != Vector3.zero)
            {
                rb.AddTorque(turnedTorque, ForceMode.Force);
                isBraking = false;
            }
            else if (onGround)
            {
                Vector3 currentSpeed = rb.velocity;
                if (currentSpeed.magnitude < 0.01f)
                {
                    currentSpeed = Vector3.zero;
                    rb.velocity = Vector3.zero;
                    isBraking = false;
                }
                if (currentSpeed != Vector3.zero)
                {
                    isBraking = true;
                }

                if (isBraking)
                {
                    rb.velocity *= brakeSpeed;
                }
            }

            //Jump
            if (Input.GetKeyDown(KeyCode.Space) && onGround)
            {
                onGround = false;
                //rb.velocity += Vector3.up * jumpForce * Time.deltaTime;
                rb.AddForce(Vector3.up * jumpForce, ForceMode.VelocityChange);
            }

            // A so-called better jumping system, however it behaves pretty bad
            // in this game.

            //if (rb.velocity.y < 0)
            //{
            //    rb.velocity += Vector3.up * Physics.gravity.y * (fallFactor - 1) * Time.deltaTime;
            //}
            //else if (rb.velocity.y > 0 && !Input.GetKeyDown(KeyCode.Space))
            //{
            //    rb.velocity += Vector3.up * Physics.gravity.y * (lowJumpFactor - 1) * Time.deltaTime;
            //}
        }
    }

    private void FixedUpdate()
    {
        // Do not put keyboard/mouse input into the fixedUpdate - it will randomly
        // omit the input, and behaves differently in different devices.
    }

    // When the player touches a bomb, it should be blowed away and some items 
    // collected will also be blowed away and destroyed. Task progress will also
    // reflect the change.
    private void OnCollisionEnter(Collision collision)
    {
        if (collision.collider.tag == "Ground" || collision.collider.tag == "Ship")
        {
            onGround = true;
        }

        if (collision.collider.tag == "Bomb")
        {
            collision.gameObject.GetComponent<Bomb>().Explode(rb);

            if (collectedObjects.Count > 0)
            {
                int numDrops = collectedObjects.Count / 5;

                for (int i = 0; i < numDrops + 1; i++)
                {
                    objectCount--;
                    Transform droppedObject = collectedObjects[collectedObjects.Count - 1];
                    collectedObjects.Remove(droppedObject);

                    droppedObject.GetComponentInChildren<Collider>().enabled = true;
                    droppedObject.SetParent(null);
                    droppedObject.GetComponent<Rigidbody>().isKinematic = false;
                    droppedObject.GetComponent<ViewerObject>().immuneToBeCollected = 1f;
                    GameManager.instance.playerCollected.Remove(droppedObject.name);
                    GameManager.instance.UpdateGoal(-1, droppedObject.gameObject);
                    collision.gameObject.GetComponent<Bomb>().Explode(droppedObject.GetComponent<Rigidbody>());
                }
            }          

            Destroy(collision.gameObject);
        }

        // If it touches a game piece, that game piece will stick onto the player,
        // the associated sound will be played, and the recognition bar will be
        // updated. Some commented area is for reaching the ship, but not there
        // now due to design change.
        if (collision.collider.tag == "Object" && collision.gameObject.GetComponent<ViewerObject>().immuneToBeCollected <= 0)
        {
            objectCount++;
            if (objectCount == 5)
            {
                objectCount = 0;
                ball.localScale *= enlargeFactor;
                foreach(Transform o in collectedObjects)
                {
                    o.position += (o.position - transform.position) * (enlargeFactor - 1f);
                }
            }
            collision.collider.enabled = false;
            collision.collider.transform.SetParent(transform);
            collectedObjects.Add(collision.collider.transform);
            GameObject obj = collision.gameObject;
            obj.GetComponent<ViewerObject>().Collected();
            // Might need to change in the future
            StopAllCoroutines();
            StartCoroutine(recognizeText.ShowRecognization(collision.gameObject.GetComponent<ViewerObject>().uploaderName));

            Debug.Log(GameManager.instance.uniqueCollection.Count);

            if (!GameManager.instance.uniqueCollection.Contains(obj.GetComponent<ViewerObject>().soundId))
            {
                GameManager.instance.uniqueCollection.Add(obj.GetComponent<ViewerObject>().soundId);

                // Update # of sound leaderboard
                string uploaderName = obj.GetComponent<ViewerObject>().uploaderName;
                if (!GameManager.instance.userLeaderboard.ContainsKey(uploaderName))
                    GameManager.instance.userLeaderboard[uploaderName] = 1;
                else
                    GameManager.instance.userLeaderboard[uploaderName]++;
            }

            // Update # of object leaderboard
            string objName = obj.name.Substring(0, obj.name.Length - 7);
            if (!GameManager.instance.objectLeaderboard.ContainsKey(objName))
                GameManager.instance.objectLeaderboard[objName] = 1;
            else
                GameManager.instance.objectLeaderboard[objName]++;

            GameManager.instance.objectsInScene--;
            GameManager.instance.allObjectsInScene.Remove(obj);


            if (collision.gameObject.GetComponent<ViewerObject>().replaceModel != null)
            {
                // This is also a hard thing because current atom ball has two meshes.
                // Can make a wrapper of the entire model and replace the wrapper
            }
        }

        //if (collision.collider.tag == "Ship")
        //{
        //    GameManager.instance.UpdateGoal(1);
        //}
    }

    private void OnCollisionExit(Collision collision)
    {
        //if (collision.collider.tag == "Ship")
        //{
        //    GameManager.instance.UpdateGoal(-1);
        //}
    }

    private void OnCollisionStay(Collision collision)
    {
        //if (collision.collider.tag == "Ship")
        //{
        //    if (Input.GetKeyDown(KeyCode.E))
        //    {
        //        DropObjects(collision.transform);
        //    }
        //}    
    }

    // Also used by previously-have reach destination end goal. All attached
    // game pieces will drop to the ship.
    private void DropObjects(Transform ship)
    {
        foreach(Transform obj in collectedObjects)
        {
            obj.SetParent(ship);
            obj.GetComponent<Rigidbody>().useGravity = true;
            obj.GetComponent<Rigidbody>().isKinematic = false;
        }
    }
}


