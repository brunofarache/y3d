YUI.add('webgl-camera', function(Y) {
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
				matrix = mat4.create();

			mat4.set(val, matrix);

			mat4.inverse(matrix);

			return matrix;
		},

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

		_onKeyPress: function(event) {
			var instance = this,
				keys = instance.get('controls.keys'),
				distance = keys.distance;

			switch (event.keyCode) {
				case keys.up:
					instance.moveY(distance);
					break;

				case keys.right:
					instance.moveX(distance);
					break;
				
				case keys.down:
					instance.moveY(-distance);
					break;

				case keys.left:
					instance.moveX(-distance);
					break;
			}
		},

		_onMouseWheel: function(event) {
			var instance = this,
				distance = instance.get('controls.mouseWheelDistance');

			instance.moveZ(-event.wheelDelta * distance);
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
}, '1.0', {requires: ['base-build', 'event-key', 'event-mousewheel']});