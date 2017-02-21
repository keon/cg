# Computer Graphics Practices

Below are notes I wrote while reading [WebGL Fundamentals Tutorial](https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html).

## WebGL

WebGL allows us to draw points, lines, and triangles by using GPU on your computer.
Though it runs on the web, it uses a special language called GLSL (GL Shader Langauge), which resembles C++.
In GLSL, you need to write pairs of functions called 'vertex shader' and 'fragment shader'.
A *program* needs those to in order to function.

Vertex shader is used for calculating the vertex positions.
Based on the Vertex shader's outputs, WebGL rasterizes with the instructions given in the fragment shader.
Those instructions include colors for each pixels.

## Data

There are 4 ways a shader can receive data.

1. Attributes and Buffers - Buffers are positions, normals, texture coordinates, vertex colors, etc.
Attributes tells vertex shader which buffer to pull the positions out of, what type of data it should pull out, etc.

2. Uniforms - Think of them as global variables.

3. Textures - Arrays of data you can randomly acces in your shader program. You can put in images or colors.

4. Varyings - Gives a way for a vertex shader to pass data to a fragment shader.


## Hello World

Vertex shader

```glsl
// an attribute will receive data from a buffer
attribute vec4 a_position;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
```

Fragment Shader

```
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;
 
void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  gl_FragColor = vec4(1, 0, 0.5, 1); // red, green, blue, alpha
}
```


