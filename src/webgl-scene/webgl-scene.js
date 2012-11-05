YUI.add('webgl-scene', function(Y) {
	var context = null;

	Y.Scene = Y.Base.create('scene', Y.Base, [], {
		initializer: function() {
			var instance = this,
				canvas = instance.get('canvas'),
				container = instance.get('container'),
				height = instance.get('height'),
				width = instance.get('width');

			canvas.set('height', height);
			canvas.set('width', width);

			container.append(canvas);

			context = canvas.getDOMNode().getContext("experimental-webgl");

			context.clearColor(0.0, 0.0, 0.0, 1.0);
        	context.enable(context.DEPTH_TEST);
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