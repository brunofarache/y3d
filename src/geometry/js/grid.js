Y.Grid = Y.Base.create('grid', Y.Geometry, [], {
	initializer: function() {
		var instance = this,
			size = instance.get('size'),
			vertices = instance.get('vertices'),
			normals = instance.get('normals'),
			lines = instance.get('lines'),
			x, z, i;

		for (x = -1 * size / 2; x <= size / 2; x++) {
			for (z = size / 2; z >= -1 * size / 2; z--) {
				vertices.push(x, 0, z);
			}
		}

		for (i = 0; i < vertices.length/3; i++) {
			normals.push(0, 0, 1);
		}

		for (i = 0; i < vertices.length/3; i = i + size + 1) {
			lines.push(i);
			lines.push(i + size);
		}

		var l = vertices.length/3 - size - 1;

		for (i = 0; i <= size; i = i + 1) {
			lines.push(i);
			lines.push(i + l);
		}

		instance.set('color', 'white');
	}
}, {
	ATTRS: {
		size: {
			value: 50
		},

		wireframe: {
			value: true
		}
	}
});