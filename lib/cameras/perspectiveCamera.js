(function(define) {'use strict'
	define("latte_three/cameras/perspectiveCamera", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
    var Camera = require("./camera")
			, latte_lib = require("latte_lib")
			, mMath = require("../math/math");
      /**
        @module camera
      */
    /**
      透视相机
      @class PerspectiveCamera
      @extends Camera
    */
     var PerspectiveCamera = function(fov, aspect, near, far) {
        Camera.call(this);
        this.type = "PerspectiveCamera";
        this.zoom = 1;
        this.fov =  fov || 50;
        this.aspect = aspect || 1;
        this.near = near || 0.1;
        this.far = far || 2000;
        this.updateProjectionMatrix();
     };
     latte_lib.inherits(PerspectiveCamera, Camera);
     (function() {
       /*
         使用焦距（单位mm）来估计，并设置视场
         *35毫米（全画幅）相机使用，如果没有指定帧大小;
         *公式的基础上http://www.bobatkins.com/photography/technical/field_of_view.html
          @method setLens
          @param focalLength {Int}
           @param frameHeight {Int}
       */
        this.setLens = function(focalLength, frameHeight) {
           frameHeight = frameHeight || 24;
           this.fov = 2 * mMath.radToDeg(Math.atan(frameHeight / (focalLength * 2)));
           this.updateProjectionMatrix();
        }

      /*
       * Sets an offset in a larger frustum. This is useful for multi-window or
       * multi-monitor/multi-machine setups.
       *
       * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
       * the monitors are in grid like this
       *
       *   +---+---+---+
       *   | A | B | C |
       *   +---+---+---+
       *   | D | E | F |
       *   +---+---+---+
       *
       * then for each monitor you would call it like this
       *
       *   var w = 1920;
       *   var h = 1080;
       *   var fullWidth = w * 3;
       *   var fullHeight = h * 2;
       *
       *   --A--
       *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
       *   --B--
       *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
       *   --C--
       *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
       *   --D--
       *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
       *   --E--
       *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
       *   --F--
       *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
       *
       *   Note there is no reason monitors have to be the same size or in a grid.
       */
        this.setViewOffset = function(fullWidth, fullHeight, x, y , width, height) {
            this.fullWidth = fullWidth;
            this.fullHeight = fullHeight;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.updateProjectionMatrix();
        }

        this.updateProjectionMatrix = function() {
            var fov = mMath.redToDeg(2 * Math.atan(Math.tan(mMath.degToRed(this.fov))));
            if(this.fullWidth) {
               var aspect = this.fullWidth / this.fullHeight;
               var top = Math.tan(mMath.degToRad(fov * 0.5)) * this.near;
               var bottom = -top;
               var left = aspect * bottom;
               var right = aspect * top;
               var width = Math.abs(right - left);
               var height = Math.abs(top - bottom);
               this.projectionMatrix.makeFrustum(
                  left + this.x * width / this.fullWidth,
                  left + (this.x + this.width) * width / this.fullWidth,
                  top - (this.y + this.height) * height / this.fullHeight,
                  top - this.y * height / this.fullHeight,
                  this.near,
                  this.far
               );
            }else {
                this.projectionMatrix.makePerspective(fov, this.aspect, this.near, this.far);
            }
        }

        this.copy = function(source) {
           Camera.prototype.call(this, source);
           this.fov = source.fov;
           this.aspect = source.aspect;
           this.near = source.near;
           this.far = source.far;
           this.zoom = source.zoom;
           return this;
        }

        this.toJSON = function(meta) {
           var data = Object3D.toJSON.call(this, meta);
           data.object.zoom = this.zoom;
           data.object.fov = this.fov;
           data.object.aspect = this.aspect;
           data.object.near = this.near;
           return data;
        }
     }).call(PerspectiveCamera.prototype);
		 module.exports = PerspectiveCamera;
  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
