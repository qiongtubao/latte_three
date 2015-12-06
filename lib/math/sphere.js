(function(define) {'use strict'
	define("latte_three/math/sphere", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		var Sphere = function(center, radius) {
 			this.center = ( center !== undefined ) ? center : new THREE.Vector3();
			this.radius = ( radius !== undefined ) ? radius : 0;
 		};
 		(function() {
 			this.set = function(center, radius) {
 				this.center.copy(center);
 				this.radius = radius;
 				return this;
 			}

 			this.setFromPoints = function() {
 				var box = new Box3();
 			}
 		}).call(Sphere.prototype);
 		(function() {

 		}).call(Sphere);
 		module.exports = Sphere;

 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
