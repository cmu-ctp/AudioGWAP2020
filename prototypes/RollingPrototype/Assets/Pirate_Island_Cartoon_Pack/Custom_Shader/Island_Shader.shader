// Made with Amplify Shader Editor
// Available at the Unity Asset Store - http://u3d.as/y3X 
Shader "Island_Shader"
{
	Properties
	{
		_BeachSand("Beach Sand", 2D) = "gray" {}
		_BeachSandTiling("Beach Sand Tiling", Float) = 10
		_BorderSand("Border Sand", 2D) = "white" {}
		_BorderSandTiling("Border Sand Tiling", Float) = 10
		_Brightness("Brightness", Range(0, 2)) = 1
		[HideInInspector] _texcoord( "", 2D ) = "white" {}
		[HideInInspector] __dirty( "", Int ) = 1
	}

	SubShader
	{
		Tags{ "RenderType" = "Opaque"  "Queue" = "Geometry+0" }
		Cull Back
		CGPROGRAM
		#pragma target 3.0
		#pragma surface surf Standard keepalpha 
		struct Input
		{
			float2 uv_texcoord;
			float4 vertexColor : COLOR;
		};

		uniform sampler2D _BorderSand;
		uniform float _BorderSandTiling;
		uniform sampler2D _BeachSand;
		uniform float _BeachSandTiling;
		uniform float _Brightness;

		void surf( Input i , inout SurfaceOutputStandard o )
		{
			float2 temp_cast_0 = (_BorderSandTiling).xx;
			float2 uv_TexCoord14 = i.uv_texcoord * temp_cast_0;
			float2 temp_cast_1 = (_BeachSandTiling).xx;
			float2 uv_TexCoord16 = i.uv_texcoord * temp_cast_1;
			float4 lerpResult8 = lerp( tex2D( _BorderSand, uv_TexCoord14 ) , tex2D( _BeachSand, uv_TexCoord16 ) , i.vertexColor.r);
			o.Albedo = lerpResult8.rgb * _Brightness;
			o.Metallic = 0.0;
			o.Smoothness = 0.0;
			o.Alpha = 1;
		}

		ENDCG
	}
	Fallback "Diffuse"
	CustomEditor "ASEMaterialInspector"
}
/*ASEBEGIN
Version=15401
1927;29;1906;1004;934.4556;935.6392;1.759104;True;True
Node;AmplifyShaderEditor.RangedFloatNode;13;-614.9978,-57.81501;Float;False;Property;_BorderSandTiling;Border Sand Tiling;3;0;Create;True;0;0;False;0;10;10;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;15;-624.2709,156.619;Float;False;Property;_BeachSandTiling;Beach Sand Tiling;1;0;Create;True;0;0;False;0;10;10;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.TextureCoordinatesNode;14;-408.6759,-76.36066;Float;False;0;-1;2;3;2;SAMPLER2D;;False;0;FLOAT2;1,1;False;1;FLOAT2;0,0;False;5;FLOAT2;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.TextureCoordinatesNode;16;-417.9485,138.0733;Float;False;0;-1;2;3;2;SAMPLER2D;;False;0;FLOAT2;1,1;False;1;FLOAT2;0,0;False;5;FLOAT2;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.SamplerNode;10;-140.9214,-91.42893;Float;True;Property;_BorderSand;Border Sand;2;0;Create;True;0;0;False;0;None;2ccc312a4c6acce4b87020096ebc43f8;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.VertexColorNode;12;-37.76172,355.9846;Float;False;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.SamplerNode;11;-138.6032,119.5279;Float;True;Property;_BeachSand;Beach Sand;0;0;Create;True;0;0;False;0;None;9d49e6a06eef176479a030ed7c732e66;True;0;False;gray;Auto;False;Object;-1;Auto;Texture2D;6;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.RangedFloatNode;17;695.37,87.0722;Float;False;Constant;_Float0;Float 0;4;0;Create;True;0;0;False;0;0;0;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;18;702.3239,168.2095;Float;False;Constant;_Float1;Float 1;4;0;Create;True;0;0;False;0;0;0;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;8;338.9479,47.66346;Float;False;3;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;2;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.StandardSurfaceOutputNode;0;994.3362,-19.86005;Float;False;True;2;Float;ASEMaterialInspector;0;0;Standard;Island_Shader;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;False;Back;0;False;-1;0;False;-1;False;0;False;-1;0;False;-1;False;0;Opaque;0.5;True;False;0;False;Opaque;;Geometry;All;True;True;True;True;True;True;True;True;True;True;True;True;True;True;True;True;True;0;False;-1;False;0;False;-1;255;False;-1;255;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;0;False;-1;False;2;15;10;25;False;0.5;True;0;0;False;-1;0;False;-1;0;0;False;-1;0;False;-1;-1;False;-1;-1;False;-1;0;False;0;0,0,0,0;VertexOffset;True;False;Cylindrical;False;Relative;0;;-1;-1;-1;-1;0;False;0;0;False;-1;-1;0;False;-1;0;0;16;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;2;FLOAT3;0,0,0;False;3;FLOAT;0;False;4;FLOAT;0;False;5;FLOAT;0;False;6;FLOAT3;0,0,0;False;7;FLOAT3;0,0,0;False;8;FLOAT;0;False;9;FLOAT;0;False;10;FLOAT;0;False;13;FLOAT3;0,0,0;False;11;FLOAT3;0,0,0;False;12;FLOAT3;0,0,0;False;14;FLOAT4;0,0,0,0;False;15;FLOAT3;0,0,0;False;0
WireConnection;14;0;13;0
WireConnection;16;0;15;0
WireConnection;10;1;14;0
WireConnection;11;1;16;0
WireConnection;8;0;10;0
WireConnection;8;1;11;0
WireConnection;8;2;12;0
WireConnection;0;0;8;0
WireConnection;0;3;17;0
WireConnection;0;4;18;0
ASEEND*/
//CHKSM=0049206C4BD726C5827A3377E6B4744C25045FA2