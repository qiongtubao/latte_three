(function(define) {'use strict'
	define("latte_three/math/matrix3", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
      /**
        @module math
      */
			/**
				3*3矩阵
				@class Matrix3
			*/
      var Matrix3 = function() {

          this.elements = new Float32Array([
             1,0,0,
             0,1,0,
             0,0,1
          ]);
          if(arguments.length > 0) {
              console.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.");
          }
      };
      (function() {
          this.set = function(n11, n12, n13, n21, n22, n23, n31,n32, n33) {
              var te = this.elements;
              te[0] = n11; te[3] = n12; te[6] = n13;
              te[1] = n21; te[4] = n22; te[7] = n23;
              te[2] = n31; te[5] = n32; te[8] = n33;
              return this;
          };
          this.identity = function() {
              this.set(
                1,0,0,
                0,1,0,
                0,0,1
              );
              return this;
          }
          this.clone = function() {
              return new this.constructor().fromArray(this.elements);
          }
          this.copy = function(m) {
              var me = m.elements;
              this.set(
                  me[0], me[3], me[6],
                  me[1], me[4], me[7],
                  me[2], me[5], me[8]
              );
              return this;
          }
          this.applyToVector3Array = function() {
             var v1;
             return function(array, offset, length) {
               if(v1 === undefined) v1= new Vector3();
               if(offset === undefined) offset = 0;
               if(length === undefined) length = array.length;
               for(var i = 0, j= offset ; i < length; i+=3, j += 3) {
                  v1.forArray(array, j);
                  v1.applyMatrix3(this);
                  v1.toArray(array, j);
               }
               return array;
             };
          }();

          this.applyToBuffer = function() {
            var v1;

        		return function applyToBuffer( buffer, offset, length ) {

        			if ( v1 === undefined ) v1 = new THREE.Vector3();
        			if ( offset === undefined ) offset = 0;
        			if ( length === undefined ) length = buffer.length / buffer.itemSize;

        			for ( var i = 0, j = offset; i < length; i ++, j ++ ) {

        				v1.x = buffer.getX( j );
        				v1.y = buffer.getY( j );
        				v1.z = buffer.getZ( j );

        				v1.applyMatrix3( this );

        				buffer.setXYZ( v1.x, v1.y, v1.z );

        			}

        			return buffer;

        		};
          }();

          this.multiplyScalar = function(s) {
              var te = this.elements;
              te[0] *= s; te[3] *= s; te[6] *= s;
              te[1] *= s; te[4] *= s; te[7] *= s;
              te[2] *= s; te[5] *= s; te[8] *= s;
              return this;
          }

          this.determinant = function() {
              var te = this.elements;
              var a = te[0], b = te[1], c = te[2],
                  d = te[3], e = te[4], f = te[5],
                  g = te[6], h = te[7], i = te[8];
              return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
          }

          this.getInverse = function(matrix, throwOnInvertible) {
            var me = matrix.elements;
        		var te = this.elements;

        		te[ 0 ] =   me[ 10 ] * me[ 5 ] - me[ 6 ] * me[ 9 ];
        		te[ 1 ] = - me[ 10 ] * me[ 1 ] + me[ 2 ] * me[ 9 ];
        		te[ 2 ] =   me[ 6 ] * me[ 1 ] - me[ 2 ] * me[ 5 ];
        		te[ 3 ] = - me[ 10 ] * me[ 4 ] + me[ 6 ] * me[ 8 ];
        		te[ 4 ] =   me[ 10 ] * me[ 0 ] - me[ 2 ] * me[ 8 ];
        		te[ 5 ] = - me[ 6 ] * me[ 0 ] + me[ 2 ] * me[ 4 ];
        		te[ 6 ] =   me[ 9 ] * me[ 4 ] - me[ 5 ] * me[ 8 ];
        		te[ 7 ] = - me[ 9 ] * me[ 0 ] + me[ 1 ] * me[ 8 ];
        		te[ 8 ] =   me[ 5 ] * me[ 0 ] - me[ 1 ] * me[ 4 ];

        		var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 3 ] + me[ 2 ] * te[ 6 ];

        		// no inverse

        		if ( det === 0 ) {

        			var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

        			if ( throwOnInvertible || false ) {

        				throw new Error( msg );

        			} else {

        				console.warn( msg );

        			}

        			this.identity();

        			return this;

        		}

        		this.multiplyScalar( 1.0 / det );

        		return this;
          }

          this.transpose = function() {
              var tmp, m = this.elements;
              tmp = m[1]; m[1] = m[3]; m[3] = tmp;
              tmp = m[2]; m[2] = m[6]; m[6] = tmp;
              tmp = m[5]; m[5] = m[7]; m[7] = tmp;
              return this;
          }

          this.flattenToArrayOffset = function(array, offset) {
              var te = this.elements;
              array[ offset     ] = te[ 0 ];
              array[ offset + 1 ] = te[ 1 ];
              array[ offset + 2 ] = te[ 2 ];

              array[ offset + 3 ] = te[ 3 ];
          		array[ offset + 4 ] = te[ 4 ];
          		array[ offset + 5 ] = te[ 5 ];

          		array[ offset + 6 ] = te[ 6 ];
          		array[ offset + 7 ] = te[ 7 ];
          		array[ offset + 8 ]  = te[ 8 ];

          		return array;

          }

          this.getNormalMatrix = function(m) {
              this.getInverse(m).transpose();
              return this;
          }

          this.transposeIntoArray = function(r) {
              var m = this.elements;
              r[ 0 ] = m[ 0 ];
          		r[ 1 ] = m[ 3 ];
          		r[ 2 ] = m[ 6 ];
          		r[ 3 ] = m[ 1 ];
          		r[ 4 ] = m[ 4 ];
          		r[ 5 ] = m[ 7 ];
          		r[ 6 ] = m[ 2 ];
          		r[ 7 ] = m[ 5 ];
          		r[ 8 ] = m[ 8 ];

          		return this;
          }
					/**
						@method fromArray
						@param array {Array}
					*/
          this.fromArray = function(array) {
              this.elements.set(array);
              return this;
          }

					/**
						转成数组
						@method toArray
						@return {Array}
					*/
          this.toArray = function() {
              var te = this.elements;
              return [
                  te[0], te[1], te[2],
                  te[3], te[4], te[5],
                  te[6], te[7], te[8]
              ];
          }
      }).call(Matrix3.prototype);
			module.exports = Matrix3;
  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
