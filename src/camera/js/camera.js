Y.Camera = Y.Base.create('camera', Y.Base, [], {
	initializer: function() {
		var instance = this;

		instance._updateMatrix();

		Y.on('keypress', Y.bind(instance._onKeyPress, instance));
		Y.on('mousewheel', Y.bind(instance._onMouseWheel, instance));

		instance.after('positionChange', instance._updateMatrix);
		instance.after('rotationChange', instance._updateMatrix);
	},

	getInvertedMatrix: function() {
		var instance = this,
			val = instance.get('matrix'),
			matrix = Y.WebGLMatrix.mat4.create();

		Y.WebGLMatrix.mat4.set(val, matrix);

		Y.WebGLMatrix.mat4.inverse(matrix);

		return matrix;
	},

	_onKeyPress: function(event) {
		var instance = this,
			keys = instance.get('controls.keys'),
			distance = keys.distance,
			position = instance.get('position'),
			x = position.x,
			y = position.y;

		switch (event.keyCode) {
			case keys.up:
				instance.set('position.y', y + distance);

				break;

			case keys.right:
				instance.set('position.x', x + distance);

				break;

			case keys.down:
				instance.set('position.y', y - distance);

				break;

			case keys.left:
				instance.set('position.x', x - distance);

				break;
		}
	},

	_onMouseWheel: function(event) {
		var instance = this,
			distance = instance.get('controls.mouseWheelDistance'),
			z = instance.get('position.z');

		z = z - (event.wheelDelta * distance);

		instance.set('position.z', z);
	},

	_setPosition: function(val) {
		var instance = this,
			position = instance.get('position') || {x: 0, y: 0, z: 0};

		position.x = (val.x !== undefined) ? val.x : position.x;
		position.y = (val.y !== undefined) ? val.y : position.y;
		position.z = (val.z !== undefined) ? val.z : position.z;

		return position;
	},

	_setRotation: function(val) {
		var instance = this,
			rotation = instance.get('rotation') || {x: 0, y: 0, z: 0};

		rotation.x = (val.x !== undefined) ? val.x : rotation.x;
		rotation.y = (val.y !== undefined) ? val.y : rotation.y;
		rotation.z = (val.z !== undefined) ? val.z : rotation.z;

		return rotation;
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
		controls: {
			value: {
				keys: {
					up: 119,
					right: 100,
					down: 115,
					left: 97,
					distance: 0.3
				},

				mouseWheelDistance: 0.1
			}
		},

		matrix: {
			value: null
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
		}
	}
});