using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu]
public class Dictionary  : DictionaryReference
{
    [SerializeField]
    private List<DictionaryReference> files;
}
