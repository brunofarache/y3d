YUI.add('webgl-scene', function(Y) {
	var Lang = Y.Lang;

	Y.Scene = Y.Base.create('scene', Y.Base, [], {
		context: null,

		initializer: function() {
			var instance = this,
				canvas = instance.get('canvas'),
				container = instance.get('container'),
				height = instance.get('height'),
				width = instance.get('width');

			canvas.set('height', height);
			canvas.set('width', width);

			container.append(canvas);

			instance.context = canvas.getDOMNode().getContext("experimental-webgl");
		},

		addGeometry: function(geometry) {
			var instance = this,
				context = instance.context,
				geometries = instance.get('geometries');

			instance._loadBufferData(geometry, context.ARRAY_BUFFER, new Float32Array(geometry.get('color')), 'colorBuffer');
			instance._loadBufferData(geometry, context.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.get('indices')), 'indicesBuffer');
			instance._loadBufferData(geometry, context.ARRAY_BUFFER, new Float32Array(geometry.get('normals')), 'normalsBuffer');
			instance._loadBufferData(geometry, context.ARRAY_BUFFER, new Float32Array(geometry.get('vertices')), 'verticesBuffer');

			instance._loadTextureBufferData(geometry);

			geometries[geometry.get('id')] = geometry;
		},

		addLight: function(light) {
			var instance = this,
				lights = instance.get('lights');

			lights.push(light);
		},

		render: function() {
			var instance = this,
				context = instance.context,
				projectionMatrix = instance._createProjectionMatrix(),
				geometries = instance.get('geometries');

			instance._clearColor();
			instance._enableDepthTest();

			Y.each(geometries, function(geometry) {
				var program = instance._getProgram(geometry);

				context.useProgram(program);

				instance._setVertexAttribute(geometry['colorBuffer'], program.vertexColorAttribute, 4);
				instance._setVertexAttribute(geometry['normalsBuffer'], program.vertexNormalAttribute, 3);
				instance._setVertexAttribute(geometry['verticesBuffer'], program.vertexPositionAttribute, 3);
				instance._setTextureAttribute(program, geometry);

				instance._setUniforms(program, geometry, projectionMatrix);
				instance._setLightUniforms(program);

				instance._drawGeometry(geometry);

				instance._unbindBuffers();
			});
		},

		_clearColor: function() {
			var instance = this,
				context = instance.context,
				clearColor = instance.get('clearColor');

			context.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
		},

		_createProjectionMatrix: function() {
			var instance = this,
				context = instance.context,
				projectionMatrix = mat4.create(),
				height = instance.get('height'),
				width = instance.get('width');

			context.viewport(0, 0, width, height);

			mat4.perspective(45, width/height, 0.1, 100.0, projectionMatrix);

			return projectionMatrix;
		},

		_drawGeometry: function(geometry) {
			var instance = this,
				context = instance.context,
				size = geometry.get('indices').length,
				buffer = geometry['indicesBuffer'];

			context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, buffer);
			context.drawElements(context.TRIANGLES, size, context.UNSIGNED_SHORT, 0);
		},

		_enableDepthTest: function() {
			var instance = this,
				context = instance.context;

			context.enable(context.DEPTH_TEST);
			context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
		},

		_getProgram: function(geometry) {
			var instance = this,
				texture = geometry.get('texture'),
				lights = instance.get('lights'),
				program = null,
				options = {
					context: instance.context
				};

			if (lights.length > 0) {
				options.constants = ['#define USE_LIGHT'];
			}

			if (texture != null) {
				program = Y.Shader.getTextureProgram(options);
			}
			else {
				program = Y.Shader.getColorProgram(options);
			}

			return program;
		},

		_loadBufferData: function(geometry, target, array, bufferName) {
			var instance = this,
				context = instance.context,
				buffer = context.createBuffer();

			context.bindBuffer(target, buffer);
			context.bufferData(target, array, context.STATIC_DRAW); 
			context.bindBuffer(target, null);

			geometry[bufferName] = buffer;
		},

		_loadTextureBufferData: function(geometry) {
			var instance = this,
				context = instance.context,
				texture = geometry.get('texture');

			if (texture == null) {
				return;
			}

			instance._loadBufferData(geometry, context.ARRAY_BUFFER, new Float32Array(geometry.get('textureCoordinates')), 'textureCoordinatesBuffer');

			texture.set('webglTexture', context.createTexture());
		},

		_setClearColor: function(value) {
			if (Lang.isString(value)) {
				value = Y.Color.normalizedColorArray(value);
			}

			return value;
		},

		_setLightUniforms: function(program) {
			var instance = this,
				context = instance.context,
				lights = instance.get('lights');

			if (lights.length > 0) {
				var light = lights[0],
					color = light.get('color'),
					direction = light.get('direction');

				context.uniform3f(program.lightColorUniform, color[0], color[1], color[2]);
				context.uniform3f(program.lightDirectionUniform, direction[0], direction[1], direction[2]);
			}
		},

		_setTextureAttribute: function(program, geometry) {
			var instance = this,
				context = instance.context,
				texture = geometry.get('texture');

			if (texture == null) {
				return;
			}

			var	textureCoordinatesBuffer = geometry['textureCoordinatesBuffer'],
				image = texture.get('image'),
				webglTexture = texture.get('webglTexture');

			context.bindTexture(context.TEXTURE_2D, webglTexture);

			context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
			context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);

			instance._setVertexAttribute(textureCoordinatesBuffer, program.textureCoordinatesAttribute, 2);

			context.activeTexture(context.TEXTURE0);
			context.uniform1i(program.sampler, 0);
		},

		_setUniforms: function(program, geometry, projectionMatrix) {
			var instance = this,
				context = instance.context,
				modelViewMatrix = geometry.get('modelViewMatrix'),
				normalMatrix = mat3.create();

			mat4.toInverseMat3(modelViewMatrix, normalMatrix);
			mat3.transpose(normalMatrix);

			context.uniformMatrix3fv(program.normalMatrixUniform, false, normalMatrix);
			context.uniformMatrix4fv(program.projectionMatrixUniform, false, projectionMatrix);
			context.uniformMatrix4fv(program.modelViewMatrixUniform, false, modelViewMatrix);
		},

		_setVertexAttribute: function(buffer, programAttribute, size) {
			var instance = this,
				context = instance.context;

			context.bindBuffer(context.ARRAY_BUFFER, buffer);
			context.vertexAttribPointer(programAttribute, size, context.FLOAT, false, 0, 0);
			context.bindBuffer(context.ARRAY_BUFFER, null);
		},

		_unbindBuffers: function() {
			var instance = this,
				context = instance.context;

			context.bindBuffer(context.ARRAY_BUFFER, null);
			context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
			context.bindTexture(context.TEXTURE_2D, null);
		}
	}, {
		ATTRS: {
			canvas: {
				valueFn: function() {
					return Y.Node.create('<canvas></canvas>');
				}
			},

			clearColor: {
				value: 'black',
				setter: '_setClearColor'
			},

			container: {
				value: Y.Node.one('#container')
			},

			geometries: {
				value: {}
			},

			height: {
				value: 800
			},

			lights: {
				value: []
			},

			width: {
				value: 1000
			}
		}
	});
}, '1.0', {requires: ['base-build', 'base-pluginhost', 'node-base', 'webgl-color', 'webgl-shader']});