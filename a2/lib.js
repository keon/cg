
function isChrome() {
   return navigator.userAgent.toLowerCase().indexOf('chrome/') > -1
}

var fragmentShaderHeader = [''               // SHADER HEADER
,'   precision highp float;'
].join('\n');

function gl_start(canvas, vertexShader) {           // START WEBGL RUNNING IN A CANVAS
   gl_vertexShader = vertexShader;
   fragmentShader = textArea.fss[1];

   setTimeout(function() {
      try { 
         canvas.gl = canvas.getContext('experimental-webgl');                 // Make sure WebGl is supported.
      } catch (e) { throw 'Sorry, your browser does not support WebGL.'; }

      canvas.setFragmentShader = function(fragmentShader) {
         this.setShaders(gl_vertexShader, fragmentShader);
      }

      canvas.setShaders = function(vertexShader, fragmentShader) {            // Add the vertex and fragment shaders:
         var gl = this.gl, program = gl.createProgram();                           // Create the WebGL program.
         var shaderError = '';
	 errorLineNumber = -1;

         function addshader(type, src) {                                           // Create and attach a WebGL shader.
            var shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	       shaderError = gl.getShaderInfoLog(shader);
               console.log('Cannot compile shader:\n\n' + shaderError);
            }
            gl.attachShader(program, shader);
         };

         addshader(gl.VERTEX_SHADER  , vertexShader  );                            // Add the vertex and fragment shaders.
         addshader(gl.FRAGMENT_SHADER, fragmentShaderHeader + fragmentShader);

         gl.linkProgram(program);                                                  // Link the program and report any errors.
         if (! gl.getProgramParameter(program, gl.LINK_STATUS))
            console.log('Could not link the shader program!');

         else {
            gl.useProgram(program);

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());                        // Create a square as a triangle strip
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(                          //    consisting of two triangles.
                          [ -1,1,0, 1,1,0, -1,-1,0, 1,-1,0 ]), gl.STATIC_DRAW);

            var aPos = gl.getAttribLocation(program, 'aPos');                         // Assign aPos attribute to each vertex.
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

            gl.uTime = gl.getUniformLocation(program, 'uTime');                       // Remember address of uTime variable.
         }

	 textArea.style.color = shaderError.length == 0 ? 'white' : '#ffffa0';
	 if (shaderError.length == 0)
	    errorMessage.innerHTML = '';
         else {
	    var message = shaderError.substring(9, shaderError.length);
	    errorLineNumber = parseInt(message) - 2;
	    message = message.substring(message.indexOf(' '), message.length);
	    var nE = message.indexOf('ERROR');
	    if (nE > 0)
	       message = message.substring(0, nE);
	    errorMessage.innerHTML = '<font face=courier>'
	                           + message.substring(0, Math.min(60, message.length))
				   + '</font>';
	 }
         highlight.setHighlight(highlightPattern);
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

var errorLineNumber = -1;
var highlightPattern = '  ';
var index = 0;
function prevIndex() { setIndex(index - 3); }
function nextIndex() { setIndex(index + 3); }

function setIndex(i) {
   var fss = textArea.fss;
   index = Math.max(0, Math.min(fss.length - 3, i));
   highlightPattern = fss[index];
   textArea.setCode(fss[index + 1]);
   narrative.innerHTML = fss[index + 2];
   prevButton.style.background = index == 0 ? 'black' : accentColor(true); 
   nextButton.style.background = index == fss.length - 3 ? 'black' : accentColor(true);
   canvas1.setShaders(gl_vertexShader, fss[index + 1], fss[index + 2]);
   for (i = 0 ; i < fss.length ; i += 3)
      window['indexButton' + i].style.background = accentColor(i == index);
}  

function accentColor(isTrue) { return isTrue ? '#aaddff' : '#006080'; }

function addTextEditor(fss, callback) {                      // Add a text editor to the web page:
   highlightPattern = fss[0];
   var code         = fss[1];
   var narrative    = fss[2];

   function createIndexButtons() {
      var str = '';
      for (var i = 0 ; i < fss.length ; i += 3)
         str += '<button id=indexButton' + i + ' onclick="setIndex(' + i + ')" '
	        + 'style="color:black;background:' + accentColor(i==0) + ';border-style:none;outline-width:0">'
		+ '<b>' + String.fromCharCode(65 + Math.floor(i / 3)) + '</b>'
		+ '</button> &nbsp;'
      return str;
   }

   document.body.innerHTML = [''

      ,'<CENTER>'
      ,'<TABLE cellspacing=0 cellpadding=0 >'
      ,'<TR>'

      ,'<TD valign=top>'

      ,    '<TABLE cellspacing=0 cellpadding=0>'

      ,    '<TR>'
      ,    '<TD>'
      ,    '</TD>'
      ,    '<TD>'
      ,        createIndexButtons()
      ,    '</TD>'
      ,    '</TR>'

      ,    '<TR>'
      ,    '<TD>&nbsp;</TD>'
      ,    '<TD><font color=#ff9090><text id=errorMessage> </text></font></TD>'
      ,    '</TR>'

      ,    '<TR>'
      ,    '<TD valign=top>'
      ,        '<text id=highlight style="font:13px"></text>'
      ,    '</TD>'

      ,    '<TD valign=top>'
      ,        '<table>'

      ,        '<tr>'
      ,        '<td width=100%>'
      ,            '<button id=prevButton style="color:black;background:black;border-style:none;outline-width:0">'
      ,                '<big><b><big>&larr;</big> PREV</b></big>'
      ,            '</button>'

      ,            '&nbsp;'

      ,            '<button id=nextButton style="color:black;background:' + accentColor(true) + ';border-style:none;outline-width:0">'
      ,                '<big><b>NEXT <big>&rarr;</big></b></big>'
      ,            '</button>'
      ,        '</td>'
      ,        '</tr>'

      ,        '<tr>'
      ,        '<td>'
      ,            '<textArea id=textArea '
      ,            'style="background:black;color:white;font:13px courier;outline-width:0;border-style:none;resize:none;overflow:scroll">'
      ,            '</textArea>'
      ,        '</td>'
      ,        '</tr>'

      ,        '<tr>'
      ,        '<td>'
      ,            '<pre><font color=' + accentColor(true) + ' face=helvetica><big><text id=narrative>'
      ,                narrative
      ,            '</text></font><pre>'
      ,        '</td>'
      ,        '</tr>'

      ,        '</table>'
      ,    '</TD>'
      ,    '</TR>'

      ,    '</TABLE>'

      ,'</TD>'

      ,'<TD valign=top>'
      ,    document.body.innerHTML
      ,'</TD>'

      ,'</TR>'
      ,'</TABLE>'
      ,'</CENTER>'

   ].join('');

   prevButton.onclick = prevIndex;
   nextButton.onclick = nextIndex;
   highlight.style.color = accentColor(true);

   highlight.setHighlight = function(hlight) {
      while (hlight.length <= errorLineNumber)
         hlight += ' ';
      var str = '', i;
      for (i = 0 ; i < hlight.length ; i++)
         str += ( i == errorLineNumber ? '<font color=#ff8090>&block;&block;</font>' :
	          hlight.charCodeAt(i) > 32 ? '&block;&block;' : '  ' ) + '\n';
      this.innerHTML = '<hr size=' + (isChrome() ? 10 : 15) + ' color=black><pre>' + str + '</pre>';
   }

   highlight.setHighlight(highlightPattern);

   textArea.setCode = function(code) {
      this.value = code;

      var i = 0, text = this.value.split('\n');                             // Set the correct number of rows and columns.
      this.rows = text.length;
      while (i < text.length)
         this.cols = Math.max(this.cols, text[i++].length);
   }

   textArea.fss = fss;
   textArea.setCode(code);
   textArea.onkeyup = callback;                                              // User-provided callback function on keystroke.
}

