using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
#if UNITY_ANDROID
using UnityEngine.Android;
#elif UNITY_IOS
using UnityEngine.iOS;
#endif
using UnityEngine.UI;
using Button = UnityEngine.UI.Button;
using UnityEngine.Networking;

public class SoundItem : MonoBehaviour
{
    [SerializeField]
    private ListOfStringsVariable soundItemsNames, soundItemsLength;
    private DirectoryInfo dirInfo;
    private FileInfo[] files;
    private AudioSource audioSrc;

    private void Start()
    {
        dirInfo = new DirectoryInfo(Application.persistentDataPath);
        audioSrc = Camera.main.GetComponent<AudioSource>();
    }
    
    public void DeleteFile()
    {
        Debug.Log("destroy");
        int index = transform.GetSiblingIndex();
        files = dirInfo.GetFiles();

        for(int i = 0; i < files.Length; i++)
        {
            string[] fName = files[i].Name.Split('_');
            if(fName[fName.Length - 1] == soundItemsNames.Value[index])
            {
                var filepath = Path.Combine(Application.persistentDataPath, files[i].Name);
                File.Delete(filepath);
            }
        }

        soundItemsNames.Value.RemoveAt(index);
        soundItemsLength.Value.RemoveAt(index);
        Destroy(this.gameObject);
    }

    public void PlayAudioFile(Text fileName)
    {
        Debug.Log("play");
        files = dirInfo.GetFiles();
        for(int i = 0; i < files.Length; i++)
        {
            string[] fName = files[i].Name.Split('_');
            if(fName[fName.Length - 1] == fileName.text)
            {
                var filepath = Path.Combine(Application.persistentDataPath, files[i].Name);
                StartCoroutine(AddFileToClips(filepath));
            }
        }
        //test test
    }

    IEnumerator AddFileToClips(string path)
    {
        AudioClip clip = null;

        Debug.LogFormat("[Sound] Get sound clip from [{0}]", path);

        if (path.StartsWith("https://"))
        {
            yield return StartCoroutine(ReadServerAudioClip(path, c => clip = c));
        }
        else
        {
            yield return StartCoroutine(ReadLocalAudioClip(path, c => clip = c));
        }

        if (clip == null)
        {
            Debug.LogErrorFormat("[Sound] Failed to get sound clip from [{0}]", path);
            yield break;
        }

        audioSrc.clip = clip;
        audioSrc.Play();
        yield return null;
    }

    IEnumerator ReadLocalAudioClip(string path, Action<AudioClip> onClipLoaded)
    {
        using (var uwr = UnityWebRequestMultimedia.GetAudioClip(FilePathToUri(path), AudioType.WAV))
        {
            Debug.LogFormat("[Sound] Preparing Web Request: {0}", uwr.url);

            yield return uwr.SendWebRequest();

            Debug.LogFormat("[Sound] Web Request Finished.");

            if (uwr.isNetworkError || uwr.isHttpError)
            {
                Debug.LogError(uwr.error);
                yield break;
            }

            var clip = DownloadHandlerAudioClip.GetContent(uwr);
            if (onClipLoaded != null)
            {
                onClipLoaded(clip);
            }
        }
    }

    IEnumerator ReadServerAudioClip(string path, Action<AudioClip> onClipLoaded)
    {
        using (var uwr = UnityWebRequestMultimedia.GetAudioClip(path, AudioType.WAV))
        {
            yield return uwr.SendWebRequest();
            if (uwr.isNetworkError || uwr.isHttpError)
            {
                Debug.LogError(uwr.error);
                yield break;
            }

            var clip = DownloadHandlerAudioClip.GetContent(uwr);
            if (onClipLoaded != null)
            {
                onClipLoaded(clip);
            }
        }
    }

    private static string FilePathToUri(string path)
    {
        // Note: iOS has very strict rules on file URI scheme
        // like "file:////" will not be accepted so we need to 
        // convert the uri using system api to avoid such issues.

        // https://stackoverflow.com/questions/1546419/convert-file-path-to-a-file-uri

        // The following code will only handle with " " encoding
        // for a more robust url encoding check the link above
        var uri = new Uri(path.Replace(" ", "%20"));
        return uri.AbsoluteUri;
        //
    }
}
