(function(define) {'use strict'
	define("latte_three/math/vector3", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		/**
	      @module math
	    */
 		/**
 			3维向量
 			@class Vector3
 		*/
 		var Vector3 = function(x, y, z) {
 			this.x = x || 0;
 			this.y = y || 0;
 			this.z = z || 0;
 		};
 		(function() {
 			this.set = function(x, y, z) {
 				this.x = x;
 				this.y = y;
 				this.z = z;
 				return this;
 			}
 			this.setX = function(x) {
 				this.x = x;
 				return this;
 			}
 			this.setY = function(y) {
 				this.y = y;
 				return this;
 			}

 			this.setZ = function(z) {
 				this.z = z;
 				return this;
 			}

 			this.setComponent = function(index, value) {
 				switch(index) {
 					case 0: this.x = value; break;
 					case 1: this.y = value; break;
 					case 2: this.z = value; break;
 					default : throw new Error("index is out of range: " + index);
 				}
 			}

 			this.getComponent = function(index) {
 				switch(index) {
 					case 0: return this.x;
 					case 1: return this.y;
 					case 2: return this.z;
 					default: throw new Error("index is out of range: " + index);
 				}
 			}

 			this.clone = function() {
 				return new this.constructor(this.x, this.y, this.z);
 			}

 			this.copy = function(v) {
 				this.x = v.x;
 				this.y = v.y;
 				this.z = v.z;
 				return this;
 			}

 			this.add = function(v, w) {
 				if(w !== undefined) {
 					console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
					return this.addVectors( v, w );
 				}
 				this.x += v.x;
				this.y += v.y;
				this.z += v.z;

				return this;
 			}

 			this.addScalar = function(s) {
 				this.x += s;
 				this.y += s;
 				this.z += s;
 				return this;
 			}

 			this.addVectors = function(a, b) {
 				this.x = a.x + b.x;
 				this.y = a.y + b.y;
 				this.z = a.z + b.z;
 				return this;
 			}

 			this.addScaledVector = function(v, s) {
 				this.x += v.x * s;
 				this.y += v.y * s;
 				this.z += v.z * s;
 				return this;
 			}

 			this.sub = function(v, w) {
 				if( w !== undefined) {
 					console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
					return this.subVectors( v, w );
 				}
 				this.x -= v.x;
 				this.y -= v.y;
 				this.z -= v.z;
 				return this;
 			}

 			this.subScalar = function(s) {
 				this.x -= s;
 				this.y -= s;
 				this.z -= s;
 				return this;
 			}

 			this.subVectors = function(a, b) {
 				this.x = a.x - b.x;
 				this.y = a.y - b.y;
 				this.z = a.z - b.z;
 				return this;
 			}

 			this.multiply = function(v, w) {
 				if( w !== undefined) {
 					console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
					return this.multiplyVectors( v, w );
 				}
 				this.x *= v.x;
 				this.y *= v.y;
 				this.z *= v.z;
 				return this;
 			}

 			this.multiplyScalar = function(scalar) {
 				if(isFinite(scalar)) {
 					this.x *= scalar;
 					this.y *= scalar;
 					this.z *= scalar;
 				} else {
 					this.x = 0;
 					this.y = 0;
 					this.z = 0;
 				}
 				return this;
 			}

 			this.multiplyVectors = function(a, b) {
 				this.x = a.x * b.x;
 				this.y = a.y * b.y;
 				this.z = a.z * b.z;
 				return this;
 			}

 			this.applyEuler = (function() {
 				var quaternion;
 				return function applyEuler(euler) {
 					if ( euler instanceof THREE.Euler === false ) {

						console.error( 'THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.' );

					}

					if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

					this.applyQuaternion( quaternion.setFromEuler( euler ) );

					return this;
 				};
 			})();

 			this.applyAxisAngle = (function() {
 				var quaternion;
 				return function applyAxisAngle(axis, angle) {
 					if(quaternion === undefined) quaternion = new Quaternion();
 					this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
 					return this;
 				}
 			})();

 			this.applyMatrix3 = function(m) {
 				var x = this.x;
 				var y = this.y;
 				var z = this.z;
 				var e = m.elements;

				this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
				this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
				this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

				return this;
 			}

 			this.applyMatrix4 = function(m) {
 				var x = this.x, y = this.y, z = this.z;

				var e = m.elements;

				this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
				this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
				this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

				return this;
 			}
 			this.applyProjection = function(m) {
 				 var x = this.x, y = this.y , z = this.z;
				 var e = m.elements;
				 this.x = (e[0] * x + e[4] * y + e[8] * z + e[12] ) * d;
				 this.y = (e[1] * x + e[5] * y + e[9] * z + e[13] ) * d;
				 this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
				 return this;
 			}

			this.applyQuaternion = function(q) {
				 var x = this.x;
				 var y = this.y;
				 var z = this.z;

				 var qx = q.x;
				 var qy = q.y;
				 var qz = q.z;
				 var qw = q.w;

				 var ix = qw * x + qy * z - qz * y;
				 var iy = qw * y + qz * x - qx * z;
				 var iz = qw * z + qx * y - qy * x;
				 var iw = -qx * x - qy * y - qz * z;

				 this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
				 this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
				 this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
				 return this;
			}

			this.project = function() {
				 var matrix;
				 return function project(camera) {
					  if(matrix === undefined) {
							 matrix = new Matrix4();
						}
						matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
						return this.applyProjection(matrix);

				 }
			}();

			this.unproject = (function() {
				 var matrix;
				 return function unproject(camera) {
					 if(matrix === undefined) { matrix = new Matrix4(); }
					 matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
					 return this.applyProjection(matrix);
				 }
			})();

			this.transformDirection = function(m) {
				var x = this.x , y = this.y , z = this.z;
				var e = m.elements;
				this.x = e[0] * x + e[4] * y + e[8] * z;
				this.y = e[1] * x + e[5] * y + e[9] * z;
				this.z = e[2] * x + e[6] * y + e[10] * z;
				this.normalize();
				return this;
			}

			this.divide = function(v) {
				this.x /= v.x;
				this.y /= v.y;
				this.z /= v.z;
				return this;
			}

			this.divideScalar = function(scalar) {
					return this.multiplyScalar(1/scalar);
			}

			this.min = function(v) {
				 this.x = Math.min(this.x, v.x);
				 this.y = Math.min(this.y , v.y);
				 this.z = Math.min(this.z, v.z);
				 return this;
			}

			this.max = function(v) {
				this.x = Math.max(min.x , Math.min(max.x, this.x));
				this.y = Math.max(min.y , Math.min(max.y, this.y));
				this.z = Math.max(min.z, Math.min(max.z, this.z));
				return this;
			};

			this.clampScalar = (function() {
				 var min, max;
				 return function clampScalar(minVal, maxVal) {
					  if(min === undefined) {
							 min = new Vector3();
							 max = new Vector3();
						}
						min.set(minVal, minVal, minVal);
						max.set(maxVal, maxVal, maxVal);
						return this.clamp(min, max);
				 };
			})();

			this.clampLength = function(min, max) {
				 var length = this.length();
				 thuis.multiplyScalar(Math.max(min, Math.min(max, length))/ length);
				 return this;
			}

			this.floor = function() {
				 this.x = Math.floor(this.x);
				 this.y = Math.floor(this.y);
				 this.z = Math.floor(this.z);
				 return this;
			}

			this.ceil = function() {
					this.x = Math.ceil(this.x);
					this.y = Math.ceil(this.y);
					this.z = Math.ceil(this.z);
					return this;
			}

			this.round = function() {
					this.x = Math.round(this.x);
					this.y = Math.round(this.y);
					this.z = Math.round(this.z);
					return this;
			}

			this.roundToZero = function() {
				 this.x = (this.x < 0 )? Math.ceil(this.x) : Math.floor(this.x);
				 this.y = (this.y < 0 )? Math.ceil(this.y) : Math.floor(this.y);
				 this.z = (this.z < 0 )? Math.ceil(this.z) : Math.floor(this.z);
				 return this;
			}

			/**
				对称点
				@method negate

			*/
			this.negate = function() {
				 this.x = -this.x;
				 this.y = -this.y;
				 this.z = -this.z;
				 return this;
			}

			/**
				点积
				@method dot
			*/
			this.dot = function(v) {
				 return this.x * v.x + this.y * v.y + this.z * v.z;
			}

			/**

				@method lengthSq
			*/
			this.lengthSq = function() {
				return  this.x * this.x + this.y * this.y + this.z * this.z;
			}

			/**
				离<0，0，0>长度
				@method length
			*/
			this.length = function () {
				return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
			}

			/**
				绝对长度<x,y,z>
				@method lengthManhattan
			*/
			this.lengthManhattan = function() {
				 return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );
			}

			this.normalize = function() {
					return this.divideScalar(this.length());
			}

			this.setLength = function(length) {
					return this.multiplyScalar(length/this.length());
			}
			this.lerp = function(v, alpha) {
				 this.x += (v.x - this.x ) * alpha;
				 this.y += (v.y - this.y) * alpha;
				 this.z += (v.z - this.z) * alpha;
				 return this;
			}
			this.lerpVectors = function(v1, v2, alpha) {
				 this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
				 return this;
			}

			this.cross = function(v, w) {
				 if(w !== undefined) {
					 	console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
		 		 		return this.crossVectors( v, w );
				 }
				 var x = this.x, y = this.y, z = this.z;
				 this.x = y * v.z - z * v.y;
				 this.y = z * v.x - x * v.z;
				 this.z = x * v.y - y * v.x;
				 return this;
			}

			this.crossVetors = function(a, b) {
				 var ax = a.x, ay = a.y, az = a.z;
				 var bx = b.x, by = b.y, bz = b.z;
				 this.x = ay * bz - az * by;
				 this.y = az * bx - ax * bz;
				 this.z = ax * by - ay * bx;
				 return this;
			}

			this.projectOnVector = (function() {
				 var v1, dot;
				 return function projectOnVector(vector) {
					  if(v1 === undefined) v1 = new Vector3();
						v1.copy(vector).normalize();
						dot = this.dot(v1);
						return this.copy(v1).multiplyScalar(dot);
				 }
			})();

			this.projectOnPlane = (function() {
				 var v1;
				 return function reflect(normal) {
					  if( v1 === undefined) v1 = new Vector3();
						return this.sub(v1.copy(normal).multiplyScalar( 2 * this.dot(normal)));
				 }
			})();
			this.angleTo = function(v) {
				 var theta = this.dot(v) / (this.length() * v.length());
				 return Math.acos(mMath.clamp(theta, -1, 1));
			}
			/**
				@method distanceTo
				@param v {Vector3}
				@return {Number}
			*/
			this.distanceTo = function(v) {
					return Math.sqrt(this.distanceToSquared(v));
			}
			/**
				距离点v的距离的平方
				@method distanceToSquared
				@param v {Vector3}
				@return {Number}
			*/
			this.distanceToSquared = function(v) {
				var dx = this.x - v.x;
				var dy = this.y - v.y;
				var dz = this.z - v.z;
				return dx * dx + dy * dy + dz * dz;
			}
			
				/**
					@method setFromMatrixPosition
					@param m {MatrixPosition}

				*/
				this.setFromMatrixPosition = function ( m ) {

					this.x = m.elements[ 12 ];
					this.y = m.elements[ 13 ];
					this.z = m.elements[ 14 ];

					return this;

				}

				/**
					从MatrixScale中读取数据
					@method setFromMatrixScale
					@param m {Matrix4}
				*/
				this.setFromMatrixScale = function ( m ) {

					var sx = this.set( m.elements[ 0 ], m.elements[ 1 ], m.elements[ 2 ] ).length();
					var sy = this.set( m.elements[ 4 ], m.elements[ 5 ], m.elements[ 6 ] ).length();
					var sz = this.set( m.elements[ 8 ], m.elements[ 9 ], m.elements[ 10 ] ).length();

					this.x = sx;
					this.y = sy;
					this.z = sz;

					return this;

				}


				/**
					从Matrix4对象中读取数据
					@method setFromMatrixColumn
					@param  index {Int} 位置
					@param matrix {math.MatrixScale}
				*/
				this.setFromMatrixColumn = function ( index, matrix ) {

					var offset = index * 4;

					var me = matrix.elements;

					this.x = me[ offset ];
					this.y = me[ offset + 1 ];
					this.z = me[ offset + 2 ];

					return this;

				}

				/**
					判断是否相等
					@method equals
					@param v {Vector3}
				*/
				this.equals =  function ( v ) {
					return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );
				}
				/**
					从数组里读取数据
					@method fromArray
					@param array {Array} 被读取数组
					@param offset {Int}	 偏移量
				*/
				this.fromArray = function ( array, offset ) {

					if ( offset === undefined ) offset = 0;

					this.x = array[ offset ];
					this.y = array[ offset + 1 ];
					this.z = array[ offset + 2 ];

					return this;

				}

				/**
					存入数组
					@method toArray
					@param array {Array} 存入数组
					@param offset {Int} 偏移
				*/

				this.toArray = function ( array, offset ) {

					if ( array === undefined ) array = [];
					if ( offset === undefined ) offset = 0;

					array[ offset ] = this.x;
					array[ offset + 1 ] = this.y;
					array[ offset + 2 ] = this.z;

					return array;

				}
				/**
					从Attribute对象中读取数据
					@method fromAttribute
					@param attribute {Attribute}
					@param index  {Int}
					@param offset {Int} 偏移
				*/
				this.fromAttribute = function ( attribute, index, offset ) {

					if ( offset === undefined ) offset = 0;

					index = index * attribute.itemSize + offset;

					this.x = attribute.array[ index ];
					this.y = attribute.array[ index + 1 ];
					this.z = attribute.array[ index + 2 ];

					return this;

				}
 		}).call(Vector3.prototype);
		module.exports = Vector3;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
