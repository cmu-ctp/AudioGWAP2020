using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoundObject
{
    public string path { get; set; }
    public string displayName { get; set; }
    public string modelName { get; set; }
    public string id { get; set; }

    public SoundObject(string path, string displayName, string modelName, string id)
    {
        this.path = path;
        this.displayName = displayName;
        this.modelName = modelName;
        this.id = id;
    }

    public override string ToString()
    {
        return "Path: " + path + ", Display_Name: " + displayName + ", Model_Name: " + modelName;
    }
}
