(function(define) {'use strict'
	define("latte_three/renderers/webGLRenderer", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
		/**
			@module renderers
			@namespace webGLRenderer
		*/
 		var defaultConfig = {};
 		(function() {
 			this.context = null;
 			this.pixelRatio = 1;
 			this.precision = "highp";
 			this.alpha = false;
 			this.depth = true;
 			this.stencil = true;
 			this.antialias = false;
 			this.premultipliedAlpha = true;
 			this.preserveDrawingBuffer = false;
 			this.logarithmicDepthBuffer = false;
			this.clearColor = new Color(0x000000);
 			this.clearAlpha = 0;
			this.morphInfluences = new Float32Array(8);
 		}).call(defaultConfig);
		/**
			@class WebGLRenderer
			@param opts {Object}
		*/
 		var WebGLRenderer = function(opts) {
 			opts =  latte_lib.marge(defaultConfig, opts);
 			var canvas = opts.canvas = opts.canvas || document.createElement("canvas");
			opts.width = canvas.width;
			opts.height = canvas.height;

 			var lights = [];
 			var webglObjects = [];
 			var webglObjectsImmediate = [];
 			var opaqueObjects = [];
 			var transparentObjects = [];
 			var sprites = [];
 			var lensFlares  =[];
 			this.domElement  = opts.canvas;

			//clearing
 			this.context = null;

 			this.autoClear = true;
 			this.autoClearColor = true;
			this.autoClearDepth = true;
 			this.autoClearStencil = true;

			//scene graph
			this.sortObjects = true;

			//physically based shading
			this.gammaFactor = 2.0;
			this.gammaInput = false;
			this.gammaOutput = false;

			//morphs
			this.maxMorphTargets = 8;
			this.maxMorphNNormals = 4;

			//flags
			this.autoScaleCubemaps = true;

			//internal state cache
			var _this = this;

			_currentProgram = null;
			_currentFrameBuffer = null;
			_currentMaterialId = -1;
			_currentCamera = null;
			_usedTextCamera = null;

			_viewportX = 0;
			_viewportY = 0;

			_viewportWidth = canvas.width;
			_viewportHeihgt = canvas.height;
			_currentWidth = 0;
			_currentHeight = 0;

			_frustum = new Frustum();

			_projScreenMatrix = new Matrix4();
			_vector3 = new Vector3();
			_direction = new Vector3();

			_lightNeedUpdate = true;
			_lights = {
					ambient: [0,0,0],
					directional: { length: 0, colors: [], positions: [] },
					point: { length: 0, colors: [], distances: [], decays: []},
					spot: {length : 0, colors: [], positions: [], distances: [], directions: [], anglesCos: [], exponents: [], decays: [] },
					hemi: {length: 0, skyColors: [], groundColors: [], positions: []}
			};

			_infoMemory = {
				geometries: 0,
				textures: 0
			};
			_infoRender = {
				calls: 0,
				vertices: 0,
				faces: 0,
				points: 0
			};

			this.info = {
				render: _infoRender,
				memory: _infoMemory,
				programs : null
			};

			var _gl;
			try {
				var attributes = {
					alpha: opts.alpha,
					depth: opts.depth,
					stencil: opts.stencil,
					antialias: opts.antialias,
					preserveDrawingBuffer: opts.preserveDrawingBuffer
				};
				_gl = _context || canvas.getContext("webgl", attributes ) || canvas.getContext( 'experimental-webgl', attributes );
				if(_gl === null) {
					if(canvas.getContext("webgl") !== null) {
							throw "Error creating WebGL context with your selected attributes.";
					}else{
							throw "Error creating WebGL context.";
					}
				}
				canvas.addEventListener("webglcontextlost", onContextLost, false);
			}catch(error) {
				console.error("three.webglRenderer: "+ erorr);
			}
			var extensions = new WebGLExtensions(_gl);
			extensions.get("OES_texture_float");
			extensions.get("OES_texture_float_linear");
			extensions.get("OES_texture_half_float");
			extensions.get("OES_texture_half_float_linear");
			extensions.get("OES_standard_derivatives");
			extensions.get("ANGLE_instanced_arrays");

			if(extensions.get("OES_element_index_uint")) {
				this.BufferGeometry.MaxIndex = 4294967296;
			}

			var capabilities = new WebGLCapabilities(_gl, extensions, parameters);
			var state = new WebGLState( _gl, extensions, paramThreeToGL);
			var properties = new WebGLProperties();
			var objects = new WebGLObjects(_gl, properties, this.info);
			var programCache = new WebGLPrograms(this, capailities);
			this.info.programs = programCache.programs;
			var bufferRenderer = new WebGLBufferRenderer(_gl, extensions, _infoRender);
			var indexedBufferRenderer = new WebGLIndexedBufferRenderer(_gl, extensions, _infoRender);




			setDefaultGLState();
			this.context = _gl;
			this.capailities = capailities;
			this.extensions = extensions;
			this.state = state;

			var shadowMap = new WebGLShaowMap(this, lights, objects);
			this.shadowMap = shadowMap;

			var spritePlugin = new SpritePlugin(this, sprites);
			var lensFlarePlugin = new LensFlarePlugin(this, lensFlares);

			function onContextLost(event) {
					event.preventDefault();
					resetGLState();
					setDefaultGLState();
					properties.clear();
			}

			function onTextureDispose(event) {
					var texture = event.target;
					texture.removeEventListener("dispose", onTextureDispose);
					deallocateTexture(texture);
					_infoMemory.textures--;
			}

			function onRenderTargetDispose(event) {
				  var renderTarget = event.target;
					renderTarget.removeEventListener("dispose", onRenderTargetDispose);
					deallocateRenderTarget(renderTarget);
					_infoMemory.textures--;
			}
			function onMaterialDispose(event) {
					var material = event.target;
					material.removeEventListener("dispose", onMaterialDispose);
					deallocateMaterial(material);
			}

			function deallocateTexture(texture) {
					var textureProperties = properties.get(texture);
					if(texture.image && textureProperties.__image__webglTextureCube) {
							this.context.deleteTexture(textureProperties.__image__webglTextureCube);
					} else {
							if(textureProperties.__webglInit === undefined) return;
							this.context.deleteTexture(textureProperties.__webglTexture);
					}
					properties.delete(texture);
			}

			function deallocateRenderTarget(renderTarget) {
					var renderTargetProperties = properties.get(renderTarget);
					var textureProperties = properties.get(renderTarget.texture);
					if(!renderTarget || textureProperties.__webglTexture === undefined) return;
					this.context.deleteTexture(textureProperties.__webglTexture);
					if(renderTarget instanceof WebGLRenderTargetCube) {
						 for(var i = 0; i < 6; i++) {
							  this.context.deleteFramebuffer(renderTargetProperties.__webglFramebuffe[i]);
								this.context.deleteRenderbuffer(renderTargetProperties.__webglRenderbuffer[i]);
						 }
					} else {
								this.context.deleteFramebuffer(renderTargetProperties.__webglFramebuffe);
								this.context.deleteRenderbuffer(renderTargetProperties.__webglRenderbuffer);
					}
					properties.delete(renderTarget.texture);
					properties.delete(renderTarget);
			}

			function deallocateMaterial(material) {
					//var renderTargetProperties = properties.get(renderTarget);
					//var textureProperties = properties.get(renderTarget.texture);
					releaseMaterialProgramReference(material);
					properties.delete(material);
			}

			function releaseMaterialProgramReference(material) {
					var programInfo = properties.get(material).program;
					material.program = undefined;
					if(programInfo !== undefined) {
							programCache.releaseProgram(programInfo);
					}
			}

			this.renderBufferImmediate = function(object, program, material) {
				
			}

 		};
 		(function() {
			/**
				清理颜色
				@method glClearColor
				@param r {Int}
				@param g {Int}
				@param b {Int}
				@param a {Int}
			*/
			this.glClearColor = function(r, g, b, a) {
					if(this.config.premultipliedAlpha === true) {
						 r *= a;
						 g *= a;
						 b *= a;
					}
					this.context.clearColor(r, g, b, a);
			}
			/**
					设置默认状态
					@method setDefaultGLState
			*/
			this.setDefaultGLState = function() {
				 this.state.init();
				 this.context.viewport(viewportX, viewportY, viewportWidth, viewportHeight);
				 this.glClearColor(this.config.clearColor.r, this.config.clearColor.g, this.config.clearColor.b, this.config.clearAlpha);
			}

			/**
				重新设置状态
				@method resetGLState
			*/
			this.resetGLState = function() {
				 this.currentProgram = null;
				 this.currentCamera = null;
				 this.currentGeometryProgram = "";
				 this.currentMaterialiId = -1;
				 this.lightsNeedUpdate = true;
				 this.state.reset();
			}
			/**
				@method getContext

			*/
			this.getContext = function() {
				return this.context;
			}

			/**
				@method getContextAttributes

			*/
			this.getContextAttributes = function() {
				 return this.context.getContextAttributes();
			}
			/**
				@method getMaxAnisotropy

			*/
			this.getMaxAnisotropy = (function() {
					var value;
					return function getMaxAnisotropy() {
							if(value !== undefined ) return value;
							var extension = extensions.get("EXT_texture_filter_anisotropic");
							if(extension !== null) {
								value = this.context.getParameter(extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
							}else{
								value = 0;
							}
							return value;
					}
			})();
			/**
					获得 精确 能力
					@method getPrecision

			*/
			this.getPrecision = function() {
					return this.capabilities.precision;
			}

			this.getPixelRatio = function() {
					return this.pixelRatio;
			}

			this.setPixelRatio = function(value) {
				 if(value !== undefined) {
					 	this.pixelRatio = value;
				 }
			}
			this.getSize = function() {
				return {
					 width: this.width,
					 height: this.height
				};
			}
			this.setSize = function(width, height, updateStyle) {
					this.width = width;
					this.height = height;
					canvas.width = width * pixelRatio;
					canvas.height = height * pixelRatio;
					if(updateStyle !== false) {
						 canvas.style.width = width + "px";
						 canvas.style.height = height + "px";
					}
					this.setViewport(0 ,0 , width, height);
			}
			this.setViewport = function(x, y, width, height) {
					this.viewportX = x * this.pixelRatio;
					this.viewportY = y * this.pixelRatio;
					this.viewportWidth = width * this.pixelRatio;
					this.viewportHeight = height * this.pixelRatio;
					this.context.viewport(this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight);
			}

			/**
				@method getViewport
				@param dimensions {Object}
			*/

			this.getViewport = function(dimensions) {
					dimensions.x = this.viewportX  / this.pixelRatio;
					dimensions.y = this.viewportY  / this.pixelRatio;
					dimensions.z = this.viewportWidth / this.pixelRatio;
					dimensions.w = this.viewportHeight / this.pixelRatio;
			}

			this.setScissor = function(x, y, width, height) {
				this.context.scissor(
						x * this.pixelRatio,
						y * this.pixelRatio,
						width * this.pixelRatio,
						height * this.pixelRatio
				);
			}

			this.enableScissorTest = function(boolean) {
					this.state.setScissorTest(boolean);
			}

			this.getClearColor = function() {
					return this.clearColor;
			}

			this.setClearColor = function(color, alpha) {
					this.clearColor.set(color);
					this.clearAlpha = alpha !== undefined ? alpha: 1;
					this.glClearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearAlpha);
			}

			this.clear = function(color, depth, stencil) {
					var bits = 0;
					if(color === undefined || color) bits |= this.context.COLOR_BUFFER_BIT;
					if(depth === undefined || depth) bits |= this.context.DEPTH_BUFFER_BIT;
					if(stencil === undefined || stencil) bits |= this.context.STENCIL_BUFFER_BIT;
					this.context.clear(bits);
			}
			this.clearColor = function() {
					this.context.clear(this.context.COLOR_BUFFER_BIT);
			}
			this.clearDepth = function() {
					this.context.clear(this.context.DEPTH_BUFFER_BIT);
			}
			this.clearStencil = function() {
					this.context.clear(this.context.STENCIL_BUFFER_BIT);
			}
			this.clearTarget = function(renderTarget, color, depth, stencil) {
					this.setRenderTarget(renderTarget);
					this.clear(color, depth, stencil);
			}

			this.dispose = function() {
					this.canvas.removeEventListener("webglcontextlost", onContextLost, false);
			}


 		}).call(WebGLRenderer.prototype);
 		module.exports = WebGLRenderer;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
