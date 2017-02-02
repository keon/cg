
var fragmentShaderHeader = [''               // PREDEFINED STUFF FOR FRAGMENT SHADERS
,'   precision highp float;'
].join('\n');

function gl_start(canvas, vertexShader, fragmentShader) {           // START WEBGL RUNNING IN A CANVAS

   setTimeout(function() {
      try { 
         canvas.gl = canvas.getContext('experimental-webgl');                 // Make sure WebGl is supported.
      } catch (e) { throw 'Sorry, your browser does not support WebGL.'; }

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

         gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());                        // Create a square as a triangle strip
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(                          //    consisting of two triangles.
                       [ -1,1,0, 1,1,0, -1,-1,0, 1,-1,0 ]), gl.STATIC_DRAW);

         var aPos = gl.getAttribLocation(program, 'aPos');                         // Assign aPos attribute to each vertex.
         gl.enableVertexAttribArray(aPos);
         gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

         gl.uTime = gl.getUniformLocation(program, 'uTime');                       // Remember address of uTime variable.
      }

      canvas.setShaders(vertexShader, fragmentShader);                        // Initialize everything,

      setInterval(function() {                                                // Start the animation loop.
         var gl = canvas.gl;

         if (gl.startTime === undefined)                                           // First time through,
            gl.startTime = Date.now();                                             //    record the start time.
         gl.uniform1f(gl.uTime, (Date.now() - gl.startTime)  / 1000);              // Set time for the shaders.

         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);                                   // Render the square.
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

