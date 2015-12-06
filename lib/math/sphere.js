(function(define) {'use strict'
	define("latte_three/math/sphere", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
		var Box3 = require("./box3")
			, Vector3 = require("./vector3");
		/**
			@class Sphere
			@param center {Vector3} 中心点
			@param radius 半径
		*/
 		var Sphere = function(center, radius) {
 			this.center = ( center !== undefined ) ? center : new Vector3();
			this.radius = ( radius !== undefined ) ? radius : 0;
 		};
 		(function() {
 			this.set = function(center, radius) {
 				this.center.copy(center);
 				this.radius = radius;
 				return this;
 			}

 			this.setFromPoints = (function() {
 				var box = new Box3();
				return function(points, optionalCenter) {
					 var center = this.center;
					 if(optionalCenter !== undefined) {
						  center.copy(optionalCenter);
					 }else {
						 box.setFromPoints(points).center(center);
					 }
					 var maxRadiuSq = 0;
					 for(var i = 0, il = points.length; i < il ; i++) {
						 	maxRadiuSq = Math.max(maxRadiuSq, center.distanceToSquared(points[i]));
					 }
					 this.radius = Math.sqrt(maxRadiuSq);
					 return this;
 				}
 			})();

			this.clone = function() {
				return new this.constructor().copy(this);
			}

			this.copy = function(sphere) {
				 this.center.copy(sphere.center);
				 this.radius = sphere.radius;
				 return this;
			}

			this.empty = function() {
				 return (this.radius <= 0);
			}

			this.containsPoint = function(point) {
				 return (point.distanceToSquared(this.center) <= (this.radius * this.radius));
			}

			this.distanceToPoint = function(point) {
				 return (point.distanceTo(this.center) - this.radius);
			}

			this.intersectsSphere = function(sphere) {
					var radiusSum = this.radius + sphere.radius;
					return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
			}

			this.clampPoint = function(point, optionalTarget) {
				 var deltaLengthSq = this.center.distanceToSquared(point);
				 var result = optionalTarget || new Vector3();
				 result.copy(point);
				 if(deltaLengthSq > (this.radius * this.radius)) {
					  result.sub(this.center).normalize();
						result.multiplyScalar(this.radius).add(this.center);
				 }
				 return result;
			}

			this.getBoundingBox = function(optionalTarget) {
				 var box = optionalTarget || new Box();
				 box.set(this.center, this.center);
				 box.expandByScalar(this.radius);
				 return box;
			}

			this.applyMatrix4 = function(matrix) {
				this.center.applyMatrix4(matrix);
				this.radius = this.radius  * matrix.geMaxScaleOnAxis();
				return this;
			}

			this.translate = function(offset) {
				 this.center.add(offset);
				 return this;
			}

			this.equals = function(sphere) {
					return sphere.center.equals(this.center) && (sphere.radius === this.radius);
			}

 		}).call(Sphere.prototype);
 		(function() {

 		}).call(Sphere);
 		module.exports = Sphere;

 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
