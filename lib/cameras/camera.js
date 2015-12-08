(function(define) {'use strict'
	define("latte_three/cameras/camera", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
      var Object3D = require("../core/object3D")
        , Matrix4 = require("../math/matrix4")
				, Quaternion = require("../math/quaternion")
				, latte_lib = require("latte_lib");
      /**
        @module camera
      */
      /**
        相机
        @class Camera
        @extends Object3D
      */
      var Camera = function() {
          Object3D.call(this);
          this.type = "Camera";
          this.matrixWorldInverse = new Matrix4();
          this.projectionMatrix = new Matrix4();
      };
      latte_lib.inherits(Camera, Object3D);
      (function() {
        /**
          获得世界方向
          @method getWorldDirection
        */
        this.getWorldDirection = (function() {
            var quaternion = new Quaternion();
            return function(optionalTarget) {
               var result = optionalTarget || new Vector3();
               this.getWorldQuaternion(quaternion);
               return result.set(0,0,-1).applyQuaternion(quaternion);
            }
        })();
        /**
          切换视角
          @method lookAt
        */
        this.lookAt = (function() {
           var m1 = new Matrix4();
           return function(vector) {
              m1.lookAt(this.position, vector, this.up);
              this.quaternion.setFromRotationMatrix(m1);
           };
        })();
        /**
          克隆对象
          @method clone
        */
        this.clone = function() {
           return new this.constructor().copy(this);
        }
        /**
          读取数据
          @method copy
          @param source {Camera}
        */
        this.copy = function(source) {
           Object3D.prototype.copy.call(this, source);
           this.matrixWorldInverse.copy(source.matrixWorldInverse);
           this.projectionMatrix.copy(source.projectionMatrix);
           return this;
        }
      }).call(Camera.prototype);
			module.exports = Camera;
  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
