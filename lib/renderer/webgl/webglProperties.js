(function(define) {'use strict'
	define("latte_three/renderer/webgl/webglProperties", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		/**
 			@module renderer
 			@namespace webgl
 		*/
 		/**
 			@class WebGLProperties
 		*/
 		var WebGLProperties = function() {
 			var properties = {};
 			/**
 				@method get
 				@param object 
 			*/
 			this.get = function(object) {
 				var uuid = object.uuid;
 				var map = properties[uuid];
 				if(map == undefined) {
 					map = {};
 					properties[uuid] = map;
 				}
 				return map
 			};
 			this.delete = function(object) {
 				delete properties[object.uuid];
 			}
 			this.clear = function() {
 				properties = {};
 			}
 		};
 		module.exports = WebGLProperties;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
