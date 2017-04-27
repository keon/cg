
var fragmentShaderHeader = [''               // PREDEFINED STUFF FOR FRAGMENT SHADERS
,'   precision highp float;'
].join('\n');

function SceneObject(vertices) {
   var bpe = Float32Array.BYTES_PER_ELEMENT;

   this.vertexSize = 6;
   this.fl = 3;
   this.matrix = M.identityMatrix();

   this.setFL = function(fl) {
      this.fl = fl;
   }

   this.setMatrix = function(src) {
      M.copy(this.matrix, src);
   }

   this.setVertices = function(vertices) {
      this.vertices = vertices;
   }

   this.init = function(gl) {
      if (! this.gl) {
         this.gl = gl;
         if (! this.buffer) {
            this.buffer = gl.createBuffer();
            this.vertexData = new Float32Array(this.vertices);
         }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
      this.bindVertexAttribute('aPos', 3, gl.FLOAT, 6, 0);
      this.bindVertexAttribute('aNor', 3, gl.FLOAT, 6, 3);
   }

   this.bindVertexAttribute = function(name, len, type, stride, offset) {
      var gl = this.gl;
      var attr = gl.getAttribLocation(gl.program, name);
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, len, type, false, stride * bpe, offset * bpe);
   }
}

function Scene() {
   this.objects = [];

   this.addObject = function(obj) {
      this.objects.push(obj);
   }

   this.init = function(gl) {
      for (var n = 0 ; n < this.objects.length ; n++)
         this.objects[n].init(gl);
   }
}

var time = 0;

function gl_start(canvas, vertexShader, fragmentShader, update) {           // START WEBGL RUNNING IN A CANVAS
   try { 
      canvas.gl = canvas.getContext('experimental-webgl');                 // Make sure WebGl is supported.
   } catch (e) { throw 'Sorry, your browser does not support WebGL.'; }

   setTimeout(function() {
      canvas.setShaders = function(vertexShader, fragmentShader) {            // Add the vertex and fragment shaders:

         var gl = this.gl, program = gl.createProgram();                           // Create the WebGL program.

         function addshader(type, src) {                                           // Create and attach a WebGL shader.
            var shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS))
               console.log('Cannot compile shader:\n\n' + gl.getShaderInfoLog(shader));
            gl.attachShader(program, shader);
         };

         addshader(gl.VERTEX_SHADER  , vertexShader  );                            // Add the vertex and fragment shaders.
         addshader(gl.FRAGMENT_SHADER, fragmentShaderHeader + fragmentShader);

         gl.linkProgram(program);                                                  // Link the program and report any errors.
         if (! gl.getProgramParameter(program, gl.LINK_STATUS))
            console.log('Could not link the shader program!');
         gl.useProgram(program);

         gl.uTime = gl.getUniformLocation(program, 'uTime');                       // Remember address of uTime variable.

         gl.program = program;

         gl.enable(gl.DEPTH_TEST);
         gl.depthFunc(gl.LEQUAL);
      }

      canvas.setShaders(vertexShader, fragmentShader);                        // Initialize everything,

      setInterval(function() {                                                // Start the animation loop.
         var gl = canvas.gl, scene = canvas.scene;
	 var fl = 3;

         if (! scene || ! gl.program)
            return;

         if (gl.startTime === undefined)                                           // First time through,
            gl.startTime = Date.now();                                             //    record the start time.
         time = (Date.now() - gl.startTime)  / 1000;

         update(time);

         gl.uniform1f(gl.uTime, time);              // Set time for the shaders.

         for (var n = 0 ; n < scene.objects.length ; n++) {
            var obj = scene.objects[n];
            obj.init(gl);

            var matrixAddr = gl.getUniformLocation(gl.program, 'matrix');

            var renderMatrix = M.identityMatrix();
            M.matrixMultiply([1,0,0,0, 0,1,0,0, 0,0,1,.3, 0,0,0,1], obj.matrix, renderMatrix);
            gl.uniformMatrix4fv(matrixAddr, false, renderMatrix);

            gl.drawArrays(gl.TRIANGLES, 0, obj.vertices.length / obj.vertexSize);
         }
      }, 30);

   }, 100); // Wait 100 milliseconds after page has loaded before starting WebGL.
}

function addTextEditor(code, callback) {                                // Add a text editor to the web page:
   document.body.innerHTML = [''
      ,'<table><tr><td width=10></td><td valign=top>'                         // Insert new html for textArea into the page.
      ,'<textArea id=textArea '
      ,'style="font:13px courier;outline-width:0;border-style:none;resize:none;overflow:scroll;"'
      ,'></textArea>'
      ,'</td><td valign=top>' + document.body.innerHTML + '</td></tr></table>'
      ].join('');
   textArea.value = code;                                                    // Set its current text to user-provided code.
   var i = 0, text = textArea.value.split('\n');                             // Set the correct number of rows and columns.
   textArea.rows = Math.max(text.length, 50);
   while (i < text.length)
      textArea.cols = Math.max(textArea.cols, text[i++].length);
   textArea.style.backgroundColor = 'black';                                 // Set the text editor's text and bg colors.
   textArea.style.color = 'white';
   textArea.onkeyup = callback;                                              // User-provided callback function on keystroke.
}

