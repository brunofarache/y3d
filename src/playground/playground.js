YUI().use('align-plugin', 'aui-ace-editor', 'aui-button', 'aui-popover', 'aui-toolbar', 'event-key', 'event-resize', 'io-base', 'node', function(Y) {

var playground = {
	controls: new dat.GUI({ autoPlace: false }),
	editor: null,
	source: null,

	init: function() {
		this.setupControls();
		this.setupEditor();
		this.loadIntroduction();
	},

	loadIntroduction: function() {
		var instance = this;

		instance.loadTemplate(5819929, Y.bind(instance.run, instance));
	},

	loadTemplate: function(gistId, afterComplete) {
		var instance = this,
			io = new Y.IO({emitFacade: true}),
			config = {
				arguments: {
					afterComplete: afterComplete
				},
				headers: {
					'Accept': 'application/vnd.github.raw',
					'Content-Type': 'application/json'
				},
				on: {
					complete: function(event) {
						var response = JSON.parse(event.data.responseText);

						instance.source = response.files['y3d-script.js'].content;

						instance.reset();

						Y.one('.dropdown-menu').setStyle('display', 'none');

						if (event.arguments.afterComplete) {
							event.arguments.afterComplete();
						}
					}
				}
			};

		io.send('https://api.github.com/gists/' + gistId, config);
	},

	reset: function() {
		var instance = this;

		instance.editor.set('value', instance.source);
	},

	run: function() {
		var instance = this;

		eval(instance.editor.get('value'));
	},

	setupControls: function() {
		var instance = this,
			values = {
				x: 0,
				y: 0,
				z: 0,
				color: '#ff7700'
			},
			rotationFolder = instance.controls.addFolder('Rotation'),
			colorFolder = instance.controls.addFolder('Color');

		rotationFolder.open();
		colorFolder.open();

		instance.controls.rotation = {
			x: rotationFolder.add(values, 'x', -180, 180),
			y: rotationFolder.add(values, 'y', -180, 180),
			z: rotationFolder.add(values, 'z', -180, 180)
		};

		instance.controls.color = colorFolder.addColor(values, 'color');

		instance.controls.render = function() {
			Y.one('#controls').appendChild(instance.controls.domElement);
		};
	},

	setupEditor: function() {
		var instance = this,
			ace;

		instance.editor = new Y.AceEditor({
			boundingBox: '#editor',
			mode: 'javascript',
			showPrintMargin: false
		});

		ace = instance.editor.getEditor();

		ace.setTheme("ace/theme/monokai");

		ace.commands.addCommand({
			name: 'runCommand',
			bindKey: {win: 'Ctrl-R',  mac: 'Command-R'},
			exec: function(editor) {
				instance.run();
			},
			readOnly: false
		});
	}
};

playground.init();

window.controls = playground.controls;

	var save = function() {
		var visible = savePopover.get('visible');

		if (visible) {
			savePopover.set('visible', false);

			return;
		}
		
		var content = playground.editor.get('value');

		var io = new Y.IO({emitFacade: true});

		io.send('https://api.github.com/gists', {
			method: 'POST',
			data: JSON.stringify({
				"public": true,
				"files": {
					"y3d-script.js": {
						"content": content
					}
				}
			}),
			headers: {
				'Accept': 'application/vnd.github.raw',
				'Content-Type': 'application/json'
			},
			on: {
				complete: function(e) {
					var response = JSON.parse(e.data.responseText);

					var url = Y.Node.one('#saveUrl');

					url.set('value', response.html_url);

					savePopover.set('visible', true);

					input.select();
				}
			}
		});
	};

	var dropdown = Y.one('.dropdown');

	dropdown.plug(Y.Plugin.Align);

	var templates = function() {
		dropdown.align.to(Y.one('#templates'), 'bl', 'tl');

		var menu = Y.one('.dropdown-menu');

		var visible = menu.getStyle('display');

		if (visible == 'block') {
			menu.setStyle('display', 'none');

			return;
		}

		menu.setStyle('display', 'block');

		var url = Y.Node.one('#loadUrl');

		url.once('key', function(event) {
			var gistId = url.get('value');

			gistId = gistId.slice(gistId.lastIndexOf('/') + 1);

			if (gistId.indexOf('.git') > 0) {
				gistId = gistId.slice(0,  gistId.length - 4);
			}

			playground.loadTemplate(gistId);
		}, 'enter');
	};

	var tool = new Y.Toolbar({
		children: [
			[
				{
					label: 'Templates',
					on: {
						'click': templates
					},
					srcNode: '#templates'
				}
			],
			[
				{
					label: 'Save',
					on: {
						'click': save
					},
					srcNode: '#save'
				}
			],
			[
				{
					label: 'Run',
					on: {
						'click': Y.bind(playground.run, playground)
					},
					primary: true,
					srcNode: '#run'
				}
			],
			[
				{
					label: 'Reset',
					on: {
						'click': Y.bind(playground.reset, playground)
					},
					srcNode: '#reset'
				}
			]
		]
	}).render('#right');

	var savePopover = new Y.Popover({
		align: {
			node: Y.Node.one('#save'),
			points:[Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC]
		},
		bodyContent: '<input id="saveUrl" type="text" />',
		position: 'bottom',
		zIndex: 1,
		visible: false
	}).render();

	var syncSize = function() {
		var width = Y.DOM.winWidth()/2,
			height = Y.DOM.winHeight(),
			canvas = Y.Node.one('#y3d');

		canvas.set('height', height);
		canvas.set('width', width);;

		playground.editor.set('height', height);
		playground.editor.set('width', width);

		playground.run();
		playground.editor.render();
	};

	syncSize();

	Y.on('windowresize', syncSize);

	Y.one('#introduction').on('click', function(event) {
		event.preventDefault();

		playground.loadTemplate(5819929);
	});

	Y.one('#controlsTemplate').on('click', function(event) {
		event.preventDefault();

		playground.loadTemplate(5819876);
	});
});