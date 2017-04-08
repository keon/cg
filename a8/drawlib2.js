   var startTime = Date.now() / 1000, time = startTime;
   function drawCanvases(canvases) {
      window.canvases = canvases;
      for (var i = 0 ; i < canvases.length ; i++)
         defineCanvasProperties(canvases[i]);
      setInterval(function() {
         var i, canvas, context;
         time = Date.now() / 1000 - startTime;
         for (i = 0 ; i < canvases.length ; i++)
            if ((canvas = canvases[i]).update) {
               context = canvas.getContext('2d');
               context.clearRect(0, 0, canvas.width, canvas.height);
               canvas.update(context);
            }
       }, 30);
   }
   function defineCanvasProperties(canvas) {
      canvas.cursor = {x:0, y:0, z:0};
      canvas.setCursor = function(x, y, z) {
         var r = this.getBoundingClientRect();
	 this.cursor.x = x - r.left;
	 this.cursor.y = y - r.top;
	 if (z !== undefined)
	    this.cursor.z = z;
      }
      canvas.onmousedown = function(e) { this.setCursor(e.clientX, e.clientY, 1); }
      canvas.onmousemove = function(e) { this.setCursor(e.clientX, e.clientY   ); }
      canvas.onmouseup   = function(e) { this.setCursor(e.clientX, e.clientY, 0); }

      canvas.drawCurves = function(m, C) {
         var i, n, p, pix, x, y, z, fl = 5,
	     w = this.width; h = this.height, g = this.getContext('2d');

         // LOOP THROUGH CURVES.

         for (n = 0 ; n < C.length ; n++) {

            // BUILD THE PROJECTED CURVE, POINT BY POINT.

	    pix = [];
	    for (i = 0 ; i < C[n].length ; i++) {

	       // TRANSFORM POINT

	       p = M.transform(m, C[n][i]);

	       // RETRIEVE COORDINATES FROM TRANSFORMED POINT

	       x = p[0];
	       y = p[1];
	       z = p[2];

	       // DO PERSPECTIVE TRANSFORM

	       x *= fl / (fl - z);
	       y *= fl / (fl - z);

	       // DO VIEWPORT TRANSFORM

	       x =  w * x * .5 + .5 * w;
	       y = -w * y * .5 + .5 * h;
	       pix.push([x, y]);
            }

	    // DRAW THE PROJECTED CURVE ONTO THE CANVAS.

	    g.beginPath();
            g.moveTo(pix[0][0], pix[0][1]);
	    for (i = 1 ; i < pix.length ; i++)
               g.lineTo(pix[i][0], pix[i][1]);
	    g.stroke();
         }
      }
   }

