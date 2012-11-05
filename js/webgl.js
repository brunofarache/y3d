YUI.add('webgl', function(Y) {
	var WebGL = Y.namespace('WebGL');

	WebGL.scene = function(node, config) {
		var container = Y.one(node),
			canvas = Y.Node.create('<canvas></canvas>');
			config = config ? config : {};

		config = Y.merge({
			height: 100,
			width: 100
		}, config);

		canvas.set('height', config.height);
		canvas.set('width', config.width);

		container.append(canvas);
	};
}, '0.0.1', {requires: ['node-base']});