
var fragmentShaderHeader = [''               // PREDEFINED STUFF FOR FRAGMENT SHADERS
,'   precision highp float;'
].join('\n');

function Scene() {
   this.vertexSize = 6;
   var bpe = Float32Array.BYTES_PER_ELEMENT;

   this.setVertices = function(vertices) {
      this.vertices = vertices;
   }

   this.init = function(gl) {
      if (this.gl)
         return;

      this.gl = gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      this.aPos = gl.getAttribLocation(gl.program, 'aPos');
      gl.enableVertexAttribArray(this.aPos);
      this.gl.vertexAttribPointer(this.aPos, 3, gl.FLOAT, false, 6 * bpe, 0 * bpe);
   }
}

function gl_start(canvas, vertexShader, fragmentShader) {           // START WEBGL RUNNING IN A CANVAS
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
      }

      canvas.setShaders(vertexShader, fragmentShader);                        // Initialize everything,

      setInterval(function() {                                                // Start the animation loop.
         var gl = canvas.gl, scene = canvas.scene;

         if (! scene || ! gl.program)
            return;

         if (gl.startTime === undefined)                                           // First time through,
            gl.startTime = Date.now();                                             //    record the start time.
         gl.uniform1f(gl.uTime, (Date.now() - gl.startTime)  / 1000);              // Set time for the shaders.

         scene.init(gl);

         gl.drawArrays(gl.TRIANGLES, 0, scene.vertices.length / scene.vertexSize); // Render the square.
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

