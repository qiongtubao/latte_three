(function(define) {'use strict'
	define("latte_three/renderer/webgl/webglPrograms", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		var WebgGLPrograms = function(renderer, capabilities) {
 			var programs = [];
 			var shaderIDs = {
 				MeshDepthMaterial: 'depth',
				MeshNormalMaterial: 'normal',
				MeshBasicMaterial: 'basic',
				MeshLambertMaterial: 'lambert',
				MeshPhongMaterial: 'phong',
				LineBasicMaterial: 'basic',
				LineDashedMaterial: 'dashed',
				PointsMaterial: 'points'
 			};
 			var parameterNames = [
 				"precision", "supportsVertexTextures", "map", "envMap", "envMapMode",
				"lightMap", "aoMap", "emissiveMap", "bumpMap", "normalMap", "displacementMap", "specularMap",
				"alphaMap", "combine", "vertexColors", "fog", "useFog", "fogExp",
				"flatShading", "sizeAttenuation", "logarithmicDepthBuffer", "skinning",
				"maxBones", "useVertexTexture", "morphTargets", "morphNormals",
				"maxMorphTargets", "maxMorphNormals", "maxDirLights", "maxPointLights",
				"maxSpotLights", "maxHemiLights", "maxShadows", "shadowMapEnabled", "pointLightShadows",
				"shadowMapType", "shadowMapDebug", "alphaTest", "metal", "doubleSided",
				"flipSided"
 			];

 			function allocateBones(object) {
 				if(capabilities.floatVertexTextures && object.skeleton && object.skeleton.useVertexTexture) {
 					return 1024;
 				}else {
 					var nVertexUniforms = capabilities.maxVertexUniforms;
 					var nVertexMatrices = Math.floor((nVertexUniforms - 20) / 4 );
 					var maxBones = nVertexMatrices;
 					if(object !== undefined && object instanceof SkinnedMesh) {
 						maxBones = Math.min(object.skeleton.bones.length)
 						if ( maxBones < object.skeleton.bones.length ) {
 							console.warn("WebGLRenderer: too many bones - "+ object.skeleton.bones.length + ', this GPU supports just ' + maxBones + ' (try OpenGL instead of ANGLE)' );
 						}
 					}
 					return maxBones;
 				}
 			}

 			/**
 			 * 统计lights
 			 * @method  allocateLights
 			 * @private
 			 * @param  {Array[Light]} lights [description]
 			 * @return {directional:Int, point:Int, spot: Int, hemi: Int }        [description]
 			 */
 			function allocateLights(lights) {
 				var dirLights = 0;
 				var pointLights = 0;
 				var spotLights = 0;
 				var hemiLights = 0;
 				for(var l = 0, ll = lights.length; l < ll; l++) {
 					var light = ligths[l];
 					if(light.visible === false) continue;
 					if(light instanceof DirectionalLight) dirLights++;
 					if(light instanceof PointLight) pointLights++;
 					if(light instanceof SpotLight) spotLights++;
 					if(light instanceof HemisphereLight) hemiLights++;
 				}
 				return {"directional": dirLights, "point": pointLights, "spot": spotLights, "hemi": hemiLights};
 			}

 			/**
 			 * @method getParameters
 			 * @param  {[type]} material [description]
 			 * @param  {Array[Light]} lights   [description]
 			 * @param  {[type]} fog      [description]
 			 * @param  {[type]} object   [description]
 			 * @return {[type]}          [description]
 			 */
 			this.getParameters = function(material, lights, fog, object) {
 				var shaderID = shaderIDs[material.type];
 				var maxLightCount = allocateLights(lights);
 				var maxBones = allocateBones(object);
 				var precision = renderer.getPrecision();
 				if(material.precision !== null) {
 					precision = capabilities.getMaxPrecision(material.precision);
 					if(precision !== material.precision) {
 						console.warn('THREE.WebGLRenderer.initMaterial:', material.precision, 'not supported, using', precision, 'instead.' );
 					}
 				}
 				var parameters = {
 					shaderID: shaderID,
 					precision: precision,
 					supportsVertexTextures: capabilities.vertexTextures,
 					map: !!material.map,
 					envMap: !!material.envMap,
 					envMapMode: material.envMap && material.envMap.mapping,
 					lightMap: !!material.lightMap,
 					aoMap: !!material.aoMap,
 					emissiveMap: !!material.emissiveMap,
 					bumpMap: !!material.bumpMap,
 					normalMap: !!material.normalMap,
 					displacementMap: !!material.displacementMap,
 					specularMap: !!material.specularMap,
 					alphaMap: !!material.alphaMap,
 					combine: material.combine,
 					vertexColors: material.vertexColors,
 					fog: fog,
 					useFog: useFog,
 					fogExp: fogExp,
 					flatShading: fog instanceof FogExp2,
 					flatShading: material.shading === FlatShading,
 					sizeAttenuation: material.sizeAttenuation,
 					logarithmicDepthBuffer: capabilities.logarithmicDepthBuffer,
 					skinning: material.skinning,
 					maxBones: maxBones,
 					useVertexTexture: capabilities.floatVertexTextures && object && object.skeleton && object.skeleton.useVertexTexture,

					morphTargets: material.morphTargets,
					morphNormals: material.morphNormals,
					maxMorphTargets: renderer.maxMorphTargets,
					maxMorphNormals: renderer.maxMorphNormals,

					maxDirLights: maxLightCount.directional,
					maxPointLights: maxLightCount.point,
					maxSpotLights: maxLightCount.spot,
					maxHemiLights: maxLightCount.hemi,

					maxShadows: allocatedShadows.maxShadows,
					pointLightShadows: allocatedShadows.pointLightShadows,
					shadowMapEnabled: renderer.shadowMap.enabled && object.receiveShadow && allocatedShadows.maxShadows > 0,
					shadowMapType: renderer.shadowMap.type,
					shadowMapDebug: renderer.shadowMap.debug,

					alphaTest: material.alphaTest,
					metal: material.metal,
					doubleSided: material.side === THREE.DoubleSide,
					flipSided: material.side === THREE.BackSide
 				};
 				return parameters;
 			}

 			this.getProgramCode = function(material, parameters) {
 				var chunks = [];
 				if(parameters.shaderID) {
 					chunks.push(parameters.shaderID);
 				}else{
 					chunks.push(material.fragmentShader);
 					chunks.push(material.vertexShader);
 				}

 				if(material.defines !== undefined) {
 					for(var name in material.defines) {
 						chunks.push(name);
 						chunks.push(material.defines[name]);
 					}
 				}
 				for(var i = 0; i < parameterNames.length; i++) {
 					var parameterName = parameterNames[i];
 					chunks.push(parameterName);
 					chunks.push(parameters[parameterName]);
 				}
 				return chunks.join();
 			}
 			this.acquireProgram = function(material, parameters, code) {
 				var program;
 				for(var p = 0, pl = programs.length; p < pl; p++) {
 					var programInfo = programs[p];
 					if(programInfo.code === code) {
 						program = programInfo;
 						++program.usedTimes;
 						break;
 					}
 				}
 				if(program === undefined) {
 					program = new WebgGLProgram(renderer, code, material, parameters);
 					programs.push(program);
 				}
 				return program;
 			};

 			this.releaseProgram = function(program) {
 				if(--program.usedTimes === 0) {
 					var i = programs.indexOf(program);
 					programs[i] = programs[programs.length - 1];
 					programs.pop();
 					program.destroy();
 				}
 			}
 			this.programs = programs;

 		};
 		module.exports = WebgGLPrograms;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
