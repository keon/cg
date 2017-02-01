class Demo {
  constructor(canvas, vertexShader, fragmentShader){
    this.canvas = canvas
    this.vs = vertexShader
    this.fs = fragmentShader
    this.gl = null
    this.program = null

    // start program
    this.init()
    this.setShaders(this.vs, this.fs)
  }

  init(){
    console.log("Loading WebGL...")
    let gl = this.gl = this.canvas.getContext('webgl')
    if (!gl) {
      console.log("WebGL not supported, falling back on experimental WebGL")
      gl = canvas.getContext('experimental-webgl')
    }
    if (!gl) {
      alert('your brower does not support WebGL')
    }
    console.log("Done Loading WebGL.")

    // background
    gl.clearColor(0.75, 0.85, 0.8, 1.0)
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    gl.viewport(0,0, window.innerWidth, window.innerHeight)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  setShaders(vs, fs){
    let gl = this.gl
    let program = this.program = gl.createProgram()

    let addShader = (type, src) => {
      var shader = gl.createShader(type)
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.log("Cannot compile shader: \n\n"
                    + gl.getShaderInfoLog(shader))
      gl.attachShader(program, shader)
    }
    addShader(gl.VERTEX_SHADER, vs)
    addShader(gl.FRAGMENT_SHADER, fs)

    gl.linkProgram(program)
    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.log("Could not link the program: \n\n"
                  + gl.getProgramInfoLog(program))
    gl.validateProgram(program)
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
      console.log("Could not validate the program: \n\n"
                  + gl.getProgramInfoLog(program))
  }

  drawTriangle(){
    let gl = this.gl
    let program = this.program
    let triangleVertices = [
    // X, Y
      0.0 ,  0.5,
      -0.5, -0.5,
      0.5 , -0.5
    ]

    let triangleVertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
    gl.vertexAttribPointer(
      positionAttribLocation,  // Attribute Location
      2,  // number of elements per attribute
      gl.FLOAT,  // Type of elements
      gl.FALSE,
      2 * Float32Array.BYTES_PER_ELEMENT,  // size of an individual vertex
      0  // offset from the beginning of a single vertex to this attribute
    )

    gl.enableVertexAttribArray(positionAttribLocation)

    gl.useProgram(program)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    // Main render loop
    //var loop = function(){
      //updateWorld()
      //renderWorld()
      //if (running) {
        //requestAnimationFrame(loop)
      //}
    //}
  }
}

