Y.Camera = Y.Base.create('camera', Y.y3d.Model, [], {
	_handles: null,

	initializer: function() {
		var instance = this;

		instance.inverse = Y.WebGLMatrix.mat4.create();

		instance.after('controlsChange', instance._afterControlsChange);

		if (instance.get('controls') !== null) {
			instance._bindControls();
		}
	},

	getInvertedMatrix: function() {
		var instance = this,
			val = instance.get('matrix'),
			inverse = instance.inverse;

		Y.WebGLMatrix.mat4.set(val, inverse);
		Y.WebGLMatrix.mat4.inverse(inverse);

		return inverse;
	},

	_afterControlsChange: function(event) {
		var instance = this;

		if (event.newVal !== null) {
			instance._bindControls();
		}
		else {
			instance._unbindControls();
		}
	},

	_bindControls: function() {
		var instance = this;

		instance._handles = [
			Y.on('keypress', Y.bind(instance._onKeyPress, instance)),
			Y.on('mousewheel', Y.bind(instance._onMouseWheel, instance))
		];
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

	_unbindControls: function() {
		var instance = this;

		(new Y.EventHandle(instance._handles)).detach();
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
		}
	}
});