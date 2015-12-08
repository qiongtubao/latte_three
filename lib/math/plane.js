(function(define) {'use strict'
	define("latte_three/math/plane", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
    var Vector3 = require("./vector3")
      ;
      /**
        @module math
      */
    /**
      面
      @class Plane 

    */
      var Plane = function(normal, constant) {
          this.normal = (normal !== undefined )? normal : new Vector3(1,0,0);
          this.constant = (constant !== undefined) ? constant : 0;
      };
      (function() {
        this.set = function(normal, constant) {
           this.normal.copy(normal);
           this.constant = constant;
           return this;
        }

        this.setComponent = function(x,y,z,w) {
          this.normal.set(x,y,z);
          this.constant = w;
          return this;
        }
        this.setFromNormalAndCoplanarPoint = function(normal, point) {
           this.normal.copy(normal);
           this.constant = -point.dot(this.normal);
           return this;
        }

        this.setFromCoplanaPoints = function() {
           var v1 = new Vector3();
           var v2 = new Vector3();
           return function(a,b,c) {
              var normal = v1.subVectors(c, b).cross(v2.subVectors(a,b)).normalize();
              this.setFromNormalAndCoplanarPoint(normal, a);
              return this;
           };
        }();

        this.clone = function() {
           return this.constructor().copy(this);
        }

        this.copy = function(plane) {
           this.normal.copy(plane.normal);
           this.constant = plane.constant;
           return this;
        }

        this.normalize = function() {
           var inverseNormalLength = 1.0 / this.normal.length();
           this.normal.multiplyScalar(inverseNormalLength);
           this.constant *= inverseNormalLength;
           return this;
        }

        this.negate = function() {
            this.constant *= -1;
            this.normal.negate();
            return this;
        }

        this.distanceToPoint = function(point) {
          return this.normal.dot(point) + this.constant;
        }

        this.distanceToSphere = function(sphere) {
           return this.distanceToPoint(sphere.center) - sphere.radius;
        }

        this.projectPoint = function(point, optionalTarget) {
           return this.orthoPoint(point, optionalTarget).sub(point).negate();
        }

        this.orthoPint = function(point, optionalTarget) {
            var perpendicularManitude = this.distanceToPoint(point);
            var result = optionalTarget || new Vector3();
            return result.copy(this.normal).multiplyScalar(perpendicularManitude);
        }
        this.isIntersectionLine = function(line) {
            var startSign = this.distanceToPoint(line.start);
            var endSign = this.distanceToPoint(line.end);
            return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
        }

        this.intersectLine = function() {
          var v1 = new THREE.Vector3();

      		return function ( line, optionalTarget ) {

      			var result = optionalTarget || new THREE.Vector3();

      			var direction = line.delta( v1 );

      			var denominator = this.normal.dot( direction );

      			if ( denominator === 0 ) {

      				// line is coplanar, return origin
      				if ( this.distanceToPoint( line.start ) === 0 ) {

      					return result.copy( line.start );

      				}

      				// Unsure if this is the correct method to handle this case.
      				return undefined;

      			}

      			var t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

      			if ( t < 0 || t > 1 ) {

      				return undefined;

      			}

      			return result.copy( direction ).multiplyScalar( t ).add( line.start );

      		};
        }

        this.coplanarPoint = function(optionalTarget) {
            var result = optionalTarget || new Vector3();
	          return result.copy( this.normal ).multiplyScalar( - this.constant );
        }

        this.applyMatrix4 = function() {
            var v1 = new Vector3();
        		var v2 = new Vector3();
        		var m1 = new Matrix3();

        		return function ( matrix, optionalNormalMatrix ) {

        			// compute new normal based on theory here:
        			// http://www.songho.ca/opengl/gl_normaltransform.html
        			var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix( matrix );
        			var newNormal = v1.copy( this.normal ).applyMatrix3( normalMatrix );

        			var newCoplanarPoint = this.coplanarPoint( v2 );
        			newCoplanarPoint.applyMatrix4( matrix );

        			this.setFromNormalAndCoplanarPoint( newNormal, newCoplanarPoint );

        			return this;

        		};
        }

        this.translate = function(offset) {
           this.constant = this.constant - offset.dot(this.normal);
           return this;
        }
        this.equals = function(plane) {
           return plane.normal.equals( this.normal ) && ( plane.constant === this.constant );
        }

      }).call(Plane.prototype);
      module.exports = Plane;
  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
