YUI.add('webgl-shape', function(Y) {
	var Lang = Y.Lang;

	Y.Shape = Y.Base.create('shape', Y.Base, [], {
		colorBuffer: null,
		indexBuffer: null,
		vertexBuffer: null,

		initializer: function() {
			var instance = this;

			var modelViewMatrix = mat4.create();

			mat4.identity(modelViewMatrix);

			instance.set('modelViewMatrix', modelViewMatrix);	
		},

		bindBuffers: function(context) {
			var instance = this,
				vertices = instance.get('vertices'),
				color = instance.get('color'),
				indices = instance.get('indices');

			instance.vertexBuffer = context.createBuffer();

			context.bindBuffer(context.ARRAY_BUFFER, instance.vertexBuffer);
			context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
		
			instance.colorBuffer = context.createBuffer();

			context.bindBuffer(context.ARRAY_BUFFER, instance.colorBuffer);
			context.bufferData(context.ARRAY_BUFFER, new Float32Array(color), context.STATIC_DRAW);

			instance.indexBuffer = context.createBuffer();
			
			context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, instance.indexBuffer);
			context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), context.STATIC_DRAW);
		},

		rotate: function(x, y, z, degrees) {
			var instance = this,
				modelViewMatrix = instance.get('modelViewMatrix');

			mat4.rotate(modelViewMatrix, (degrees * (Math.PI/180)), [x, y, z]);
		},

		translate: function(x, y, z) {
			var instance = this,
				modelViewMatrix = instance.get('modelViewMatrix');

			mat4.translate(modelViewMatrix, [x, y, z]);
		}
	}, {
		ATTRS: {
			color: {
				setter: function(val) {
					var instance = this;

					if (Lang.isArray(val)) {
						var length = val.length;

						if (length == 3) {
							for (var i = 0; i < length; i++) {
								var n = val[i];

								if (n > 1) {
									val[i] = (n / 255);
								}
							}

							val.push(1.0);
						}
						
						if (val.length == 4) {
							var vertices = instance.get('vertices'),
								j = (vertices.length / 3) - 1;

							for (var i = 0; i < j; i++) {
								val = val.concat(val);
							}
						}
					}

					return val;
				},

				value: [
					0.0, 0.0, 0.0
				]
			},

			indices: {
				value: [],
				validator: Lang.isArray
			},

			modelViewMatrix: {
				value: null
			},

			vertices: {
				value: [],
				validator: Lang.isArray
			}
		}
	});

	Y.Cube = Y.Base.create('cube', Y.Shape, [], {
	}, {
		ATTRS: {
			indices: {
				value: [
					// Front
					0, 1, 2,
					2, 3, 0,

					// Back
					4, 6, 5,
					4, 7, 6,

					// Left
					2, 7, 3,
					7, 6, 2,

					// Right
					0, 4, 1,
					4, 1, 5,

					// Top
					6, 2, 1,
					1, 6, 5,

					// Bottom
					0, 3, 7,
					0, 7, 4
				]
			},

			vertices: {
				value: [
					// Front
					1.0, -1.0,  1.0,
					1.0,  1.0,  1.0,
					-1.0,  1.0,  1.0,
					-1.0, -1.0,  1.0,

					// Back
					1.0, -1.0, -1.0,
					1.0, 1.0, -1.0,
					-1.0, 1.0, -1.0,
					-1.0, -1.0, -1.0
				]
			}
		}
	});
}, '1.0', {requires: ['base-build']});