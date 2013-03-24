YUI.add('webgl-camera', function(Y) {
	var Lang = Y.Lang;

	Y.Camera = Y.Base.create('camera', Y.Base, [], {
		_getMatrix: function(val) {
			var matrix = mat4.create();

			mat4.set(val, matrix);

			mat4.inverse(matrix);

			return matrix;
		},

		_setPosition: function(position) {
			var instance = this,
				matrix = instance.get('matrix');

			mat4.translate(matrix, position);
			instance.set('matrix', matrix);

			return position;
		}
	}, {
		ATTRS: {
			matrix: {
				getter: '_getMatrix',
				valueFn: function() {
					var matrix = mat4.create();

					mat4.identity(matrix);

					return matrix;
				}
			},

			position: {
				setter: '_setPosition',
				value: [0, 0, 0],
				validator: Lang.isArray
			}
		}
	});
}, '1.0', {requires: ['base-build']});