YUI.add('webgl-geometry', function(Y) {
	var Lang = Y.Lang;

	Y.Geometry = Y.Base.create('geometry', Y.Base, [], {
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
		},

		_setColor: function(value) {
			var instance = this;

			if (Lang.isArray(value) && value.length == 3) {
				value.push(1.0);
			}
			else if (Lang.isString(value)) {
				value = Y.Color.normalizedColorArray(value);
			}

			var vertices = instance.get('vertices'),
				j = (vertices.length / 3) - 1;

			for (var i = 0; i < j; i++) {
				value = value.concat(value);
			}

			return value;
		},

		_setTexture: function(value) {
			if (Lang.isString(value)) {
				value = new Y.Texture({'imageUrl': value});
			}

			return value;
		}
	}, {
		ATTRS: {
			color: {
				value: 'white',
				setter: '_setColor',
				validator: function(value) {
					return Lang.isArray(value) || Lang.isString(value);
				}
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

			normalBuffer: {
				value: null
			},

			normals: {
				value: [],
				validator: Lang.isArray
			},

			texture: {
				value: null,
				setter: '_setTexture'
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

	Y.Cube = Y.Base.create('cube', Y.Geometry, [], {
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

			normals: {
				value: [
					// Front face
					0.0,  0.0,  1.0,
					0.0,  0.0,  1.0,
					0.0,  0.0,  1.0,
					0.0,  0.0,  1.0,

					// Back face
					0.0,  0.0, -1.0,
					0.0,  0.0, -1.0,
					0.0,  0.0, -1.0,
					0.0,  0.0, -1.0,

					// Top face
					0.0,  1.0,  0.0,
					0.0,  1.0,  0.0,
					0.0,  1.0,  0.0,
					0.0,  1.0,  0.0,

					// Bottom face
					0.0, -1.0,  0.0,
					0.0, -1.0,  0.0,
					0.0, -1.0,  0.0,
					0.0, -1.0,  0.0,

					// Right face
					1.0,  0.0,  0.0,
					1.0,  0.0,  0.0,
					1.0,  0.0,  0.0,
					1.0,  0.0,  0.0,

					// Left face
					-1.0,  0.0,  0.0,
					-1.0,  0.0,  0.0,
					-1.0,  0.0,  0.0,
					-1.0,  0.0,  0.0
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
}, '1.0', {requires: ['base-build', 'webgl-texture']});