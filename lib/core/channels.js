(function(define) {'use strict'
	define("latte_three/core/channels", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		/**
 		 * @module core
 		 */
 		/**
 		 * 通道
 		 * @class  Channels
 		 */
 		var Channels = function() {
 			this.mask = 1;
 		};
 		(function() {
 			/**
 			 * @method set
 			 * @param {Int} channel [description]
 			 */
 			this.set = function(channel) {
 				this.mask = 1 << channel;
 			}

 			/**
 			 * @method  enable
 			 * @param {Int} [varname] [description]
 			 */
 			this.enable = function(channel) {
 				this.mask |= 1 << channel;
 			}

 			/**
 			 * @method  toggle
 			 * @param  {Int} channel [description]
 			 */
 			this.toggle = function(channel) {
 				this.mask ^= 1 << channel;
 			}

 			/**
 			 * @method  disable
 			 * @param  {Int} channel [description]
 			 */
 			this.disable = function(channel) {
 				this.mask &= ~ ( 1 << channel );
 			}
 		}).call(Channels.prototype);
		module.exports = Channels;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
