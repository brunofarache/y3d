Y.Camera = Y.Base.create('camera', Y.y3d.Model, [], {
	initializer: function() {
		var instance = this;

		Y.on('keypress', Y.bind(instance._onKeyPress, instance));
		Y.on('mousewheel', Y.bind(instance._onMouseWheel, instance));
		Y.on('mousemove', Y.bind(instance._onMouseMove, instance));

		instance.inverse = Y.WebGLMatrix.mat4.create();
	},

	getInvertedMatrix: function() {
		var instance = this,
			val = instance.get('matrix'),
			inverse = instance.inverse;

		Y.WebGLMatrix.mat4.set(val, inverse);
		Y.WebGLMatrix.mat4.inverse(inverse);

		return inverse;
	},

	lookAt: function(center) {
		var instance = this,
			position = instance.get('position'),
			eye = [position.x, position.y, position.z],
			up = [0, 1, 0],
			matrix = Y.WebGLMatrix.mat4.lookAt(eye, center, up);;

		Y.WebGLMatrix.mat4.inverse(matrix);
		instance.set('matrix', matrix);
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

	_onMouseMove: function(event) {
		var instance = this;
			rotation = instance.get('rotation');

		var deltaX = event.clientX - (instance.previousX || event.clientX );
		instance.previousX = event.clientX;

		instance.set('rotation.y', rotation.y + deltaX * -0.1);

		var deltaY = event.clientY - (instance.previousY || event.clientY);
		instance.previousY = event.clientY;

		instance.set('rotation.x', rotation.x + deltaY * -0.1);
		// console.log(event);

		
	},

	_onMouseWheel: function(event) {
		var instance = this,
			distance = instance.get('controls.mouseWheelDistance'),
			z = instance.get('position.z');

		z = z - (event.wheelDelta * distance);

		instance.set('position.z', z);
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