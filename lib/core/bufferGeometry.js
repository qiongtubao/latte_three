(function(define) {'use strict'
	define("latte_three/core/bufferGeometry", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		var Vector3 = require("../math/vector3")
 			, Box3 = require("../math/box3");
 			/**
 				@module core
 			*/
 		/**
 			缓冲区几何
			@class BufferGeometry
 		*/
 		var mMath = require("../math/math");
 		var GeometryIdCount = 0;
 		var BufferGeometry = function() {
 			Object.defineProperty(this, 'id', { value: GeometryIdCount ++});
			var uuid = mMath.generateUUID();
			this.name = "";
			this.type = "BufferGeometry";
	this.index = null;
			this.attributes = {};
			this.morphAttributes = {};
			this.groups = [];
			this.boundingBox = null;
			this.boundingSphere = null;
			this.drawRange = { start: 0, count: Infinity };
 		};
 		(function() {
 			this.constructor = BufferGeometry;
 			this.setIndex = function(index) {
 				this.index = index;
 			}
 			this.getIndex = function() {
 				return this.index;
 			}
 			this.addAttribute = function(name, attribute) {
 				if ( attribute instanceof BufferAttribute === false && attribute instanceof InterleavedBufferAttribute === false ) {
 					console.warn( 'THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).' );

					this.addAttribute( name, new BufferAttribute( arguments[ 1 ], arguments[ 2 ] ) );

					return;
 				}

 				if ( name === 'index' ) {

					console.warn( 'THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute.' );
					this.setIndex( attribute );

					return;

				}

				this.attributes[ name ] = attribute;
 			}
 			this.getAttribute = function ( name ) {
				return this.attributes[ name ];
			}

			this.removeAttribute = function ( name ) {
				delete this.attributes[ name ];
			}
			
			this.addGroup = function(start, count, materialIndex) {
				this.groups.push({
					start: start,
					count: count,
					materialIndex: materialIndex !== undefined? materialIndex : 0
				});
			}

			this.clearGroups = function() {
				this.groups = [];
			}

			this.setDrawRange = function(start, count) {
				this.drawRange.start = start;
				this.drawRange.count = count;
			}

			this.applyMatrix = function(matrix) {
				var position = this.attributes.position;
				if(position !== undefined) {
					matrix.applyToVector3Array(position.array);
					position.needsUpdate = true;
				}
				var normal = this.attributes.normal;
				if(normal !== undefined) {
					var normalMatrix = new Matrix3().getNormalMatrix(matrix);
					normalMatrix.applyToVector3Array(normal.array);
					normal.needsUpdate = true;
				}
				if(this.boundingBox !== null) {
					this.computeBoundingBox();
				}
				if(this.boundingSphere !== null) {
					this.computeBoundingSphere();
				}
			}

			this.rotatex = function() {
				var m1;
				return function rotateX(angle) {
					if(m1 === undefined) m1 = new Matrix4();
					m1.makeRotationX(angle);
					this.applyMatrix(m1);
					return this;
				};
			}();

			this.rotateY = function() {
				var m1;
				return function rotateY(angle) {
					if( m1 === undefined ) m1 = new Matrix4();
					m1.makeRotationY(angle);
					this.applyMatrix(m1);
					return this;
				}
			}();

			this.rotateZ = function() {
				var m1;
				return function rotateZ(angle) {
					if( m1 === undefined ) m1 = new Matrix4();
					m1.makeRotationZ(angle);
					this.applyMatrix(m1);
					return this;
				};
			}();

			this.translate = function() {
				var m1;
				return function translate(x, y, z) {
					 if(m1 === undefined) m1 = new Matrix4();
					 m1.makeTranslation(x, y, z);
					 this.applyMatrix(m1);
					 return this;
				}
			}();

			this.scale = function() {
				var m1;
				return function scale(x,y,z) {
					if(m1 === undefined) m1 = new Matrix4();
					m1.makeScale(x, y, z);
					this.applyMatrix(m1);
					return this;
				}
			}();

			this.lookAt = function() {
				var obj;
				return function lookAt(vector) {
					if(obj === undefined) obj = new Object3D();
					obj.lookAt(vector);
					obj.updateMatrix();
					this.applyMatrix(obj.matrix);
				}
			}();

			this.center = function() {
				this.computeBoundingBox();
				var offset = this.boundingBox.center().negate();
				this.translate(offset.x, offset.y, offset.z);
				return offset;
			}

			this.setFromObject = function(object) {
				var geometry = object.geometry;

				if ( object instanceof THREE.Points || object instanceof THREE.Line ) {

					var positions = new THREE.Float32Attribute( geometry.vertices.length * 3, 3 );
					var colors = new THREE.Float32Attribute( geometry.colors.length * 3, 3 );

					this.addAttribute( 'position', positions.copyVector3sArray( geometry.vertices ) );
					this.addAttribute( 'color', colors.copyColorsArray( geometry.colors ) );

					if ( geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length ) {

						var lineDistances = new THREE.Float32Attribute( geometry.lineDistances.length, 1 );

						this.addAttribute( 'lineDistance', lineDistances.copyArray( geometry.lineDistances ) );

					}

					if ( geometry.boundingSphere !== null ) {

						this.boundingSphere = geometry.boundingSphere.clone();

					}

					if ( geometry.boundingBox !== null ) {

						this.boundingBox = geometry.boundingBox.clone();

					}

				} else if ( object instanceof THREE.Mesh ) {

					if ( geometry instanceof THREE.Geometry ) {

						this.fromGeometry( geometry );

					}

				}

				return this;
			}

			this.updateFromObject = function(object) {
				var geometry = object.geometry;
				if(object instanceof Mesh) {
					 var direct = geometry.__directGeometry;
					 if(direct === undefined) {
					 	return this.fromGeometry( geometry );
					 }
				 	direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
					direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
					direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
					direct.uvsNeedUpdate = geometry.uvsNeedUpdate;
					direct.groupsNeedUpdate = geometry.groupsNeedUpdate;

					geometry.verticesNeedUpdate = false;
					geometry.normalsNeedUpdate = false;
					geometry.colorsNeedUpdate = false;
					geometry.uvsNeedUpdate = false;
					geometry.groupsNeedUpdate = false;

					geometry = direct;
				}
				if(geometry.verticesNeedUpdate === true) {
					var attribute = this.attributes.position;

					if ( attribute !== undefined ) {

						attribute.copyVector3sArray( geometry.vertices );
						attribute.needsUpdate = true;

					}

					geometry.verticesNeedUpdate = false;
				}
				if(geometry.normalsNeedUpdate === true) {
					var attribute = this.attributes.normal;

					if ( attribute !== undefined ) {

						attribute.copyVector3sArray( geometry.normals );
						attribute.needsUpdate = true;

					}

					geometry.normalsNeedUpdate = false;

				}
				if(geometry.colorsNeedUpdate === true) {
					var attribute = this.attributes.color;

					if ( attribute !== undefined ) {

						attribute.copyColorsArray( geometry.colors );
						attribute.needsUpdate = true;

					}

					geometry.colorsNeedUpdate = false;
				}
				if(geometry.uvsNeedUpdate) {
					var attribute = this.attributes.uv;

					if ( attribute !== undefined ) {

							attribute.copyVector2sArray( geometry.uvs );
							attribute.needsUpdate = true;

					}

					geometry.uvsNeedUpdate = false;
				}
				if ( geometry.lineDistancesNeedUpdate ) {

					var attribute = this.attributes.lineDistance;

					if ( attribute !== undefined ) {

						attribute.copyArray( geometry.lineDistances );
						attribute.needsUpdate = true;

					}

					geometry.lineDistancesNeedUpdate = false;

				}

				if ( geometry.groupsNeedUpdate ) {

					geometry.computeGroups( object.geometry );
					this.groups = geometry.groups;

					geometry.groupsNeedUpdate = false;

				}

				return this;
			} 

			this.fromGeometry = function(geometry) {
				geometry.__directGeometry = new THREE.DirectGeometry().fromGeometry( geometry );

				return this.fromDirectGeometry( geometry.__directGeometry );
			}

			this.fromDirectGeometry = function(geometry) {
				var positions = new Float32Array( geometry.vertices.length * 3 );
				this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).copyVector3sArray( geometry.vertices ) );

				if ( geometry.normals.length > 0 ) {

					var normals = new Float32Array( geometry.normals.length * 3 );
					this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ).copyVector3sArray( geometry.normals ) );

				}

				if ( geometry.colors.length > 0 ) {

					var colors = new Float32Array( geometry.colors.length * 3 );
					this.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).copyColorsArray( geometry.colors ) );

				}

				if ( geometry.uvs.length > 0 ) {

					var uvs = new Float32Array( geometry.uvs.length * 2 );
					this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ).copyVector2sArray( geometry.uvs ) );

				}

				if ( geometry.uvs2.length > 0 ) {

					var uvs2 = new Float32Array( geometry.uvs2.length * 2 );
					this.addAttribute( 'uv2', new THREE.BufferAttribute( uvs2, 2 ).copyVector2sArray( geometry.uvs2 ) );

				}

				if ( geometry.indices.length > 0 ) {

					var TypeArray = geometry.vertices.length > 65535 ? Uint32Array : Uint16Array;
					var indices = new TypeArray( geometry.indices.length * 3 );
					this.setIndex( new THREE.BufferAttribute( indices, 1 ).copyIndicesArray( geometry.indices ) );

				}

				// groups

				this.groups = geometry.groups;

				// morphs

				for ( var name in geometry.morphTargets ) {

					var array = [];
					var morphTargets = geometry.morphTargets[ name ];

					for ( var i = 0, l = morphTargets.length; i < l; i ++ ) {

						var morphTarget = morphTargets[ i ];

						var attribute = new THREE.Float32Attribute( morphTarget.length * 3, 3 );

						array.push( attribute.copyVector3sArray( morphTarget ) );

					}

					this.morphAttributes[ name ] = array;

				}

				// skinning

				if ( geometry.skinIndices.length > 0 ) {

					var skinIndices = new THREE.Float32Attribute( geometry.skinIndices.length * 4, 4 );
					this.addAttribute( 'skinIndex', skinIndices.copyVector4sArray( geometry.skinIndices ) );

				}

				if ( geometry.skinWeights.length > 0 ) {

					var skinWeights = new THREE.Float32Attribute( geometry.skinWeights.length * 4, 4 );
					this.addAttribute( 'skinWeight', skinWeights.copyVector4sArray( geometry.skinWeights ) );

				}

				//

				if ( geometry.boundingSphere !== null ) {

					this.boundingSphere = geometry.boundingSphere.clone();

				}

				if ( geometry.boundingBox !== null ) {

					this.boundingBox = geometry.boundingBox.clone();

				}

				return this;
			}

			this.computeBoundingBox = function() {
				var vector = new Vector3();
				return function() {
					if(this.boundingBox === null) {
						 this.boundingBox = new Box3();
					}
					var positions = this.attributes.position.array;
					if(positions) {
						var bb = this.boundingBox;
						bb.makeEmpty();
						for ( var i = 0, il = positions.length; i < il; i += 3 ) {

							vector.fromArray( positions, i );
							bb.expandByPoint( vector );

						}
					}
					if(positions === undefined || positions.length === 0) {
						this.boundingBox.min.set( 0, 0, 0 );
						this.boundingBox.max.set( 0, 0, 0 );
					}

					if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

						console.error( 'THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

					}
				}
			}();

			this.computeBoundingSphere = function() {
				var box = new Box3();
				var vector = new Vector3();

				return function () {

					if ( this.boundingSphere === null ) {

						this.boundingSphere = new Sphere();

					}

					var positions = this.attributes.position.array;

					if ( positions ) {

						box.makeEmpty();

						var center = this.boundingSphere.center;

						for ( var i = 0, il = positions.length; i < il; i += 3 ) {

							vector.fromArray( positions, i );
							box.expandByPoint( vector );

						}

						box.center( center );

						// hoping to find a boundingSphere with a radius smaller than the
						// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

						var maxRadiusSq = 0;

						for ( var i = 0, il = positions.length; i < il; i += 3 ) {

							vector.fromArray( positions, i );
							maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

						}

						this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

						if ( isNaN( this.boundingSphere.radius ) ) {

							console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

						}

					}

				};
			}();
			/*
			this.computeFaceNormals = function() {
				// backwards compatibility
			}
			*/
			this.computeVertexNormals = function() {
				var index = this.index;
				var attributes = this.attributes;
				var groups = this.groups;

				if ( attributes.position ) {

					var positions = attributes.position.array;

					if ( attributes.normal === undefined ) {

						this.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( positions.length ), 3 ) );

					} else {

						// reset existing normals to zero

						var normals = attributes.normal.array;

						for ( var i = 0, il = normals.length; i < il; i ++ ) {

							normals[ i ] = 0;

						}

					}

					var normals = attributes.normal.array;

					var vA, vB, vC,

					pA = new THREE.Vector3(),
					pB = new THREE.Vector3(),
					pC = new THREE.Vector3(),

					cb = new THREE.Vector3(),
					ab = new THREE.Vector3();

					// indexed elements

					if ( index ) {

						var indices = index.array;

						if ( groups.length === 0 ) {

							this.addGroup( 0, indices.length );

						}

						for ( var j = 0, jl = groups.length; j < jl; ++ j ) {

							var group = groups[ j ];

							var start = group.start;
							var count = group.count;

							for ( var i = start, il = start + count; i < il; i += 3 ) {

								vA = indices[ i + 0 ] * 3;
								vB = indices[ i + 1 ] * 3;
								vC = indices[ i + 2 ] * 3;

								pA.fromArray( positions, vA );
								pB.fromArray( positions, vB );
								pC.fromArray( positions, vC );

								cb.subVectors( pC, pB );
								ab.subVectors( pA, pB );
								cb.cross( ab );

								normals[ vA ] += cb.x;
								normals[ vA + 1 ] += cb.y;
								normals[ vA + 2 ] += cb.z;

								normals[ vB ] += cb.x;
								normals[ vB + 1 ] += cb.y;
								normals[ vB + 2 ] += cb.z;

								normals[ vC ] += cb.x;
								normals[ vC + 1 ] += cb.y;
								normals[ vC + 2 ] += cb.z;

							}

						}

					} else {

						// non-indexed elements (unconnected triangle soup)

						for ( var i = 0, il = positions.length; i < il; i += 9 ) {

							pA.fromArray( positions, i );
							pB.fromArray( positions, i + 3 );
							pC.fromArray( positions, i + 6 );

							cb.subVectors( pC, pB );
							ab.subVectors( pA, pB );
							cb.cross( ab );

							normals[ i ] = cb.x;
							normals[ i + 1 ] = cb.y;
							normals[ i + 2 ] = cb.z;

							normals[ i + 3 ] = cb.x;
							normals[ i + 4 ] = cb.y;
							normals[ i + 5 ] = cb.z;

							normals[ i + 6 ] = cb.x;
							normals[ i + 7 ] = cb.y;
							normals[ i + 8 ] = cb.z;

						}

					}

					this.normalizeNormals();

					attributes.normal.needsUpdate = true;

				}

			}

			this.merge = function(geometry, offset) {
				if ( geometry instanceof THREE.BufferGeometry === false ) {

					console.error( 'THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry );
					return;

				}

				if ( offset === undefined ) offset = 0;

				var attributes = this.attributes;

				for ( var key in attributes ) {

					if ( geometry.attributes[ key ] === undefined ) continue;

					var attribute1 = attributes[ key ];
					var attributeArray1 = attribute1.array;

					var attribute2 = geometry.attributes[ key ];
					var attributeArray2 = attribute2.array;

					var attributeSize = attribute2.itemSize;

					for ( var i = 0, j = attributeSize * offset; i < attributeArray2.length; i ++, j ++ ) {

						attributeArray1[ j ] = attributeArray2[ i ];

					}

				}

				return this;
			}

			this.normalizeNormals = function () {

				var normals = this.attributes.normal.array;

				var x, y, z, n;

				for ( var i = 0, il = normals.length; i < il; i += 3 ) {

					x = normals[ i ];
					y = normals[ i + 1 ];
					z = normals[ i + 2 ];

					n = 1.0 / Math.sqrt( x * x + y * y + z * z );

					normals[ i ] *= n;
					normals[ i + 1 ] *= n;
					normals[ i + 2 ] *= n;

				}

			}

			this.toJSON = function () {

				var data = {
					metadata: {
						version: 4.4,
						type: 'BufferGeometry',
						generator: 'BufferGeometry.toJSON'
					}
				};

				// standard BufferGeometry serialization

				data.uuid = this.uuid;
				data.type = this.type;
				if ( this.name !== '' ) data.name = this.name;

				if ( this.parameters !== undefined ) {

					var parameters = this.parameters;

					for ( var key in parameters ) {

						if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

					}

					return data;

				}

				data.data = { attributes: {} };

				var index = this.index;

				if ( index !== null ) {

					var array = Array.prototype.slice.call( index.array );

					data.data.index = {
						type: index.array.constructor.name,
						array: array
					};

				}

				var attributes = this.attributes;

				for ( var key in attributes ) {

					var attribute = attributes[ key ];

					var array = Array.prototype.slice.call( attribute.array );

					data.data.attributes[ key ] = {
						itemSize: attribute.itemSize,
						type: attribute.array.constructor.name,
						array: array
					};

				}

				var groups = this.groups;

				if ( groups.length > 0 ) {

					data.data.groups = JSON.parse( JSON.stringify( groups ) );

				}

				var boundingSphere = this.boundingSphere;

				if ( boundingSphere !== null ) {

					data.data.boundingSphere = {
						center: boundingSphere.center.toArray(),
						radius: boundingSphere.radius
					};

				}

				return data;

			}

			this.clone = function() {
				return new this.constructor().copy( this );
			}

			this.copy = function ( source ) {

				var index = source.index;

				if ( index !== null ) {

					this.setIndex( index.clone() );

				}

				var attributes = source.attributes;

				for ( var name in attributes ) {

					var attribute = attributes[ name ];
					this.addAttribute( name, attribute.clone() );

				}

				var groups = source.groups;

				for ( var i = 0, l = groups.length; i < l; i ++ ) {

					var group = groups[ i ];
					this.addGroup( group.start, group.count );

				}

				return this;

			}

			this.dispose = function () {

				this.dispatchEvent( { type: 'dispose' } );

			}
 		}).call(BufferGeometry.prototype);
 		module.exports = BufferGeometry;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
