// Upgrade NOTE: upgraded instancing buffer 'Foam_Shader' to new syntax.

// Made with Amplify Shader Editor
// Available at the Unity Asset Store - http://u3d.as/y3X 
Shader "Foam_Shader"
{
	Properties
	{
		_Cutoff( "Mask Clip Value", Float ) = 0.5
		_NoiseA("Noise A", 2D) = "white" {}
		_NoiseAMaskClip("Noise A Mask Clip", Float) = 0
		_TileNoiseA("Tile Noise A", Vector) = (2,1.5,0,0)
		_NoiseB("Noise B", 2D) = "white" {}
		_NoiseBMaskClip("Noise B Mask Clip", Float) = 1
		_TileNoiseB("Tile Noise B", Vector) = (1,1,0,0)
		_FoamTint("Foam Tint", Color) = (0.4745891,0.5197171,0.9779412,0)
		_BorderWidth("Border Width", Range( 0 , 0.2)) = 0
		[HideInInspector] _texcoord( "", 2D ) = "white" {}
		[HideInInspector] __dirty( "", Int ) = 1
	}

	SubShader
	{
		Tags{ "RenderType" = "Custom"  "Queue" = "AlphaTest+0" "IsEmissive" = "true"  }
		Cull Back
		Blend One One
		CGPROGRAM
		#include "UnityShaderVariables.cginc"
		#pragma target 3.0
		#pragma multi_compile_instancing
		#pragma surface surf Unlit keepalpha addshadow fullforwardshadows 
		struct Input
		{
			float2 uv_texcoord;
			float4 vertexColor : COLOR;
		};

		uniform float _BorderWidth;
		uniform float4 _FoamTint;
		uniform sampler2D _NoiseB;
		uniform sampler2D _NoiseA;
		uniform float _Cutoff = 0.5;

		UNITY_INSTANCING_BUFFER_START(Foam_Shader)
			UNITY_DEFINE_INSTANCED_PROP(float2, _TileNoiseA)
#define _TileNoiseA_arr Foam_Shader
			UNITY_DEFINE_INSTANCED_PROP(float2, _TileNoiseB)
#define _TileNoiseB_arr Foam_Shader
			UNITY_DEFINE_INSTANCED_PROP(float, _NoiseAMaskClip)
#define _NoiseAMaskClip_arr Foam_Shader
			UNITY_DEFINE_INSTANCED_PROP(float, _NoiseBMaskClip)
#define _NoiseBMaskClip_arr Foam_Shader
		UNITY_INSTANCING_BUFFER_END(Foam_Shader)

		inline half4 LightingUnlit( SurfaceOutput s, half3 lightDir, half atten )
		{
			return half4 ( 0, 0, 0, s.Alpha );
		}

		void surf( Input i , inout SurfaceOutput o )
		{
			float smoothstepResult41 = smoothstep( _BorderWidth , 0.2 , i.uv_texcoord.y);
			float clampResult49 = clamp( smoothstepResult41 , 0.0 , 1.0 );
			o.Emission = ( clampResult49 + _FoamTint ).rgb;
			o.Alpha = 1;
			float2 _TileNoiseB_Instance = UNITY_ACCESS_INSTANCED_PROP(_TileNoiseB_arr, _TileNoiseB);
			float2 uv_TexCoord19 = i.uv_texcoord * _TileNoiseB_Instance;
			float2 panner20 = ( _Time.y * float2( 0.05,0.1 ) + uv_TexCoord19);
			float _NoiseBMaskClip_Instance = UNITY_ACCESS_INSTANCED_PROP(_NoiseBMaskClip_arr, _NoiseBMaskClip);
			float2 _TileNoiseA_Instance = UNITY_ACCESS_INSTANCED_PROP(_TileNoiseA_arr, _TileNoiseA);
			float2 uv_TexCoord6 = i.uv_texcoord * _TileNoiseA_Instance;
			float2 panner8 = ( _Time.y * float2( -0.05,0.1 ) + uv_TexCoord6);
			float _NoiseAMaskClip_Instance = UNITY_ACCESS_INSTANCED_PROP(_NoiseAMaskClip_arr, _NoiseAMaskClip);
			clip( ( smoothstepResult41 + ( i.vertexColor.r * ( ( tex2D( _NoiseB, panner20 ) * _NoiseBMaskClip_Instance ) * ( tex2D( _NoiseA, panner8 ) * _NoiseAMaskClip_Instance ) ) ) ).r - _Cutoff );
		}

		ENDCG
	}
	Fallback "Diffuse"
	CustomEditor "ASEMaterialInspector"
}
/*ASEBEGIN
Version=15401
1927;29;1906;1004;-474.7355;649.0375;1;True;True
Node;AmplifyShaderEditor.Vector2Node;16;-1216.584,-42.88404;Float;False;InstancedProperty;_TileNoiseB;Tile Noise B;6;0;Create;True;0;0;False;0;1,1;3,4;0;3;FLOAT2;0;FLOAT;1;FLOAT;2
Node;AmplifyShaderEditor.Vector2Node;10;-1165.255,-465.9363;Float;False;InstancedProperty;_TileNoiseA;Tile Noise A;3;0;Create;True;0;0;False;0;2,1.5;2,6;0;3;FLOAT2;0;FLOAT;1;FLOAT;2
Node;AmplifyShaderEditor.TextureCoordinatesNode;19;-1019.889,-33.06255;Float;False;0;-1;2;3;2;SAMPLER2D;;False;0;FLOAT2;1,1;False;1;FLOAT2;0,0;False;5;FLOAT2;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.TextureCoordinatesNode;6;-916.5593,-393.715;Float;False;0;-1;2;3;2;SAMPLER2D;;False;0;FLOAT2;1,1;False;1;FLOAT2;0,0;False;5;FLOAT2;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.Vector2Node;17;-989.9141,110.8395;Float;False;Constant;_Vector3;Vector 3;4;0;Create;True;0;0;False;0;0.05,0.1;0,0;0;3;FLOAT2;0;FLOAT;1;FLOAT;2
Node;AmplifyShaderEditor.SimpleTimeNode;12;-864.5848,-120.8129;Float;False;1;0;FLOAT;1;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleTimeNode;18;-967.9141,239.8396;Float;False;1;0;FLOAT;1;False;1;FLOAT;0
Node;AmplifyShaderEditor.Vector2Node;13;-884.5848,-249.8129;Float;False;Constant;_Vector1;Vector 1;4;0;Create;True;0;0;False;0;-0.05,0.1;0,0;0;3;FLOAT2;0;FLOAT;1;FLOAT;2
Node;AmplifyShaderEditor.PannerNode;8;-637.6748,-337.9394;Float;False;3;0;FLOAT2;0,0;False;2;FLOAT2;0,0;False;1;FLOAT;1;False;1;FLOAT2;0
Node;AmplifyShaderEditor.PannerNode;20;-741.0042,22.71298;Float;False;3;0;FLOAT2;0,0;False;2;FLOAT2;0,0;False;1;FLOAT;1;False;1;FLOAT2;0
Node;AmplifyShaderEditor.SamplerNode;24;-489.4012,3.099426;Float;True;Property;_NoiseB;Noise B;4;0;Create;True;0;0;False;0;47b60ca11bc40134a9bec6bb3c13f39d;47b60ca11bc40134a9bec6bb3c13f39d;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.SamplerNode;2;-436.7062,-310.956;Float;True;Property;_NoiseA;Noise A;1;0;Create;True;0;0;False;0;47b60ca11bc40134a9bec6bb3c13f39d;47b60ca11bc40134a9bec6bb3c13f39d;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.RangedFloatNode;23;-306.543,216.5502;Float;False;InstancedProperty;_NoiseBMaskClip;Noise B Mask Clip;5;0;Create;True;0;0;False;0;1;1.78;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;5;-314.7519,-106.4734;Float;False;InstancedProperty;_NoiseAMaskClip;Noise A Mask Clip;2;0;Create;True;0;0;False;0;0;1.38;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;22;-66.96534,132.3245;Float;False;2;2;0;COLOR;0,0,0,0;False;1;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;4;-101.4398,-84.79488;Float;False;2;2;0;COLOR;0,0,0,0;False;1;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.RangedFloatNode;39;640.5982,-100.2079;Float;False;Property;_BorderWidth;Border Width;8;0;Create;True;0;0;False;0;0;0.1401;0;0.2;0;1;FLOAT;0
Node;AmplifyShaderEditor.TextureCoordinatesNode;36;405.3591,-68.28526;Float;False;0;-1;2;3;2;SAMPLER2D;;False;0;FLOAT2;1,1;False;1;FLOAT2;0,0;False;5;FLOAT2;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.VertexColorNode;25;168.2967,-46.45902;Float;False;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;21;152.912,150.0595;Float;False;2;2;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.SmoothstepOpNode;41;938.5983,-1.207947;Float;False;3;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0.2;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;26;411.4966,158.9412;Float;False;2;2;0;FLOAT;0;False;1;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.ColorNode;44;136.7878,-521.1445;Float;False;Property;_FoamTint;Foam Tint;7;0;Create;True;0;0;False;0;0.4745891,0.5197171,0.9779412,0;0.3605821,0.3896539,0.6886792,0;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.ClampOpNode;49;1154.227,-141.8038;Float;False;3;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;1;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleAddOpNode;48;1363.93,-214.1201;Float;False;2;2;0;FLOAT;0;False;1;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.SimpleAddOpNode;43;1084.107,163.3865;Float;False;2;2;0;FLOAT;0;False;1;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.StandardSurfaceOutputNode;51;1641.057,-160.4805;Float;False;True;2;Float;ASEMaterialInspector;0;0;Unlit;Foam_Shader;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;Back;0;False;-1;0;False;-1;False;0;False;-1;0;False;-1;False;0;Custom;0.5;True;True;0;False;Custom;;AlphaTest;All;True;True;True;True;True;True;True;True;True;True;True;True;True;True;True;True;True;0;False;-1;False;0;False;-1;255;False;-1;255;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;False;2;15;10;25;False;0.5;True;4;1;False;-1;1;False;-1;0;1;False;-1;1;False;-1;-1;False;-1;-1;False;-1;0;False;0;0,0,0,0;VertexOffset;True;False;Cylindrical;False;Relative;0;;-1;-1;-1;-1;0;False;0;0;False;-1;-1;0;False;-1;0;0;15;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;2;FLOAT3;0,0,0;False;3;FLOAT;0;False;4;FLOAT;0;False;6;FLOAT3;0,0,0;False;7;FLOAT3;0,0,0;False;8;FLOAT;0;False;9;FLOAT;0;False;10;FLOAT;0;False;13;FLOAT3;0,0,0;False;11;FLOAT3;0,0,0;False;12;FLOAT3;0,0,0;False;14;FLOAT4;0,0,0,0;False;15;FLOAT3;0,0,0;False;0
WireConnection;19;0;16;0
WireConnection;6;0;10;0
WireConnection;8;0;6;0
WireConnection;8;2;13;0
WireConnection;8;1;12;0
WireConnection;20;0;19;0
WireConnection;20;2;17;0
WireConnection;20;1;18;0
WireConnection;24;1;20;0
WireConnection;2;1;8;0
WireConnection;22;0;24;0
WireConnection;22;1;23;0
WireConnection;4;0;2;0
WireConnection;4;1;5;0
WireConnection;21;0;22;0
WireConnection;21;1;4;0
WireConnection;41;0;36;2
WireConnection;41;1;39;0
WireConnection;26;0;25;1
WireConnection;26;1;21;0
WireConnection;49;0;41;0
WireConnection;48;0;49;0
WireConnection;48;1;44;0
WireConnection;43;0;41;0
WireConnection;43;1;26;0
WireConnection;51;2;48;0
WireConnection;51;10;43;0
ASEEND*/
//CHKSM=0F21EDCA9A0B03B52B86D1DBE17D42A9DD36CA5E