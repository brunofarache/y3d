YUI.add('y3d-sphere', function(Y) {
	var Lang = Y.Lang;

	Y.Sphere = Y.Base.create('sphere', Y.Geometry, [], {
		initializer: function() {
			var instance = this,
				heightBands = instance.get('heightBands'),
				indices = instance.get('indices'),
				normals = instance.get('normals'),
				textureCoordinates = instance.get('textureCoordinates'),
				radius = instance.get('radius'),
				vertices = instance.get('vertices'),
				widthBands = instance.get('widthBands');
			
			for (var i = 0; i <= heightBands; i++) {
				var theta = i * Math.PI / heightBands,
					sinTheta = Math.sin(theta),
					cosTheta = Math.cos(theta);

				for (var j = 0; j <= widthBands; j++) {
					var phi = j * 2 * Math.PI / widthBands,
						sinPhi = Math.sin(phi),
						cosPhi = Math.cos(phi);

					var x = cosPhi * sinTheta,
						y = cosTheta,
						z = sinPhi * sinTheta;					

					vertices.push(radius * x);
					vertices.push(radius * y);
					vertices.push(radius * z);

					normals.push(x);
					normals.push(y);
					normals.push(z);

					var u = 1 - (j / widthBands),
						v = 1 - (i / heightBands);

					textureCoordinates.push(u);
					textureCoordinates.push(v);
				}
			}

			for (var i = 0; i < heightBands; i++) {
				for (var j = 0; j < widthBands; j++) {
					var first = (i * (widthBands + 1)) + j,
						second = first + widthBands + 1;

					indices.push(first);
					indices.push(second);
					indices.push(first + 1);

					indices.push(second);
					indices.push(second + 1);
					indices.push(first + 1);
				}
			}
		}
	}, {
		ATTRS: {
			heightBands: {
				value: 32,
				validator: Lang.isNumber
			},

			radius: {
				value: 1,
				validator: Lang.isNumber
			},

			widthBands: {
				value: 32,
				validator: Lang.isNumber
			}
		}
	});
}, '1.0', {requires: ['y3d-geometry-base']});