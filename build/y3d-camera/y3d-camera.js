YUI.add('y3d-camera', function (Y, NAME) {

var Lang = Y.Lang;

Y.Camera = Y.Base.create('camera', Y.Base, [], {
	initializer: function() {
		var instance = this;

		Y.on('keypress', Y.bind(instance._onKeyPress, instance));
		Y.on('mousewheel', Y.bind(instance._onMouseWheel, instance));
	},

	getMatrix: function() {
		var instance = this,
			val = instance.get('matrix'),
			matrix = Y.WebGLMatrix.mat4.create();

		Y.WebGLMatrix.mat4.set(val, matrix);

		Y.WebGLMatrix.mat4.inverse(matrix);

		return matrix;
	},

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

	_onKeyPress: function(event) {
		var instance = this,
			keys = instance.get('controls.keys'),
			distance = keys.distance;

		switch (event.keyCode) {
			case keys.up:
				instance.move('y', distance);
				break;

			case keys.right:
				instance.move('x', distance);
				break;

			case keys.down:
				instance.move('y', -distance);
				break;

			case keys.left:
				instance.move('x', -distance);
				break;
		}
	},

	_onMouseWheel: function(event) {
		var instance = this,
			distance = instance.get('controls.mouseWheelDistance');

		instance.move('z', -event.wheelDelta * distance);
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

}, '0.1', {"requires": ["base-build", "event-key", "event-mousewheel", "y3d-matrix"]});
