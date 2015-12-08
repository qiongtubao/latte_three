(function(define) {'use strict'
	define("latte_three/renderer/webgl/webglObjects", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		var WebGLGeometries = require("./webglGeometries");
 		var WebGLObjects = function(gl, properties, info) {
 			var geometries = new WebGLGeometries(gl, properties, info);
 			function update(object) {
 				var geometry = geometries.get(object);
 				if(object.geometry instanceof Geometry) {
 					geometry.updateFromObject(object);
 				}
 				var index = geometry.index;
 				var attributes = geometry.attributes;
 				if(index !== null) {
 					updateAttribute(index, gl.ELEMENT_ARRAY_BUFFER);
 				}
 				for(var name in attributes) {
 					updateAttribute(attributes[name], gl.ARRAY_BUFFER);
 				}
 				var morphAttributes = geometry.morphAttributes;
 				for(var name in morphAttributes) {
 					var array = morphAttributes[name];
 					for(var i = 0, l =array.length; i < l; i++) {
 						updateAttribute(array[i], gl.ARRAY_BUFFER);
 					}
 				}
 				return geometry;
; 			}
			
			function updateAttribute(attribute, bufferType) {
				var data = (attribute instanceof InterleavedBufferAttribute) ? attribute.data: attribute;
				var attributeProperties = properties.get(data);
				if(attributeProperties.__webglBuffer === undefined) {
					createBuffer(attributeProperties, data, bufferType);
				}else if(attributeProperties.version !== data.version) {
					updateBuffer(attributeProperties, data, bufferType);
				}
			}

			function createBuffer(attributeProperties, data, bufferType) {
				attributeProperties.__webglBuffer = gl.createBuffer();
				gl.bindBuffer(bufferType, attributeProperties.__webglBuffer);
				if(data.dynamic === false || data.updateRange.count === -1) {
					gl.bufferSubData(bufferType, 0, data.array);
				}else if(data.updateRange.count  === 0) {
					console.error( 'THREE.WebGLObjects.updateBuffer: dynamic THREE.BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.' );
				}else{
					gl.bufferSubData( bufferType, data.updateRange.offset * data.array.BYTES_PER_ELEMENT,
							  data.array.subarray( data.updateRange.offset, data.updateRange.offset + data.updateRange.count ) );

					data.updateRange.count = 0;
				}
				attributeProperties.version = data.version;
			}

			function getAttributeBuffer(attribute) {
				if(attribute instanceof InterleavedBufferAttribute) {
					return properties.get(attribute.data).__webglBuffer;
				}
				return properties.get(attribute).__webglBuffer;
			}
			function getWireframeAttribute(geometry) {
				var property = properties.get(geometry);
				if(property.wireframe !== undefined) {
					return property.wireframe;
				}
				var indices = [];
				var index = geometry.index;
				var attributes = geometry.attributes;
				var position = attributes.position;
				if(index !== null) {
					var deges = {};
					var array = index.array;
					for(var i = 0, l = array.length; i < l; i+= 3) {
						var a = array[i + 0];
						var b = array[i + 1];
						var c = array[i + 2];
						if(checkEdge(edges, a, b)) indices.push(a, b);
						if(checkEdge(edges, b, c)) indices.push(b, c);
						if(checkEdge(edges, c, a)) indices.push(c, a);
					}
				}else{
					var array = attributes.position.array;
					for(var i = 0, l = (array.length / 3) - 1 ; i < l; i += 3) {
						var a = i + 0;
						var b = i + 1;
						var c = i + 2;
						indices.push(a, b, b, c, c, a);
					}
				}
				var TypeArray = position.count > 65535 ? Uint32Array: Uint16Array;
				var attribute = new BufferAttribute(new TypeArray(indices), 1);
				updateAttribute(attribute, gl.ELEMENT_ARRAY_BUFFER);
				property.wireframe = attribute;
				return attribute;
			}

			function checkEdge(edges, a, b) {
				if(a > b) {
					var tmp = a;
					a = b;
					b = tmp;
				}
				var list =edges[a];
				if(list === undefined) {
					edges[a] = [b];
					return true;
				}else if(list.indexOf(b) === -1) {
					list.push(b);
					return true;
				}
				return false;
			}
			this.getAttributeBuffer = getAttributeBuffer;
			this.getWireframeAttribute = getWireframeAttribute;
			this.update = update;
 		};
 		module.exports = WebGLObjects;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
