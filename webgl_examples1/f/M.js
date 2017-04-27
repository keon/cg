M = (function() {
   var my = {};
   var stack = [];

   my.copy        = function(m, src)   { for (var i = 0 ; i < src.length ; i++) m[i] = src[i]; return m; }
   my.identity    = function(m)        { for (var i = 0 ; i<16 ; i++) m[i] = i % 5 ? 0 : 1; return m; }
   my.restore     = function(m)        { my.copy(m, stack.pop()); }
   my.rotateX     = function(m, a)     { return my.matrixMultiply(m, my.rotateXMatrix  (a)     , m); }
   my.rotateY     = function(m, a)     { return my.matrixMultiply(m, my.rotateYMatrix  (a)     , m); }
   my.rotateZ     = function(m, a)     { return my.matrixMultiply(m, my.rotateZMatrix  (a)     , m); }
   my.save        = function(m)        { stack.push(my.copy([], m)); return m; }
   my.scale       = function(m, x,y,z) { return my.matrixMultiply(m, my.scaleMatrix    (x,y,z) , m); }
   my.translate   = function(m, v)     { my.matrixMultiply(m, my.translationMatrix(v), m); }

   my.identityMatrix = function()      { return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; }
   my.inverseMatrix  = function(src)   {
      function s(col, row) { return src[col & 3 | (row & 3) << 2]; }
      function cofactor(c0, r0) {
         var c1 = c0+1, c2 = c0+2, c3 = c0+3, r1 = r0+1, r2 = r0+2, r3 = r0+3;
         return (c0 + r0 & 1 ? -1 : 1) * ( (s(c1, r1) * (s(c2, r2) * s(c3, r3) - s(c3, r2) * s(c2, r3)))
                                         - (s(c2, r1) * (s(c1, r2) * s(c3, r3) - s(c3, r2) * s(c1, r3)))
                                         + (s(c3, r1) * (s(c1, r2) * s(c2, r3) - s(c2, r2) * s(c1, r3))) ); }
      var n, dst = [], det = 0;
      for (n = 0 ; n < 16 ; n++) dst.push(cofactor(n >> 2, n & 3));
      for (n = 0 ; n <  4 ; n++) det += src[n] * dst[n << 2];
      for (n = 0 ; n < 16 ; n++) dst[n] /= det;
      return dst; }
   my.rotateXMatrix  = function(a)     { return [1,0,0,0, 0,Math.cos(a),Math.sin(a),0, 0,-Math.sin(a),Math.cos(a),0, 0,0,0,1]; }
   my.rotateYMatrix  = function(a)     { return [Math.cos(a),0,-Math.sin(a),0, 0,1,0,0, Math.sin(a),0,Math.cos(a),0, 0,0,0,1]; }
   my.rotateZMatrix  = function(a)     { return [Math.cos(a),Math.sin(a),0,0, -Math.sin(a),Math.cos(a),0,0, 0,0,1,0, 0,0,0,1]; }
   my.scaleMatrix    = function(x,y,z) { if (x instanceof Array) { x = x[0]; y = x[1]; y = x[2]; }
                                        else if (y === undefined) z = y = x;
                                        return [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]; }
   my.translationMatrix = function(v) { return [ 1,0,0,0, 0,1,0,0, 0,0,1,0, v[0],v[1],v[2],1 ]; }
   my.matrixMultiply = function(a, b, dst) {
      var n, tmp = [];
      for (n = 0 ; n < 16 ; n++)
         tmp.push(a[n&3     ] * b[    n&12] +
                  a[n&3 |  4] * b[1 | n&12] +
   	       a[n&3 |  8] * b[2 | n&12] +
   	       a[n&3 | 12] * b[3 | n&12] );
      for (n = 0 ; n < 16 ; n++)
         dst[n] = tmp[n];
   }
   my.transform = function(m, v)  {
       var x = v[0], y = v[1], z = v[2], w = v[3] === undefined ? 1 : v[3];
       return [ x * m[0] + y * m[4] + z * m[ 8] + w * m[12],
                x * m[1] + y * m[5] + z * m[ 9] + w * m[13],
                x * m[2] + y * m[6] + z * m[10] + w * m[14],
                x * m[3] + y * m[7] + z * m[11] + w * m[15] ]; }

   return my;
})();

