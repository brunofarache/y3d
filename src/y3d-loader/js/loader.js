var Lang = Y.Lang;

Y.Loader = Y.Base.create('loader', Y.Base, [], {
	load: function() {
		var instance = this,
			geometry = instance.get('geometry'),
			indices = geometry.get('indices'),
			vertices = geometry.get('vertices'),
			normals = geometry.get('normals'),
			src = instance.get('src'),
			lines = src.split('\n'),
			i, line, values,
			v1, v2, v3, i1, i2, i3, i4;

		for (i = 0; i < lines.length; i++) {
			line = lines[i].trim();
			values = line.split(/\s+/);

			if (line.indexOf('v ') === 0) {
				v1 = parseFloat(values[1], 10);
				v2 = parseFloat(values[2], 10);
				v3 = parseFloat(values[3], 10);

				vertices.push(v1, v2, v3);
			}
			else if (line.indexOf('f ') === 0) {
				i1 = parseInt(values[1], 10) - 1;
				i2 = parseInt(values[2], 10) - 1;
				i3 = parseInt(values[3], 10) - 1;

				if (values.length === 4) {
					indices.push(i1, i2, i3);
				}
				else if (values.length === 5) {
					i4 = parseInt(values[4], 10) - 1;

					indices.push(i1, i2, i3, i1, i3, i4);
				}
			}
		}

		for (i = 0; i < vertices.length/3; i++) {
			normals.push(0, 1, 0);
		}

		geometry.set('color', 'blue');

		return geometry;
	}
}, {
	ATTRS: {
		geometry: {
			value: new Y.Geometry()
		},

		src: {
			value: '',
			validator: Lang.isString
		}
	}
});