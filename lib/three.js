(function(define) {'use strict'
	define("latte_three/three.js", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
    var THREE = { REVISION: "73" };
    if(window.requestAnimationFrame === undefined || window.cancelAnimationFrame === undefined) {
       (function(self) {
          var lastTime = 0;
          var vendors = ["ms", "moz", "webkit", "o"];
          //设置window.RequestAnimationFrame
          for(var x = 0; x < vendors.length && !self.requestAnimationFrame; ++x) {
            self.requestAnimationFrame = self[ vendors[ x ] + 'RequestAnimationFrame' ];
            self.cancelAnimationFrame = self[ vendors[ x ] + 'CancelAnimationFrame' ] || self[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
          }
          if(self.cancelAnimationFrame === undefined && self.setTimeout !== undefined) {
             self.cancelAnimationFrame = function(id) {
                self.clearTimeout(id);
             }
          }
          if(self.cancelAnimationFrame === undefined && self.clearTimeout !== undefined) {
              self.cancelAnimationFrame = function(id) {
                self.clearTimeout(id);
              }
          }


       })(window);
    }
    //设置proformance.now
    self.preformance = self.preformance || {};
    if(self.proformance.now === undefined) {
      (function() {
          var start = Date.now();
          self.proformance.now = function() {
             return Date.now() - start;
          }
      })();
    };
    //设置Number.EPSILON
    if(Number.EPSILON === undefined) {
       Number.EPSILON = Math.pow(2, -52);
    }
    //设置Math.sign
    if(Math.sign === undefined) {
        Math.sign = function(x) {
          return (x < 0) ? -1: (x >0) ? 1: +x;
        }
    }
		//设置name
    if(Function.prototype.name === undefined && Object.defineProperty !== undefined) {
       Object.defineProperty(Function.prototype, "name", {
         get: function() {
            return this.toString().match( /^\s*function\s*(\S*)\s*\(/ )[ 1 ];
         }
       });
    }

    (function() {
			 this.MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2};
			 this.CullFaceNone = 0;
			 this.CullFaceBack = 1;
			 this.CullFaceFront = 2;
			 this.CullFaceFrontBack = 3;

			 this.FrontFaceDirectionCW = 0;
			 this.FrontFaceDirectionCCW = 1;

			 //SHADOWING TYPES
			 this.BasicShadowMap = 0;
			 this.PCFShadowMap = 1;
			 this.PCFSoftShadowMap = 2;

			 //side
			 this.FrontSide = 0;
			 this.BackSide = 1;
			 this.DoubleSide = 2;

			 //shading
			 this.FlatShading = 1;
			 this.SmoothShading = 2;

			 //colors
			 this.NoColors = 0;
			 this.FaceColors = 1;
			 this.VertexColors = 2;

			 //blending modes
			 this.NoBlending = 0;
			 this.NormalBlending = 1;
			 this.AdditiveBlending = 2;
			 this.SubtractiveBlending = 3;
			 this.MultiplyBlending = 4;
			 this.CustomBlending = 5;

			 //custom blending equations
			 //(numbers start from 100 not to clash with other)
			 //mappings to OpenGL constants defined in Texture.js

			 this.AddEquation = 100;
			 this.SubtractEquation = 101;
			 this.ReverseSubtractEquation = 102;
			 this.MinEquation = 103;
			 this.MaxEquation = 104;

			 //custom blending destination factors
			 this.ZeroFactor = 200;
			 this.OneFactor = 201;
			 this.SrcColorFactor = 202;
			 this.OneMinusSrcColorFactor = 203;
			 this.SrcAlphaFactor = 204;
			 this.OneMinusSrcAlphaFactor = 205;
			 this.DstAlphaFactor = 206;
			 this.OneMinusdstAlphaFactor = 207;

			 

    }).call(module.exports);

  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
