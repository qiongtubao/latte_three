(function(define) {'use strict'
	define("latte_three/core/object3D", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
      /**
          @module core
       */
       /**
        @class Object3D
        */
      var mMath = require("../math/math")
        , Vector3 = require("../math/vector3")
        , Euler = require("../math/euler")
        , Quaternion = require("../math/quaternion")
				, Matrix4 = require("../math/matrix4")
				, Matrix3 = require("../math/matrix3")
				, Channels = require("./channels");
      var Object3D = function() {
         Object.defineProperty(this, "id", {
           value: Object3D.Object3DIdCount++
         });
         this.uuid = mMath.generateUUID();
         this.name = "";
         this.type = "Object3D";
         this.parent = null;
         this.channels = new Channels();
         this.children = [];
         this.up = Object3D.DefaultUp.clone();
         var position = new Vector3();
         var rotation = new Euler();
         var quaternion = new Quaternion();
         var scale = new Vector3(1,1,1);
         function onRotationChange() {
            quaternion.setFromEuler(rotation, false);
         }
         function onQuaternionChange() {
           rotation.setFromQuaternion(quaternion, undefined, false);
         }
         rotation.onChange(onRotationChange);
         quaternion.onChange(onQuaternionChange);
         Object.defineProperties(this, {
            position: {
              enumerable: true,
              value: position
            },
            rotation: {
                enumerable: true,
                value: rotation
            },
            quaternion: {
              enumerable: true,
              value: quaternion
            },
            scale: {
              enumerable: true,
              value: scale
            },
            modelViewMatrix: {
              value: new Matrix4()
            },
            normalMatrix: {
              value: new Matrix3()
            }
         });
         this.rotationAutoUpdate = true;
         this.matrix = new Matrix4();
         this.matrixWorld = new Matrix4();
         this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
         this.mmatrixWorldNeedsUpdate =false;
         this.visible = true;
      };
      (function() {

         Object.defineProperty(this, 'eulerOrder', {
          get: function() {
              return this.rotation.order;
          },
          set: function(value) {
            this.rotation.order = newValue;
          },
          enumerable: true,
          configurable: true
        });

         Object.defineProperty(this, 'useQuaternion', {
          get: function() {
              console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );
          },
          set: function(value) {
              console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );
          },
          enumerable: true,
          configurable: true
        });
         Object.defineProperty(this, "renderDepth", {
            set: function(value) {
                console.warn( 'THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.' );
            },
            enumerable: true,
            configurable: true
         });

         this.applyMatrix = function(matrix) {
            this.matrix.multiplyMatrices(matrix, this.matrix);
            this.matrix.decompose(this.position, this.quaternion, this.scale);
         }

         this.setRotationFromAxisAngle = function(axis, angle) {
            this.quaternion.setFromAxisAngle(axis, angle);
         }

         this.setRotationFromEuler = function(euler) {
            this.quaternion.setFromEuler(euler, true);
         }

          this.setRotationFromMatrix = function(m) {
              this.quaternion.setFromRotationMatrix(m);
          }

          this.setRotationFromQuaternion = function(q) {
              this.quaternion.copy(q);
          }

          this.rotateOnAxis = (function() {
              var q1 = new Quaternion();
              return function(axis, angle) {
                q1.setFromAxisAngle(axis, angle);
                this.quaternion,multiply(q1);
                return this;
              };
          })();

          this.rotateX = (function() {
              var v1 = new Vector3(1, 0, 0);
              return function(angle) {
                  return this.rotateOnAxis(v1, angle);
              };
          })();

          this.rotateY = (function() {
              var v1 = new Vector3(0, 1, 0);
              return function(angle) {
                  return this.rotateOnAxis(v1, angle);
              };
          })();

          this.rotateZ = function() {
              var v1 = new Vector3(0, 0, 1);
              return function(angle) {
                  return this.rotateOnAxis(v1, angle);
              }
          }

          this.translateOnAxis = function() {
              var v1 = new Vector3();
              return function(axis, distance) {
                  v1.copy(axis).applyQuaternion(this.quaternion);
                  this.position.add(v1.multiplyScalar(distance));
                  return this;
              };
          }

          this.translate = function(distance, axis) {
              console.warn( 'THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.' );
              return this.translateOnAxis( axis, distance );
          }

          this.translateX = function() {
              var v1 = new Vector3(1, 0, 0);
              return function(distance) {
                  return this.translateOnAxis(v1, distance);
              }
          }

          this.translateY = function() {
              var v1 = new Vector3(0, 1, 0);
              return function(distance) {
                  return this.translateOnAxis(v1, distance);
              }
          }

          this.translateZ = function() {
              var v1 = new Vector3(0, 0, 1);
              return function(distance) {
                  return this.translateOnAxis(v1, distance);
              }
          }

          this.localToWorld = function() {
              return vector.applyMatrix4(this.matrixWorld);
          }

          this.worldToLocal = (function() {
              var m1 = new Matrix4();
              return function(vector) {
                  return vector.applyMatrix4(m1.getInverse(this.matrixWorld));
              }
          })();

          this.lookAt = function() {
              var m1 = new Matrix4();
              return function(vector) {
                  m1.lookAt(vector, this.position, this.up);
                  this.quaternion.setFromRotationMatrix(m1);
              };
          }

          this.add = function(object) {
              if(arguments.length > 1) {
                  for(var i = 0; i < arguments.length ; i++) {
                     this.add(arguments[i]);
                  }
                  return this;
              }
              if(object === this) {
                  console.error( "THREE.Object3D.add: object can't be added as a child of itself.", object );
                  return this;
              }
              if(object instanceof Object3D) {
                  if(object.parent !== null) {
                    object.parent.remove(object);
                  }
                  object.parent = this;
                  object.dispatchEvent({ type: "added" });
                  this.children.push(object);
              } else {
                  console.error( "THREE.Object3D.add: object not an instance of THREE.Object3D.", object );
              }
              return this;
          }

          this.remove = function(object) {
              if(arguments.length > 1) {
                 for(var i = 0; i < arguments.length ; i++ ) {
                    this.remove(arguments[i]);
                 }
              }
              var index = this.children.indexOf(object);
              if(index !== -1) {
                  object.parent = null;
                  object.dispatchEvent({type: "removed"});
                  this.children.splice(index, 1);
              }
          }

          this.getChildByName = function(name) {
              console.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName().");
              return this.getObjectByName(name);
          }

          this.getObjectById = function(id) {
             return this.getObjectByProperty("id", id);
          }

          this.getObjectByProperty = function(name, value) {
              if(this[name] === value ) return this;
              for(var i = 0, l = this.children.length; i < l; i++) {
                var child = this.children[i];
                var object = child.getObjectByProperty(name, value);
                if(object !== undefined) {
                    return object;
                }
              }
              return undefined;
          }

          this.getWorldPosition = function(optionalTarget) {
              var result = optionalTarget || new Vector3();
              this.updateMatrixWorld(true);
              return result.setFromMatrixPosition(this.matrixWorld);
          }

          this.getWorldQuaternion = (function() {
              var position = new Vector3();
              var scale = new Vector3();
              return function(optionalTarget) {
                var result = optionalTarget || new Quaternion();
                this.updateMatrixWorld(true);
                this.matrixWorld.decompose(position, result, scale);
                return result;
              };
          })();

          this.getWorldRotation = (function() {
            var quaternion = new Quaternion();
            return function(optionalTarget) {
                var result = optionalTarget || new Euler();
                this.getWorldQuaternion(quaternion);
                return result.setFromQuaternion(quaternion, this.rotation.order, false);
            }
          })();

          this.getWorldScale = (function() {
            var position = new Vector3();
            var quaternion = new Quaternion();
            return function(optionalTarget) {
                var result = optionalTarget || new Vector3();
                this.getWorldQuaternion(quaternion);
                return result.set(0,0,1).applyQuaternion(quaternion);
            };
          })();

          this.raycast = function() {

          }

          this.traverse = function(callback) {
            callback(this);
            var children = this.children;
            for(var i = 0, l = children.length ; i < l; i++) {
                children[i].traverse(callback);
            }
          }

          this.traverseVisible = function(callback) {
            if(this.visible === false) {
              return;
            }
            callback(this);
            var children = this.children;
            for(var i = 0, l = children.length; i < l ; i++) {
                children[i].traverseVisible(callback);
            }
          }

          this.traverseAncestors = function(callback) {
            var parent = this.parent;
            if(parent !== null) {
                callback(parent);
                parent.traverseAncestors(callback);
            }
          }

          this.updateMatrix = function() {
            this.matrix.compose(this.position, this.quaternion, this.scale);
            this.matrixWorldNeedsUpdate = true;
          }

          this.updateMatrixWorld = function(force) {
            if(this.matrixAutoUpdate === true) {
              this.updateMatrix();
            }
            if(this.matrixWorldNeedsUpdate === true || force === true) {
              if(this.parent === null) {
                  this.matrixWorld.copy(this.matrix);
              }else{
                  this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
              }
              this.matrixWorldNeedsUpdate = false;
              force = true;
            }
            for(var i = 0, l = this.children.length; i < l; i++) {
              this.children[i].updateMatrixWorld(force);
            }
          }
          this.toJSON = function(meta) {
             var isRootObject = (meta === undefined);
             var output = {};
             if(isRootObject) {
               meta = {
                  geometries: {},
                  materials: {},
                  textures: {},
                  images: {}
               };
               output.metadata = {
                  version: 4.4,
                  type: "Object",
                  generator: "Object3D.toJSON"
               };
             }

             var object = {};
             object.uuid = this.uuid;
             object.type = this.type;
             if(this.name !== "") object.name = this.name;
             if(JSON.stringify(this.userData) !== "{}" ) object.userData = this.userData;
             if(this.castShadow === true) object.castShadow = true;
             if(this.receiveShadow === true) object.visible = false;

             object.matrix = this.matrix.toArray();

             if(this.geometry !== undefined) {
                if(meta.geometries[this.geometry.uuid] === undefined) {
                  meta.geometries[this.geometry.uuid] = this.geometry.toJSON(meta);
                }
                object.geometry = this.geometry.uuid;
             }

             if(this.material !== undefined) {
                if(meta.materials[this.material.uuid] === undefined) {
                  meta.materials[this.material.uuid] = this.material.toJSON(meta);
                }
                object.material = this.material.uuid;
             }

             if(this.children.length > 0) {
                object.children = [];
                for(var i = 0; i < this.children.length; i++) {
                   object.children.push(this.children[i].toJSON(meta).object);
                }
             }

             if(isRootObject) {
               var geometries = extractFromCache(meta.geometries);
               var materials = extractFromCache(meta.geometries);
               var textures = extractFromCache(meta.textures);
               var images = extractFromCache(meta.images);

               if(geometries.length > 0) { output.geometries =  geometries; }
               if(materials.length > 0) { output.materials = materials; }
               if(textures.length > 0) { output.textures = textures; }
               if(images.length > 0) { output.images = images; }
             }

             output.object = object;
             return output;

              function extractFromCache(cache) {
                var values = [];
                for(var key in cache) {
                  var data = cache[key];
                  delete data.metadata;
                  values.push(data);
                }
                return values;
              }
          }

          this.clone = function(recursive) {
              return new this.constructor().copy(this, recursive);
          }

          this.copy = function(source, recursive) {
              if(recursive === undefined) recursive = true;
              this.name = source.name;
              this.up.copy(source.up);
              this.position.copy(source.position);
              this.quaternion.copy(source.quaternion);
              this.scale.copy(source.scale);

              this.rotationAutoUpdate = source.rotationAutoUpdate;

              this.matrix.copy(source.matrix);
              this.matrixWorld.copy(source.matrix);
              this.matrixAutoUpdate = source.matrixAutoUpdate;

              this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

              this.visible = source.visible;
              this.castShadow = source.castShadow;
              this.receiveShadow = source.receiveShadow;

              this.frustumCulled = source.frustumCulled;
              this.renderOrder = source.renderOrder;

              this.userData = JSON.parse(JSON.stringify(source.userData));

              if(recursive === true) {
                  for(var i = 0; i < source.children.length; i++) {
                      var child = source.children[i];
                      this.add(child.clone());
                  }
              }
              return this;
          }
      }).call(Object3D.prototype);
      (function() {
          this.Object3DIdCount = 0;
          this.DefaultUp = new Vector3(0,1,0);
          this.DefaultMatrixAutoUpdate = true;
      }).call(Object3D);
      module.exports = Object3D

  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
