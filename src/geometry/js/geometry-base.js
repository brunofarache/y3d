var Lang = Y.Lang;

Y.Geometry = Y.Base.create('geometry', Y.Base, [], {
	initializer: function() {
		var instance = this;

		instance._updateMatrix();

		instance.after('positionChange', instance._updateMatrix);
		instance.after('rotationChange', instance._updateMatrix);
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

	_setPosition: function(val) {
		var instance = this,
			position = instance.get('position');

		if (position) {
			return Y.merge(position, val);
		}
		else {
			return Y.merge({x: 0, y: 0, z: 0}, val);
		}
	},

	_setRotation: function(val) {
		var instance = this,
			rotation = instance.get('rotation');

		if (rotation) {
			return Y.merge(rotation, val);
		}
		else {
			return Y.merge({x: 0, y: 0, z: 0}, val);
		}
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

	_updateMatrix: function() {
		var instance = this,
			matrix = Y.WebGLMatrix.mat4.create(),
			position = instance.get('position'),
			rotation = instance.get('rotation');

		Y.WebGLMatrix.mat4.identity(matrix);

		instance.set('matrix', matrix);

		Y.WebGLMatrix.mat4.translate(matrix, [position.x, position.y, position.z]);

		Y.WebGLMatrix.mat4.rotateX(matrix, (rotation.x * (Math.PI / 180)));
		Y.WebGLMatrix.mat4.rotateY(matrix, (rotation.y * (Math.PI / 180)));
		Y.WebGLMatrix.mat4.rotateZ(matrix, (rotation.z * (Math.PI / 180)));
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

		position: {
			value: {
				x: 0,
				y: 0,
				z: 0
			},
			setter: '_setPosition'
		},

		rotation: {
			value: {
				x: 0,
				y: 0,
				z: 0
			},
			setter: '_setRotation'
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
		}
	}
});