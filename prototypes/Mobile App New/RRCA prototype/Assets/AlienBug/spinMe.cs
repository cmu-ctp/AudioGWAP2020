using UnityEngine;
using System.Collections;


public class spinMe : MonoBehaviour {
	public float rotationSpeed = 40f;

	// called once per frame
	private void Update()
	{
		
			// rotate x axis by rotationSpeed degrees per second
			transform.Rotate(Vector3.down, rotationSpeed * Time.deltaTime);
		}
	}
	
