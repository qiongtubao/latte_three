(function(define) {'use strict'
	define("latte_three/math/euler", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
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

			this.clone = function() {
				return new this.constructor(this._x, this._y, this._z, this._order);
			}

			this.toArray = function(array) {

			}

			this.copy = function(euler) {
				this._x = euler._x;
				this._y = euler._y;
				this._z = euler._z;
				this._order = euler._order;

				this.onChangeCallback();

				return this;
			}

			this.toVector3 = function(optionalResult) {
				if(optionalResult) {
					return optionalResult.set(this._x, this._y, this._z);
				}else{
					return new Vector3(this._x, this._y, this._z);
				}
			}

			this.onchange = function(callback) {
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

 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
