using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEngine.SceneManagement; /* for restarting game */

public enum GameState
{
    Start = 0,
    Playing = 1,
    Ending = 2
}

// NOTE: this entire file needs a very huge refactoring - currently this class
//       handles to many things that should not be handled here.

public class GameManager : MonoBehaviour
{
    public static GameManager instance;

    [Header("UI Components")]
    [SerializeField]
    GameObject leaderboard;
    [SerializeField]
    GameObject timer;
    [SerializeField]
    GameObject instruction;
    [SerializeField]
    GameObject minimap;
    [SerializeField]
    GetSpawningPoints spawningPoints;
    [SerializeField]
    ObjectSpawner objectSpawner;
    [SerializeField]
    GameObject recognition;
    [SerializeField]
    Goal goal;
    [SerializeField]
    GameObject startGame;
    [SerializeField]
    GameObject restart;
    

    [Header("Game Components")]
    [SerializeField]
    Transform ship;
    [SerializeField]
    Transform player;
    [SerializeField]
    GameObject playerCamera;
    [SerializeField]
    GameObject endingCamera;
    [SerializeField]
    Transform monsterRainPlane;

    [Header("Setting")]
    [SerializeField]
    [Range(0, 1)]
    float spawnThreshold;
    [SerializeField]
    [Range(0.1f, 0.5f)]
    float goalThresholdOutdoor;
    [SerializeField]
    [Range(0.1f, 0.5f)]
    float goalThresholdIndoor;

    [HideInInspector]
    public Dictionary<string, int> userLeaderboard; // most collected user leaderboard
    [HideInInspector]
    public Dictionary<string, int> objectLeaderboard;  // most collected object leaderboard
    [HideInInspector]
    public int objectsInScene;
    [HideInInspector]
    public int objectsIndoor;
    [HideInInspector]
    public int objectsOutdoor;
    [HideInInspector]
    public int totalNumObjects;
    [HideInInspector]
    public int totalNumPoints;
    [HideInInspector]
    public List<GameObject> allObjectsInScene;
    [HideInInspector]
    public TaskType currentTask;
    [HideInInspector]
    public HashSet<string> playerCollected;
    [HideInInspector]
    public GameState gameState;
    [HideInInspector]
    public int totalItemCollected;
    [HideInInspector]
    public int taskCompleted;
    [HideInInspector]
    public HashSet<string> uniqueCollection;

    void Awake()
    {
        Debug.Log("Awake");
        if (instance == null)
            instance = this;

        spawningPoints.InitSpawningPoints();

        userLeaderboard = new Dictionary<string, int>();
        objectLeaderboard = new Dictionary<string, int>();
        allObjectsInScene = new List<GameObject>();
        playerCollected = new HashSet<string>();
        uniqueCollection = new HashSet<string>();

        gameState = GameState.Start;
        objectsInScene = 0;
        totalNumObjects = 0;

        totalNumPoints += spawningPoints.indoorList.Count;
        totalNumPoints += spawningPoints.outdoorList.Count;
    }

    void Update()
    {
        // Shortcut

        //if (Input.GetKeyDown(KeyCode.Space))
        //{
        //    switch (gameState)
        //    {
        //        case GameState.Start:
        //            StartGame();
        //            break;
        //    }
        //}
    }

    public void SortAndDisplayLeaderboard()
    {
        SortAndDisplayUsers();
        SortAndDisplayObjects();
    }

    void SortAndDisplayUsers()
    {
        // Used by leaderboard ranking which users' sounds have been collected the most.
        List<KeyValuePair<string, int>> sortedBoard = userLeaderboard.ToList();
        sortedBoard.Sort((pair1, pair2) => pair2.Value.CompareTo(pair1.Value));
        string user1 = sortedBoard.Count > 0 ? sortedBoard[0].Key : "";
        int count1 = sortedBoard.Count > 0 ? sortedBoard[0].Value : 0;
        string user2 = sortedBoard.Count > 1 ? sortedBoard[1].Key : "";
        int count2 = sortedBoard.Count > 1 ? sortedBoard[1].Value : 0;
        string user3 = sortedBoard.Count > 2 ? sortedBoard[2].Key : "";
        int count3 = sortedBoard.Count > 2 ? sortedBoard[2].Value : 0;
        leaderboard.GetComponent<Leaderboard>().UpdateSoundBoard(user1, count1,
            user2, count2, user3, count3);
    }

    void SortAndDisplayObjects()
    {
        // Used by leaderboard ranking which game piece has been collected the most.
        List<KeyValuePair<string, int>> sortedBoard = objectLeaderboard.ToList();       
        sortedBoard.Sort((pair1, pair2) => pair2.Value.CompareTo(pair1.Value));
        string obj1 = sortedBoard.Count > 0 ? sortedBoard[0].Key : "";
        int count1 = sortedBoard.Count > 0 ? sortedBoard[0].Value : 0;
        string obj2 = sortedBoard.Count > 1 ? sortedBoard[1].Key : "";
        int count2 = sortedBoard.Count > 1 ? sortedBoard[1].Value : 0;
        string obj3 = sortedBoard.Count > 2 ? sortedBoard[2].Key : "";
        int count3 = sortedBoard.Count > 2 ? sortedBoard[2].Value : 0;
        leaderboard.GetComponent<Leaderboard>().UpdateItemBoard(obj1, count1,
            obj2, count2, obj3, count3, totalItemCollected, taskCompleted);
    }

    public void EmptyPoint(Vector3 point, bool isOutdoor)
    {
        // collect all available spawning points for game pieces.
        if (isOutdoor)
            spawningPoints.outdoorList.Add(point);
        else
            spawningPoints.indoorList.Add(point);
    }

    public void CheckEnoughSpace()
    {
        // check if the available spawning points are enough to spawn all game pieces
        // for this event. If not, delay part of the spawning until later.
        int emptyPoints = totalNumPoints - objectsInScene;
        if (emptyPoints >= objectSpawner.delayedFiles.Count)
        {
            StartCoroutine(objectSpawner.SpawnDelayedFiles(objectSpawner.delayedFiles.Count));
        }
        else if (objectsInScene < spawnThreshold * totalNumPoints)
        {
            StartCoroutine(objectSpawner.SpawnDelayedFiles(emptyPoints));
        }
    }

    // two helper method for updating task goals.
    public void SetGoal()
    {
        goal.SetGoal();
    }

    public void UpdateGoal(int num, GameObject obj)
    {
        goal.UpdateGoal(num, obj);
    }

    // called on game end, handle UI elements and game state
    public void GameEndWrapper()
    {
        timer.SetActive(false);
        minimap.SetActive(false);
        recognition.SetActive(false);
        restart.SetActive(false);
        goal.gameObject.SetActive(false);
        leaderboard.SetActive(true);
        gameState = GameState.Ending;
        startGame.SetActive(true); /* display start game button at the end */
        //StartCoroutine(GameEnd());
    }

    // This coroutine is only used when we have "reach destination" as a end goal.
    // It will switch to another camera and show the ship leaving animation.
    public IEnumerator GameEnd()
    {
        playerCamera.SetActive(false);
        endingCamera.SetActive(true);
        player.SetParent(ship);
        float elapsedTime = 0f;
        while (elapsedTime < 10f)
        {
            if (elapsedTime > 3f)
                leaderboard.SetActive(true);

            ship.Translate(10 * Vector3.right * Time.deltaTime);
            elapsedTime += Time.deltaTime;
            yield return null;
        }
        
    }

    // Number of game piece types in the scene. Used by collect unique tasks.
    public int NumTypesInScene()
    {
        HashSet<string> num = new HashSet<string>();
        foreach(GameObject obj in allObjectsInScene)
        {
            num.Add(obj.name);
        }

        return num.Count;
    }

    public void StartGame()
    {
        Debug.Log("Starting Game");
        instruction.SetActive(false);
        timer.SetActive(true);
        minimap.SetActive(true);
        recognition.SetActive(true);
        goal.gameObject.SetActive(true);
        restart.SetActive(true);
        gameState = GameState.Playing;
        SetGoal();
    }

    /* restart at the end or in the middle */
    public void RestartGame() {
        Debug.Log("Restart Game");
        SceneManager.LoadScene(1);
    }

    public void ResetPlayer() {
        player.position = new Vector3((float)-5.5, (float)2.5, (float)-19.2);
    }

    // A game piece rain will happen when completing a task.
    // The game piece is determined by the last collected game piece.
    public void CompleteBonus(GameObject obj)
    {
        StartCoroutine(MonstrousRain(obj)); 
    }

    IEnumerator MonstrousRain(GameObject obj)
    {
        // Basically just have a plane in the sky, and spawn the given game piece
        // randomly at any point in this plane. All game pieces produced by this 
        // rain will be self-destroyed.
        Vector3 planeMin = monsterRainPlane.GetComponent<MeshFilter>().mesh.bounds.min;
        Vector3 planeMax = monsterRainPlane.GetComponent<MeshFilter>().mesh.bounds.max;
        float planeScaleX = monsterRainPlane.localScale.x;
        float planeScaleZ = monsterRainPlane.localScale.z;

        for (int i = 0; i< 200; i++)
        {
            Vector3 randomPos = monsterRainPlane.transform.position -
            new Vector3(Random.Range(planeMin.x * planeScaleX, planeMax.x * planeScaleX),
            -monsterRainPlane.transform.position.y,
            Random.Range(planeMin.z * planeScaleZ, planeMax.z * planeScaleZ));

            GameObject rainObj = Instantiate(obj, randomPos, Quaternion.identity);
            rainObj.GetComponent<SelfDestruction>().DestroySelf();
            rainObj.transform.localScale *= 5;
            rainObj.transform.SetParent(monsterRainPlane);
            rainObj.GetComponent<Rigidbody>().useGravity = true;
            rainObj.GetComponent<Rigidbody>().isKinematic = false;
            yield return new WaitForSeconds(0.01f);
        }
    }
}
