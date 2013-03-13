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

			indicesBuffer: {
				value: null
			},

			indices: {
				value: [],
				validator: Lang.isArray
			},

			modelViewMatrix: {
				value: null
			},

			normalsBuffer: {
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

			textureCoordinatesBuffer: {
				value: null
			},

			textureCoordinates: {
				value: [],
				validator: Lang.isArray
			},

			verticesBuffer: {
				value: null
			},

			vertices: {
				value: [],
				validator: Lang.isArray
			}
		}
	});
}, '1.0', {requires: ['base-build', 'webgl-texture']});