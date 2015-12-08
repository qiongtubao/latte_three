(function(define) {'use strict'
	define("latte_three/math/euler", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
		var Quaternion = require("./quaternion");
		/**
	      @module math
	    */
 		/**
 			@class Euler
 		*/
 		var Euler = function(x, y, z, order) {
 			this._x = x || 0;
 			this._y = y || 0;
 			this._z = z || 0;
 			this._order = order || Euler.DefaultOrder;
 		};
 		(function() {
 			Object.defineProperty(this, "x",{
 				enumerable: false,
 				configurable: true,
 				get: function() {
 					return this._x;
 				},
 				set: function(x) {
 					this._x = x;
 					this.onChangeCallback();
 				}
 			});
 			Object.defineProperty(this, "y", {
 				enumerable: false,
 				configurable: true,
 				get: function() {
 					return this._y;
 				},
 				set: function(y) {
 					this._y = y;
 					this.onChangeCallback();
 				}
 			});
 			Object.defineProperty(this, "z", {
 				enumerable: false,
 				configurable: true,
 				get: function() {
 					return this._z;
 				},
 				set : function(z) {
 					this._z = z;
 					this.onChangeCallback();
 				}
 			});
 			Object.defineProperty(this, "order", {
 				enumerable: false,
 				configurable: true,
 				get: function() {
 					return this._order;
 				},
 				set: function(order) {
 					this._order = order;
 					this.onChangeCallback();
 				}
 			});

 			this.set = function(x, y, z, order) {
 				this._x = x;
 				this._y = y;
 				this._z = z;
 				this._order = orde || this._order;
 				this.onChangeCallback();
 				return this;
 			}

			this.setFromRotationMatrix = function(m, order, update) {
					var clamp = mMath.clamp;
					var te = m.elements;
					var m11 = te[0], m12 = te[4], m13 = te[8];
					var m21 = te[1], m22 = te[5], m23 = te[9];
					var m31 = te[2], m32 = te[6], m33 = te[10];
					order = order || this._order;
					if ( order === 'XYZ' ) {

					this._y = Math.asin( clamp( m13, - 1, 1 ) );

					if ( Math.abs( m13 ) < 0.99999 ) {

						this._x = Math.atan2( - m23, m33 );
						this._z = Math.atan2( - m12, m11 );

					} else {

						this._x = Math.atan2( m32, m22 );
						this._z = 0;

					}

				} else if ( order === 'YXZ' ) {

					this._x = Math.asin( - clamp( m23, - 1, 1 ) );

					if ( Math.abs( m23 ) < 0.99999 ) {

						this._y = Math.atan2( m13, m33 );
						this._z = Math.atan2( m21, m22 );

					} else {

						this._y = Math.atan2( - m31, m11 );
						this._z = 0;

					}

				} else if ( order === 'ZXY' ) {

					this._x = Math.asin( clamp( m32, - 1, 1 ) );

					if ( Math.abs( m32 ) < 0.99999 ) {

						this._y = Math.atan2( - m31, m33 );
						this._z = Math.atan2( - m12, m22 );

					} else {

						this._y = 0;
						this._z = Math.atan2( m21, m11 );

					}

				} else if ( order === 'ZYX' ) {

					this._y = Math.asin( - clamp( m31, - 1, 1 ) );

					if ( Math.abs( m31 ) < 0.99999 ) {

						this._x = Math.atan2( m32, m33 );
						this._z = Math.atan2( m21, m11 );

					} else {

						this._x = 0;
						this._z = Math.atan2( - m12, m22 );

					}

				} else if ( order === 'YZX' ) {

					this._z = Math.asin( clamp( m21, - 1, 1 ) );

					if ( Math.abs( m21 ) < 0.99999 ) {

						this._x = Math.atan2( - m23, m22 );
						this._y = Math.atan2( - m31, m11 );

					} else {

						this._x = 0;
						this._y = Math.atan2( m13, m33 );

					}

				} else if ( order === 'XZY' ) {

					this._z = Math.asin( - clamp( m12, - 1, 1 ) );

					if ( Math.abs( m12 ) < 0.99999 ) {

						this._x = Math.atan2( m32, m22 );
						this._y = Math.atan2( m13, m11 );

					} else {

						this._x = Math.atan2( - m23, m33 );
						this._y = 0;

					}

				} else {

					console.warn( 'THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order )

				}

				this._order = order;

				if ( update !== false ) this.onChangeCallback();

				return this;
			}

			this.setFromQuaternion = (function() {
					var matrix;
					return function(q, order, update) {
						 if(matrix === undefined) matrix = new Matrix4();
						 matrix.makeRotationFromQuaternion(q);
						 this.setFromRotationMatrix(matrix, order, update);
						 return this;
					}
			})();

			this.setFromVector3 = function(v, order) {
					return this.set(v.x, v.y, v.z, order || this.order);
			}

			this.reorder = (function() {
					var q = new  Quaternion();
					return function(newOrder) {
						 q.setFromQuaternion(q, newOrder);
						 this.setFromQuaternion(q, newOrder);
					};
			})();

			/**
				@method equals
				@param euler {Euler}
			*/
			this.equals = function(euler) {
					return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );
			}


			/**
				@method clone
				@return euler
			*/
			this.clone = function() {
				return new this.constructor(this._x, this._y, this._z, this._order);
			}



			/**
				@method toArray
				@param array {Array} 数组
				@param offset {Int} 偏移
				@return array {Array}
			*/
			this.toArray = function(array, offset) {
				 if(array === undefined) array = [];
				 if(offset === undefined) offset = 0;
				 array[offset] = this._x;
				 array[offset + 1] = this._y;
				 array[offset + 2] = this._z;
				 array[offset + 3] = this._order;
				 return array;
			}

			/**
				@method copy
				读取Euler对象数据
				@param euler {Euler}
			*/
			this.copy = function(euler) {
				this._x = euler._x;
				this._y = euler._y;
				this._z = euler._z;
				this._order = euler._order;

				this.onChangeCallback();

				return this;
			}
			/**
				产生Vector3对象
				@method toVector3
				@param optionalResult {Class}

			*/
			this.toVector3 = function(optionalResult) {
				if(optionalResult) {
					return optionalResult.set(this._x, this._y, this._z);
				}else{
					return new Vector3(this._x, this._y, this._z);
				}
			}

			this.onChange = function(callback) {
				this.onChangeCallback = callback;
				return this;
			}

			this.onChangeCallback = function() {
				//虚函数
			}
 		}).call(Euler.prototype);
 		(function() {
 			this.DefaultOrder = 'XYZ';
 			this.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];
 		}).call(Euler);
		module.exports = Euler;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
