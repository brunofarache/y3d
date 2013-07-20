YUI.add('y3d-geometry-grid', function (Y, NAME) {

Y.Grid = Y.Base.create('grid', Y.Geometry, [], {
	initializer: function() {
		var instance = this,
			size = instance.get('size'),
			vertices = instance.get('vertices'),
			normals = instance.get('normals'),
			lines = instance.get('lines'),
			half = size / 2,
			x, y, z, i, index;

		for (i = 0; i <= size; i++) {
			index = 6 * i;

			x = half;
			y = 0;
			z = -half + i;
	
			vertices[index] = -x;
			vertices[index + 1] = y;
			vertices[index + 2] = z;

			vertices[index + 3] = x;
			vertices[index + 4] = y;
			vertices[index + 5] = z;

			index = index + (6 * (size + 1));

			x = -half + i;
			z = half;

			vertices[index] = x;
			vertices[index + 1] = y;
			vertices[index + 2] = -z;

			vertices[index + 3] = x;
			vertices[index + 4] = y;
			vertices[index + 5] = z;

			index = 2 * i;

			lines[index] = index;
			lines[index + 1] = index + 1;

			index = index + (2 * (size + 1));

			lines[index] = index;
			lines[index + 1] = index + 1;
		}

		for (i = 0; i < vertices.length/3; i++) {
			normals.push(0, 1, 0);
		}

		instance.set('color', 'white');
	}
}, {
	ATTRS: {
		size: {
			value: 12
		},

		wireframe: {
			value: true
		}
	}
});

}, '0.1', {"requires": ["y3d-geometry-base"]});
