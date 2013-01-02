YUI.add('webgl-color', function(Y) {

	Color = {
		toWebGLColorArray: function(str) {
			var color = Y.Color.toRGBA(str),
				arr = Y.Color.toArray(color);

			var r = parseInt(arr[0]) / 255,
				g = parseInt(arr[1]) / 255,
				b = parseInt(arr[2]) / 255,
				a = parseFloat(arr[3]);

			return [r, g, b, a];
		}
	};

	Y.Color = Y.mix(Color, Y.Color);
}, '1.0', {requires: ['color']});