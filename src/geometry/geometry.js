YUI.add('webgl-geometry', function(Y) {
	var Lang = Y.Lang;

	Y.Geometry = Y.Base.create('geometry', Y.Base, [], {
		move: function(x, y, z) {
			var instance = this,
				matrix = instance.get('matrix');

			mat4.translate(matrix, [x, y, z]);
		},

		moveX: function(distance) {
			var instance = this;

			instance.move(distance, 0, 0);
		},

		moveY: function(distance) {
			var instance = this;

			instance.move(0, distance, 0);
		},

		moveZ: function(distance) {
			var instance = this;

			instance.move(0, 0, distance);
		},

		rotate: function(axis, degrees) {
			var instance = this,
				matrix = instance.get('matrix'),
				x = 0,
				y = 0,
				z = 0;

			if (axis.indexOf('x') !== -1) {
				x = 1;
			}

			if (axis.indexOf('y') !== -1) {
				y = 1;
			}

			if (axis.indexOf('z') !== -1) {
				z = 1;
			}

			mat4.rotate(matrix, (degrees * (Math.PI/180)), [x, y, z]);
		},

		rotateX: function(degrees) {
			var instance = this;

			instance.rotate('x', degrees);
		},

		rotateY: function(degrees) {
			var instance = this;

			instance.rotate('y', degrees);
		},

		rotateZ: function(degrees) {
			var instance = this;

			instance.rotate('z', degrees);
		},

		_generateId: function() {
            return Math.floor(Math.random() * 16777215).toString(16);
        },

		_setColor: function(val) {
			var instance = this;

			if (Lang.isArray(val) && val.length == 3) {
				val.push(1.0);
			}
			else if (Lang.isString(val)) {
				val = Y.Color.normalizedColorArray(val);
			}

			var vertices = (instance.get('vertices').length / 3);

			var colorArray = [];

			for (var i = 0; i < vertices; i++) {
				colorArray = colorArray.concat(val);
			}

			return colorArray;
		},

		_setTexture: function(val) {
			if (Lang.isString(val)) {
				val = new Y.Texture({'imageUrl': val});
			}

			return val;
		},

		_setXYZ: function(val) {
			var instance = this,
				matrix = mat4.create(),
				x = instance.get('x'),
				y = instance.get('y'),
				z = instance.get('z');

			mat4.identity(matrix);

			instance.set('matrix', matrix);

			if (val == null) {
				val = [x, y, z];
			}

			instance.move(val[0], val[1], val[2]);

			return val;
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

			matrix: {
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
			},

			// TODO: getters

			x: {
				value: 0
			},

			y: {
				value: 0
			},

			z: {
				value: 0
			},

			xyz: {
				lazyAdd: false,
				setter: '_setXYZ',
				value: null,
				validator: Lang.isArray
			},
		}
	});
}, '1.0', {requires: ['base-build', 'webgl-texture']});