var S = {};

   S._quad = function(f, u0, v0, u1, v1) {
      return [
         f(u0, v0),
         f(u1, v0),
         f(u1, v1),
         f(u0, v1),
         f(u0, v0)
      ];
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

   S.tube = function(u, v) {
      var theta = 2 * Math.PI * u;
      return [ Math.cos(theta),
               Math.sin(theta),
	       2 * v - 1 ];
   }

