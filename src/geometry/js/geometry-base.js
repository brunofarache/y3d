var Lang = Y.Lang;

Y.Geometry = Y.Base.create('geometry', Y.Base, [], {
	move: function(axis, distance) {
		var instance = this,
			matrix = instance.get('matrix'),
			x = 0,
			y = 0,
			z = 0;

		if (axis.indexOf('x') !== -1) {
			x = distance;
		}

		if (axis.indexOf('y') !== -1) {
			y = distance;
		}

		if (axis.indexOf('z') !== -1) {
			z = distance;
		}

		Y.WebGLMatrix.mat4.translate(matrix, [x, y, z]);
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

		Y.WebGLMatrix.mat4.rotate(matrix, (degrees * (Math.PI/180)), [x, y, z]);
	},

	_generateId: function() {
        return Math.floor(Math.random() * 16777215).toString(16);
    },

	_setColor: function(val) {
		var instance = this,
			vertices = (instance.get('vertices').length / 3),
			colorArray = [],
			i;

		if (Lang.isArray(val) && val.length === 3) {
			val.push(1.0);
		}
		else if (Lang.isString(val)) {
			val = Y.Color.normalizedColorArray(val);
		}

		for (i = 0; i < vertices; i++) {
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

	_setWireframe: function(val) {
		var instance = this,
			lines = instance.get('lines'),
			indices = instance.get('indices'),
			i;

		if (val && (lines === null)) {
			lines = [];

			for (i = 0; i < indices.length; i = i + 3) {
				lines.push(indices[i]);
				lines.push(indices[i + 1]);
				lines.push(indices[i + 1]);
				lines.push(indices[i + 2]);
				lines.push(indices[i + 2]);
				lines.push(indices[i]);
			}

			instance.set('lines', lines);
		}

		return val;
	},

	_setXYZ: function(val) {
		var instance = this,
			matrix = Y.WebGLMatrix.mat4.create(),
			x = instance.get('x'),
			y = instance.get('y'),
			z = instance.get('z');

		Y.WebGLMatrix.mat4.identity(matrix);

		instance.set('matrix', matrix);

		if (val === null) {
			val = [x, y, z];
		}

		instance.move('x', val[0]);
		instance.move('y', val[1]);
		instance.move('z', val[2]);

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

		lines: {
			value: null,
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

		wireframe: {
			value: false,
			setter: '_setWireframe',
			validator: Lang.isBoolean
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
		}
	}
});