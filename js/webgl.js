YUI.add('webgl', function(Y) {
	Y.Scene = Y.Base.create('scene', Y.Base, [], {
		initializer: function() {
			var instance = this,
				container = instance.get('container'),
				canvas = instance.get('canvas');

			canvas.set('height', instance.get('height'));
			canvas.set('width', instance.get('width'));

			container.append(canvas);
		}
	}, {
		ATTRS: {
			canvas: {
				value: Y.Node.create('<canvas></canvas>')
			},

			container: {
				value: Y.Node.one('#container')
			},

			height: {
				value: 100
			},

			width: {
				value: 100
			}
		}
	});
}, '1.0', {requires: ['base-build', 'node-base']});