(function(define) {'use strict'
	define("latte_three/scenes/scene", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
      /**
       *
       *  @module  scenes
       *  @namespace scene
       */

      /**
       * 场景
       * @class Scene
       * @extends Object3D
       */
      var Object3D = require("../core/object3d");
      var Scene = function() {
         Object3D.call(this);
         this.type = "Scene";
         this.fog = null;
         this.overrideMaterial = null;
         this.autoUpdate = true;
      };
      latte_lib.inherits(Scene, Object3D);
      (function() {
          this.copy = function(source) {
             Object3D.prototype.copy.call(this, source);
             if(source.fog !== null) { this.fog = source.fog.clone(); }
             if(source.overrideMaterial !== null) { this.overrideMaterial = source.overrideMaterial.clone();}

             this.autoUpdate = source.authUpdate;
             this.matrixAutoUpdate = source.matrixAutoUpdate;
             return this;
          }
      }).call(Scene.prototype);

  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
