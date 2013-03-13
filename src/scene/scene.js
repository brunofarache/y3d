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

			instance._setBuffer(geometry, 'color', context.ARRAY_BUFFER, Float32Array);
			instance._setBuffer(geometry, 'indices', context.ELEMENT_ARRAY_BUFFER, Uint16Array);
			instance._setBuffer(geometry, 'normals', context.ARRAY_BUFFER, Float32Array);
			instance._setBuffer(geometry, 'vertices', context.ARRAY_BUFFER, Float32Array);

			instance._setTextureBuffer(geometry);

			geometries.push(geometry);
		},

		addLight: function(light) {
			var instance = this,
				lights = instance.get('lights');

			lights.push(light);
		},

		render: function() {
			var instance = this,
				context = instance.context,
				clearColor = instance.get('clearColor'),
				height = instance.get('height'),
				lights = instance.get('lights'),
				width = instance.get('width');

			context.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);

			context.enable(context.DEPTH_TEST);

			context.viewport(0, 0, width, height);
			context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

			var projectionMatrix = mat4.create();

			mat4.perspective(45, width/height, 0.1, 100.0, projectionMatrix);

			var geometries = instance.get('geometries');

			for (var i = 0; i < geometries.length; i++) {
				var geometry = geometries[i],
					texture = geometry.get('texture'),
					indicesLength = geometry.get('indices').length,
					modelViewMatrix = geometry.get('modelViewMatrix'),
					program = null;

				var options = {
					context: context
				}

				if (lights.length > 0) {
					options.constants = ['#define USE_LIGHT'];
				}

				if (texture != null) {
					program = Y.Shader.getTextureProgram(options);
				}
				else {
					program = Y.Shader.getColorProgram(options);
				}

				context.useProgram(program);

				instance._setVertexAttribute(program, geometry);
				instance._setColorAttribute(program, geometry);
				instance._setTextureAttribute(program, geometry);
				instance._setNormalAttribute(program, geometry);
				instance._setIndices(geometry);
				instance._setLightUniforms(program, lights);

				context.uniformMatrix4fv(program.projectionMatrixUniform, false, projectionMatrix);
				context.uniformMatrix4fv(program.modelViewMatrixUniform, false, modelViewMatrix);

				var normalMatrix = mat3.create();

				mat4.toInverseMat3(modelViewMatrix, normalMatrix);
				mat3.transpose(normalMatrix);

				context.uniformMatrix3fv(program.normalMatrixUniform, false, normalMatrix);

				context.drawElements(context.TRIANGLES, indicesLength, context.UNSIGNED_SHORT, 0);
			}
		},

		_setBuffer: function(geometry, attributeName, target, arrayType) {
			var instance = this,
				context = instance.context,
				attribute = geometry.get(attributeName),
				buffer = context.createBuffer(),
				bufferName = attributeName + 'Buffer';

			context.bindBuffer(target, buffer);
			context.bufferData(target, new arrayType(attribute), context.STATIC_DRAW); 

			geometry[bufferName] = buffer;
		},

		_setTextureBuffer: function(geometry) {
			var instance = this,
				context = instance.context,
				texture = geometry.get('texture');

			if (texture == null) {
				return;
			}

			instance._setBuffer(geometry, 'textureCoordinates', context.ARRAY_BUFFER, Float32Array);

			texture.set('webglTexture', context.createTexture());
		},

		_setClearColor: function(value) {
			if (Lang.isString(value)) {
				value = Y.Color.normalizedColorArray(value);
			}

			return value;
		},

		_setIndices: function(geometry) {
			var instance = this,
				context = instance.context,
				indicesBuffer = geometry['indicesBuffer'];

			context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		},

		_setColorAttribute: function(program, geometry) {
			var instance = this,
				context = instance.context,
				colorBuffer = geometry['colorBuffer'];

			context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
			context.vertexAttribPointer(program.vertexColorAttribute, 4, context.FLOAT, false, 0, 0);
		},

		_setLightUniforms: function(program, lights) {
			var instance = this,
				context = instance.context;

			if (lights.length > 0) {
				var light = lights[0],
					color = light.get('color'),
					direction = light.get('direction');

				context.uniform3f(program.lightColorUniform, color[0], color[1], color[2]);
				context.uniform3f(program.lightDirectionUniform, direction[0], direction[1], direction[2]);
			}
		},

		_setNormalAttribute: function(program, geometry) {
			var instance = this,
				context = instance.context,
				normalsBuffer = geometry['normalsBuffer'];

			context.bindBuffer(context.ARRAY_BUFFER, normalsBuffer);
			context.vertexAttribPointer(program.vertexNormalAttribute, 3, context.FLOAT, false, 0, 0);
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
			context.bindTexture(context.TEXTURE_2D, null);

			context.bindBuffer(context.ARRAY_BUFFER, textureCoordinatesBuffer);
			context.vertexAttribPointer(program.textureCoordinatesAttribute, 2, context.FLOAT, false, 0, 0);

			context.activeTexture(context.TEXTURE0);
			context.bindTexture(context.TEXTURE_2D, webglTexture);
			context.uniform1i(program.sampler, 0);
		},

		_setVertexAttribute: function(program, geometry) {
			var instance = this,
				context = instance.context,
				verticesBuffer = geometry['verticesBuffer'];

			context.bindBuffer(context.ARRAY_BUFFER, verticesBuffer);
			context.vertexAttribPointer(program.vertexPositionAttribute, 3, context.FLOAT, false, 0, 0);
		}
	}, {
		ATTRS: {
			canvas: {
				value: Y.Node.create('<canvas></canvas>')
			},

			clearColor: {
				value: 'black',
				setter: '_setClearColor'
			},

			container: {
				value: Y.Node.one('#container')
			},

			geometries: {
				value: []
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
}, '1.0', {requires: ['base-build', 'node-base', 'webgl-color', 'webgl-shader']});