YUI.add('webgl-triangle', function(Y) {
	Y.Triangle = Y.Base.create('triangle', Y.Geometry, [], {
	}, {
		ATTRS: {
			indices: {
				value: [
					0, 1, 2
				]
			},

			normals: {
				value: [
					0.0, 0.0, 1.0,
					0.0, 0.0, 1.0,
					0.0, 0.0, 1.0
				]
			},

			textureCoordinates: {
				value: [
					0.0, 0.0,
					1.0, 0.0,
					1.0, 1.0
				]
			},

			vertices: {
				value: [
					-1.0, -1.0, 1.0,
					 1.0, -1.0, 1.0,
					 0.0,  Math.sqrt(0.75), 1.0
				]
			}
		}
	});
}, '1.0', {requires: ['webgl-geometry']});