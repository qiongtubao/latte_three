(function(define) {'use strict'
	define("latte_three/renderer/webgl/webglExtensions", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		/**
 			@module renderer
 			@namespace webgl
 		*/
 		/**
 			webgl 扩展
 			@class WebglExtensions
 		*/
 		var WebglExtensions = function(gl) {
 			var extensions = {};
 			/**
 				获得扩展
 				@method get
 				@param name {String}
 			*/
 			this.get = function(name) {
 				if(extensions[name] !== undefined) {
 					return extensions[ name ];
 				}
 				var extension;
 				switch(name) {
 					case "EXT_texture_filter_anisotropic":
		 					extension = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
						break;
 					case "WEBGL_compressed_texture_s3tc":
		 					extension = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
						break;
 					case "WEBGL_compressed_texture_pvrtc":
 							extension = gl.getExtension( 'WEBGL_compressed_texture_pvrtc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
						break;
 					default:
 						extension = gl.getExtension(name);
 				}
 				if(extension === null) {
 					console.warn( 'THREE.WebGLRenderer: ' + name + ' extension not supported.' );
 				}
 				extensions[name] = extension;
 				return extension;
 			}
 		};
 		module.exports = WebglExtensions;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
