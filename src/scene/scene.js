YUI.add('webgl-scene', function(Y) {
	var Lang = Y.Lang,
		context = null;

	Y.Scene = Y.Base.create('scene', Y.Base, [], {
		initializer: function() {
			var instance = this,
				canvas = instance.get('canvas'),
				container = instance.get('container'),
				height = instance.get('height'),
				width = instance.get('width');

			canvas.set('height', height);
			canvas.set('width', width);

			container.append(canvas);

			context = canvas.getDOMNode().getContext("experimental-webgl");
		},

		addGeometry: function(geometry) {
			var instance = this,
				geometries = instance.get('geometries');

			instance._createVertexBuffer(geometry);
			instance._createColorBuffer(geometry);
			instance._createTextureBuffer(geometry);
			instance._createNormalBuffer(geometry);
			instance._createIndexBuffer(geometry);

			geometries.push(geometry);
		},

		addLight: function(light) {
			var instance = this,
				lights = instance.get('lights');

			lights.push(light);
		},

		render: function() {
			var instance = this,
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

		_createColorBuffer: function(geometry) {
			var color = geometry.get('color'),
				colorBuffer = context.createBuffer();

			context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
			context.bufferData(context.ARRAY_BUFFER, new Float32Array(color), context.STATIC_DRAW);

			geometry.set('colorBuffer', colorBuffer);
		},

		_createIndexBuffer: function(geometry) {
			var indexBuffer = context.createBuffer(),
				indices = geometry.get('indices');

			context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
			context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);

			geometry.set('indexBuffer', indexBuffer)
		},

		_createNormalBuffer: function(geometry) {
			var normalBuffer = context.createBuffer(),
				normals = geometry.get('normals');

			context.bindBuffer(context.ARRAY_BUFFER, normalBuffer);
			context.bufferData(context.ARRAY_BUFFER, new Float32Array(normals), context.STATIC_DRAW);

			geometry.set('normalBuffer', normalBuffer);
		},

		_createTextureBuffer: function(geometry) {
			var texture = geometry.get('texture');

			if (texture == null) {
				return;
			}

			var textureBuffer = context.createBuffer(),
				textureCoordinates = geometry.get('textureCoordinates');

			context.bindBuffer(context.ARRAY_BUFFER, textureBuffer);
			context.bufferData(context.ARRAY_BUFFER, new Float32Array(textureCoordinates), context.STATIC_DRAW);

			geometry.set('textureBuffer', textureBuffer);

			var webglTexture = context.createTexture();

			texture.set('webglTexture', webglTexture);
		},

		_createVertexBuffer: function(geometry) {
			var vertexBuffer = context.createBuffer(),
				vertices = geometry.get('vertices');

			context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
			context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);

			geometry.set('vertexBuffer', vertexBuffer);
		},

		_setClearColor: function(value) {
			if (Lang.isString(value)) {
				value = Y.Color.normalizedColorArray(value);
			}

			return value;
		},

		_setIndices: function(geometry) {
			var indexBuffer = geometry.get('indexBuffer');

			context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
		},

		_setColorAttribute: function(program, geometry) {
			var colorBuffer = geometry.get('colorBuffer');

			context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
			context.vertexAttribPointer(program.vertexColorAttribute, 4, context.FLOAT, false, 0, 0);
		},

		_setLightUniforms: function(program, lights) {
			if (lights.length > 0) {
				var light = lights[0],
					color = light.get('color'),
					direction = light.get('direction');

				context.uniform3f(program.lightColorUniform, color[0], color[1], color[2]);
				context.uniform3f(program.lightDirectionUniform, direction[0], direction[1], direction[2]);
			}
		},

		_setNormalAttribute: function(program, geometry) {
			var normalBuffer = geometry.get('normalBuffer');

			context.bindBuffer(context.ARRAY_BUFFER, normalBuffer);
			context.vertexAttribPointer(program.vertexNormalAttribute, 3, context.FLOAT, false, 0, 0);
		},

		_setTextureAttribute: function(program, geometry) {
			var texture = geometry.get('texture');

			if (texture == null) {
				return;
			}

			var	textureBuffer = geometry.get('textureBuffer'),
				image = texture.get('image'),
				webglTexture = texture.get('webglTexture');

			context.bindTexture(context.TEXTURE_2D, webglTexture);
			context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
			context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
			context.bindTexture(context.TEXTURE_2D, null);

			context.bindBuffer(context.ARRAY_BUFFER, textureBuffer);
			context.vertexAttribPointer(program.textureCoordinatesAttribute, 2, context.FLOAT, false, 0, 0);

			context.activeTexture(context.TEXTURE0);
			context.bindTexture(context.TEXTURE_2D, webglTexture);
			context.uniform1i(program.sampler, 0);
		},

		_setVertexAttribute: function(program, geometry) {
			var vertexBuffer = geometry.get('vertexBuffer');

			context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
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