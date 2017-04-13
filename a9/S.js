
/*
   Here are the old way of defining S (commented out)
   followed by the better way of defining S, so you can
   compare and contrast them.
*/

// --------------------- OLD WAY -----------------------
// There is no way to hide inner functions or variables.

/*
var S = {};

   S._quad = function(f, u0, v0, u1, v1) {
      var q = [];
      q.push(f(u0, v0));
      q.push(f(u1, v0));
      q.push(f(u1, v1));
      q.push(f(u0, v1));
      q.push(f(u0, v0));
      return q;
   }

   S.parametricMesh = function(f, nu, nv) {
      var i, j, u, v, C = [];
      for (j = 0 ; j < nv ; j++) {
         v = j / nv;
         for (i = 0 ; i < nu ; i++) {
            u = i / nu;
	    C.push(S._quad(f, u, v, u + 1/nu, v + 1/nv));
         }
      }
      return C;
   }

   S.sphere = function(u, v) {
      var theta = 2 * Math.PI * u;
      var phi = Math.PI * (v - .5);
      return [ Math.cos(theta) * Math.cos(phi),
               Math.sin(theta) * Math.cos(phi),
                                 Math.sin(phi) ];
   }

   S.tube = function(u, v) {
      var theta = 2 * Math.PI * u;
      return [ Math.cos(theta),
               Math.sin(theta),
	       2 * v - 1 ];
   }
*/

// ---------------- BETTER WAY -----------------
// S is a single instance of an anonymous class.

var S = (function() {               
   var my = {};

   function quad(f, u0, v0, u1, v1) { // Local to this class.
      var q = [];
      q.push(f(u0, v0));
      q.push(f(u1, v0));
      q.push(f(u1, v1));
      q.push(f(u0, v1));
      q.push(f(u0, v0));
      return q;
   }

   my.parametricMesh = function(f, nu, nv) {
      var i, j, u, v, C = [];
      for (j = 0 ; j < nv ; j++) {
         v = j / nv;
         for (i = 0 ; i < nu ; i++) {
            u = i / nu;
	    C.push(quad(f, u, v, u + 1/nu, v + 1/nv));
         }
      }
      return C;
   }

   my.sphere = function(u, v) {
      var theta = 2 * Math.PI * u;
      var phi = Math.PI * (v - .5);
      return [ Math.cos(theta) * Math.cos(phi),
               Math.sin(theta) * Math.cos(phi),
                                 Math.sin(phi) ];
   }

   my.tube = function(u, v) {
      var theta = 2 * Math.PI * u;
      return [ Math.cos(theta),
               Math.sin(theta),
	       2 * v - 1 ];
   }
   
   return my;
})();

