using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public enum TaskType
{
    Indoor = 0,
    Outdoor = 1,
    UniqueTotal = 2,
    UniqueInRow = 3,
    Destination = 4,
    NumTask = 5
}

public class Goal : MonoBehaviour
{
    [Header("Task Pool")]
    [SerializeField]
    Sprite[] icons;
    [SerializeField]
    string[] descriptions;

    [Header("Task Components")]
    [SerializeField]
    Text description;
    [SerializeField]
    Text count;
    [SerializeField]
    Image icon;
    [SerializeField]
    float moveTime;

    int numGet;
    int numGoal;
    TaskType taskType;
    TaskType prevType;
    Vector2 oldOffsetMin;
    Vector2 oldOffsetMax;
    float moveLength;
    RectTransform rt;

    private void Start()
    {
        numGet = 0;
        rt = GetComponent<RectTransform>();
        // offsetMin: (left, bottom)
        // offsetMax: (-right, -top);
        oldOffsetMin = rt.offsetMin;
        oldOffsetMax = rt.offsetMax;
        moveLength = rt.rect.width;
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.E))
            SetGoal();
    }

    public void SetGoal()
    {
        numGet = 0;
        GameManager.instance.playerCollected.Clear();
        int repeat = 1000;
        while (repeat > 0)
        {
            repeat--;
            int numTypes = GameManager.instance.NumTypesInScene();
            int index = Random.Range(0, (int)TaskType.NumTask);
            string desc = descriptions[index];
            taskType = (TaskType)index;
            if (taskType == prevType)
                continue;

            switch (taskType)
            {
                case TaskType.Indoor:
                    if (GameManager.instance.objectsIndoor == 0)
                        continue;
                    numGoal = Mathf.CeilToInt(0.1f * GameManager.instance.objectsIndoor);
                    break;
                case TaskType.Outdoor:
                    if (GameManager.instance.objectsOutdoor == 0)
                        continue;
                    numGoal = Mathf.CeilToInt(0.1f * GameManager.instance.objectsOutdoor);
                    break;
                case TaskType.UniqueTotal:
                    if (numTypes < 2)
                        continue;
                    numGoal = Mathf.Min(5, numTypes - 1);
                    break;
                case TaskType.UniqueInRow:
                    if (numTypes < 3)
                        continue;
                    numGoal = Mathf.Min(4, numTypes - 2);
                    break;
                case TaskType.Destination:
                    continue;
            }
            GameManager.instance.currentTask = taskType;
            prevType = taskType;
            description.text = desc.Replace('#', numGoal.ToString()[0]);
            break;
        }

        UpdateText();
    }

    public void UpdateGoal(int num)
    {
        //switch (taskType)
        //{
        //    case TaskType.Indoor:
        //        break;
        //    case TaskType.Outdoor:
        //        break;
        //    case TaskType.UniqueTotal:
        //        break;
        //    case TaskType.UniqueInRow:
        //        break;
        //    case TaskType.Destination:
        //        break;
        //}
        numGet += num;
        numGet = Mathf.Max(0, numGet);
        UpdateText();

        if (numGet >= numGoal)
        {
            GameManager.instance.taskCompleted++;
            StartCoroutine(NextTask());
        }
    }

    void UpdateText()
    {
        count.text = numGet.ToString() + " / " + numGoal.ToString();
    }

    IEnumerator NextTask()
    {
        float elapsedTime = 0f;
        while (elapsedTime < moveTime)
        {
            elapsedTime += Time.deltaTime;
            rt.Translate(Vector3.right * moveLength * Time.deltaTime / moveTime);
            yield return null;
        }

        SetGoal();

        elapsedTime = 0f;
        while (elapsedTime < moveTime)
        {
            elapsedTime += Time.deltaTime;
            rt.Translate(Vector3.left * moveLength * Time.deltaTime / moveTime);
            yield return null;
        }
    }
}
