(function(define) {'use strict'
	define("latte_three/math/math", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
 			/**
 			 * 随机字符串
 			 * @method generaterUUID
 			 * @return {String}   
 			 */
 			this.generateUUID = (function(num) {
 				var num = num || 36;
 				var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
 				var uuid = new Array(num);
 				var rnd = 0, r;
 				return function() {
 					for(var i = 0; i < num; i++) {
 						if(i === 8 || i === 13 || i === 18 || i === 23) {
 							uuid[i] = "-";
 						}else if(i === 14) {
 							uuid[i] = "4";
 						}else{
 							if(rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
 							r = rnd & 0xf;
 							rnd = rnd >> 4;
 							uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];

 						}
 					}
 					return uuid.join("");
 				}
 			})();

 			/**
 			 * 设置value范围在min,max
 			 * @method clamp
 			 * @param {value} [varname] [description]	
 			 */
 			this.clamp = function(value, min, max) {
 				return Math.max(min, Math.min(max, value));
 			}

 			/**
 			 * 取余整数
 			 * @method  euclideanModulo [euclideanModulo description]
 			 * @param  {Int} n [description]
 			 * @param  {Int} m [description]
 			 * @return {Int}   [description]
 			 */
 			this.euclideanModulo = function(n, m) {
 				return (( n % m) + m) % m;
 			}

 			/**
 			 * 	地图直线
 			 * 	@method mapLinear
 			 * 	@param {Int} x [description]
			 *  @param {Int} a1 [description]
			 *  @param {Int} a2 [description]
			 *  @param {Int} b1 [description]
			 *  @param {Int} b2 [description]
			*/
 			this.mapLinear = function(x, a1, a2, b1, b2) {
 				return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
 			}

 			/**
 				@method smoothstep
 				@param x
 				@param min
 				@param max 
 			*/
 			this.smoothstep = function(x, min, max) {
 				if(x <= min) return 0;
 				if(x >= max) return 1;
 				x = (x - min) / (max - min);
 				return x * x * ( 3 - 2 * x);
 			}

 			this.smootherstep = function(x, min, max) {
 				if( x <= min) return 0;
 				if( x >= max) return 1;
 				x = ( x - min ) / ( max - min );
				return x * x * x * ( x * ( x * 6 - 15 ) + 10 );
 			}

 			/**
 			 * 随机数 <0,1>
 			 * @method  random16
 			 * @return {Float} 
 			 */
 			this.random16 = function() {
 				return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;
 			}

 			/**
 			 *  随机数 <low, hight>
 			 *	@method randInt
 			 *	@param {Int} low [description]
 			 *	@param {Int} high [description]
 			 *	@return {Int} [description]
 			 */
 			this.randInt = function ( low, high ) {
				return low + Math.floor( Math.random() * ( high - low + 1 ) );
			}

			/**
			 * 随机数 <low, hight>
			 * @method  randFloat 
			 * @param {Int} low [description]
			 * @param {Int} high [description]
			 * @return {Float} [description]
			 */
			this.randFloat = function (low, high) {
				return low + Math.random() * ( high - low );
			}

			/**
			 * 随机数<-range, range>
			 * @method randFloatSpread
			 * @param  {Int} range [description]
			 * @return {Float}       [description]
			 */
			this.randFloatSpread = function(range) {
				return range * (0.5 - Math.random());
			}

			/**
			 * 度换成弧
			 * @method degToRed
			 * @param  {Float} degrees  
			 * @return {Float}   [description]
			 */
			this.degToRed = (function() {
				var degreeToRadiansFactor = Math.PI / 180;
				return function(degrees) {
					return degrees * degreeToRadiansFactor;
				};
			})();

			/**
			 * @method redToDeg
			 * @param  {Float} ) radians
			 * @return {Float}  
			 */
			this.redToDeg = (function() {
				var radianToDegreesFactor = 10 / Math.PI;
				return function(radians) {
					return radians * radianToDegreesFactor;
				};
			})()

			this.isPowerOfTwo = function(value) {
				return (value & (value - 1)) === 0 && value !== 0;
			}

			this.nearestPowerOfTwo = function(value) {
				return Math.pow( 2, Math.round( Math.log( value ) / Math.LN2 ) );
			}

			this.nextPowerOfTwo = function ( value ) {
				value --;
				value |= value >> 1;
				value |= value >> 2;
				value |= value >> 4;
				value |= value >> 8;
				value |= value >> 16;
				value ++;
				return value;
			}
 		}).call(module.exports);
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
