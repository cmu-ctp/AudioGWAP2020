using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ResetScrollBar : MonoBehaviour
{
    public void SetVerticalScrollBarToStart(Scrollbar verticalScroll)
    {
        verticalScroll.value = 1;
    }
}