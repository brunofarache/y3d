YUI.add('webgl-scene', function(Y) {
	var context = null;
	var program = null;

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
			program = Y.Shader.link(context);

			instance.render();
		},

		render: function() {
			var instance = this,
				height = instance.get('height'),
				width = instance.get('width');

			context.clearColor(0.0, 0.0, 0.0, 1.0);
			context.enable(context.DEPTH_TEST);

			context.viewport(0, 0, width, height);
			context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

			var modelViewMatrix = mat4.create();
			var projectionMatrix = mat4.create();

			mat4.perspective(45, width/height, 0.1, 100.0, projectionMatrix);

			mat4.identity(modelViewMatrix);
			mat4.translate(modelViewMatrix, [0.0, 0.0, -7.0]);

			instance.bindBuffer();

			context.vertexAttribPointer(program.vertexPositionAttribute, 3, context.FLOAT, false, 0, 0);
			
			context.uniformMatrix4fv(program.projectionMatrixUniform, false, projectionMatrix);
        	context.uniformMatrix4fv(program.modelViewMatrixUniform, false, modelViewMatrix);
			
			context.drawArrays(context.TRIANGLES, 0, 3);
		},

		bindBuffer: function() {
			var buffer = context.createBuffer();

			context.bindBuffer(context.ARRAY_BUFFER, buffer);

			var vertices = [
				0.0, 1.0, 0.0,
				-1.0, -1.0, 0.0,
				1.0, -1.0, 0.0
			];

			context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
		}
	}, {
		ATTRS: {
			canvas: {
				value: Y.Node.create('<canvas></canvas>')
			},

			container: {
				value: Y.Node.one('#container')
			},

			height: {
				value: 100
			},

			width: {
				value: 100
			}
		}
	});
}, '1.0', {requires: ['base-build', 'node-base', 'webgl-shader']});