YUI.add('webgl-shape', function(Y) {
	var Lang = Y.Lang;

	Y.Shape = Y.Base.create('shape', Y.Base, [], {
		initializer: function() {
			var instance = this,
				modelViewMatrix = mat4.create();

			mat4.identity(modelViewMatrix);

			instance.set('modelViewMatrix', modelViewMatrix);	
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
					1.0, 1.0, 1.0
				]
			},

			colorBuffer: {
				value: null
			},

			indexBuffer: {
				value: null
			},

			indices: {
				value: [],
				validator: Lang.isArray
			},

			modelViewMatrix: {
				value: null
			},

			texture: {
				value: null
			},

			textureBuffer: {
				value: null
			},

			textureCoordinates: {
				value: [],
				validator: Lang.isArray
			},

			vertexBuffer: {
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
					0, 1, 2,      0, 2, 3,    // Front face
					4, 5, 6,      4, 6, 7,    // Back face
					8, 9, 10,     8, 10, 11,  // Top face
					12, 13, 14,   12, 14, 15, // Bottom face
					16, 17, 18,   16, 18, 19, // Right face
					20, 21, 22,   20, 22, 23  // Left face
				]
			},

			textureCoordinates: {
				value: [
					// Front face
					0.0, 0.0,
					1.0, 0.0,
					1.0, 1.0,
					0.0, 1.0,

					// Back face
					1.0, 0.0,
					1.0, 1.0,
					0.0, 1.0,
					0.0, 0.0,

					// Top face
					0.0, 1.0,
					0.0, 0.0,
					1.0, 0.0,
					1.0, 1.0,

					// Bottom face
					1.0, 1.0,
					0.0, 1.0,
					0.0, 0.0,
					1.0, 0.0,

					// Right face
					1.0, 0.0,
					1.0, 1.0,
					0.0, 1.0,
					0.0, 0.0,

					// Left face
					0.0, 0.0,
					1.0, 0.0,
					1.0, 1.0,
					0.0, 1.0
				]
			},

			vertices: {
				value: [
					// Front face
					-1.0, -1.0,  1.0,
					 1.0, -1.0,  1.0,
					 1.0,  1.0,  1.0,
					-1.0,  1.0,  1.0,

					// Back face
					-1.0, -1.0, -1.0,
					-1.0,  1.0, -1.0,
					 1.0,  1.0, -1.0,
					 1.0, -1.0, -1.0,

					// Top face
					-1.0,  1.0, -1.0,
					-1.0,  1.0,  1.0,
					 1.0,  1.0,  1.0,
					 1.0,  1.0, -1.0,

					// Bottom face
					-1.0, -1.0, -1.0,
					 1.0, -1.0, -1.0,
					 1.0, -1.0,  1.0,
					-1.0, -1.0,  1.0,

					// Right face
					 1.0, -1.0, -1.0,
					 1.0,  1.0, -1.0,
					 1.0,  1.0,  1.0,
					 1.0, -1.0,  1.0,

					// Left face
					-1.0, -1.0, -1.0,
					-1.0, -1.0,  1.0,
					-1.0,  1.0,  1.0,
					-1.0,  1.0, -1.0
				]
			}
		}
	});
}, '1.0', {requires: ['base-build']});