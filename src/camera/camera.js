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

		moveX: function(delta) {
			var instance = this;

			instance._translate([delta, 0, 0]);
		},

		moveY: function(delta) {
			var instance = this;

			instance._translate([0, delta, 0]);
		},

		moveZ: function(delta) {
			var instance = this;

			instance._translate([0, 0, delta]);
		},

		_onKeyPress: function(event) {
			var instance = this,
				keys = instance.get('controls.keys'),
				factor = keys.factor;

			switch (event.keyCode) {
				case keys.up:
					instance.moveY(factor);
					break;

				case keys.right:
					instance.moveX(factor);
					break;
				
				case keys.down:
					instance.moveY(-factor);
					break;

				case keys.left:
					instance.moveX(-factor);
					break;
			}
		},

		_onMouseWheel: function(event) {
			var instance = this,
				factor = instance.get('controls.mouseWheelFactor');

			instance.moveZ(-event.wheelDelta * factor);
		},

		_resetMatrix: function() {
			var instance = this,
				matrix = mat4.create();

			mat4.identity(matrix);

			instance.set('matrix', matrix);
		},

		_setPosition: function(val) {
			var instance = this;

			instance._resetMatrix();
			instance._translate(val);

			return val;
		},

		_translate: function(position) {
			var instance = this,
				matrix = instance.get('matrix');

			mat4.translate(matrix, position);

			instance.set('matrix', matrix);

			return position;
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
						factor: 0.3
					},

					mouseWheelFactor: 0.1
				}
			},

			position: {
				lazyAdd: false,
				setter: '_setPosition',
				value: [0, 0, 0],
				validator: Lang.isArray
			}
		}
	});
}, '1.0', {requires: ['base-build', 'event-key', 'event-mousewheel']});