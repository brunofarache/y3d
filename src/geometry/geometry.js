YUI.add('webgl-geometry', function(Y) {
	var Lang = Y.Lang;

	Y.Geometry = Y.Base.create('geometry', Y.Base, [], {
		initializer: function() {
			var instance = this,
				modelViewMatrix = mat4.create();

			mat4.identity(modelViewMatrix);

			instance.set('modelViewMatrix', modelViewMatrix);	
		},

		move: function(x, y, z) {
			var instance = this,
				modelViewMatrix = instance.get('modelViewMatrix');

			mat4.translate(modelViewMatrix, [x, y, z]);
		},

		moveX: function(x) {
			var instance = this;

			instance.move(x, 0, 0);
		},

		moveY: function(y) {
			var instance = this;

			instance.move(0, y, 0);
		},

		moveZ: function(z) {
			var instance = this;

			instance.move(0, 0, z);
		},

		rotate: function(x, y, z, degrees) {
			var instance = this,
				modelViewMatrix = instance.get('modelViewMatrix');

			mat4.rotate(modelViewMatrix, (degrees * (Math.PI/180)), [x, y, z]);
		},

		rotateX: function(degrees) {
			var instance = this;

			instance.rotate(1, 0, 0, degrees);
		},

		rotateY: function(degrees) {
			var instance = this;

			instance.rotate(0, 1, 0, degrees);
		},

		rotateZ: function(degrees) {
			var instance = this;

			instance.rotate(0, 0, 1, degrees);
		},

		_generateId: function() {
            return Math.floor(Math.random() * 16777215).toString(16);
        },

		_setColor: function(value) {
			var instance = this;

			if (Lang.isArray(value) && value.length == 3) {
				value.push(1.0);
			}
			else if (Lang.isString(value)) {
				value = Y.Color.normalizedColorArray(value);
			}

			var vertices = (instance.get('vertices').length / 3);

			var colorArray = [];

			for (var i = 0; i < vertices; i++) {
				colorArray = colorArray.concat(value);
			}

			return colorArray;
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

			id: {
				writeOnce: true,
				valueFn: '_generateId'
			},

			indices: {
				value: [],
				validator: Lang.isArray
			},

			modelViewMatrix: {
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

			textureCoordinates: {
				value: [],
				validator: Lang.isArray
			},

			vertices: {
				value: [],
				validator: Lang.isArray
			}
		}
	});
}, '1.0', {requires: ['base-build', 'webgl-texture']});