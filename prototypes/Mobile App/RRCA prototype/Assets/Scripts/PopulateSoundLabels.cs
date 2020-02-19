using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PopulateSoundLabels : MonoBehaviour
{
    [SerializeField]
    private ListOfStringsVariable soundLabels;

    [SerializeField]
    private Dropdown soundLabelDropdown;

    private void Start()
    {
        foreach(string s in soundLabels.Value)
        {
            int count = soundLabelDropdown.options.Count;
            soundLabelDropdown.options.Add(new Dropdown.OptionData());
            soundLabelDropdown.options[count].text = s;
        }
    }
}
