YUI.add('webgl-scene', function(Y) {
	var context = null;

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
			instance._createIndexBuffer(geometry);

			geometries.push(geometry);
		},

		render: function() {
			var instance = this,
				clearColor = instance.get('clearColor'),
				height = instance.get('height'),
				width = instance.get('width');

			context.clearColor(clearColor[0], clearColor[1], clearColor[2], 1.0);
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

				if (texture != null) {
					program = Y.Shader.getTextureProgram(context);
				}
				else {
					program = Y.Shader.getColorProgram(context);
				}

				context.useProgram(program);

				instance._setVertexAttribute(program, geometry);
				instance._setColorAttribute(program, geometry);
				instance._setTextureAttribute(program, geometry);
				instance._setIndices(geometry);

				context.uniformMatrix4fv(program.projectionMatrixUniform, false, projectionMatrix);
				context.uniformMatrix4fv(program.modelViewMatrixUniform, false, modelViewMatrix);

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

		_setIndices: function(geometry) {
			var indexBuffer = geometry.get('indexBuffer');

			context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
		},

		_setColorAttribute: function(program, geometry) {
			var colorBuffer = geometry.get('colorBuffer');

			context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
			context.vertexAttribPointer(program.vertexColorAttribute, 4, context.FLOAT, false, 0, 0);
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
				value: [0.0, 0.0, 0.0]
			},

			container: {
				value: Y.Node.one('#container')
			},

			height: {
				value: 800
			},

			geometries: {
				value: []
			},

			width: {
				value: 1000
			}
		}
	});
}, '1.0', {requires: ['base-build', 'node-base', 'webgl-shader']});