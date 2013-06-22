YUI().use('align-plugin', 'aui-ace-editor', 'aui-button', 'aui-popover', 'aui-toolbar', 'event-key', 'event-resize', 'io-base', 'node', function(Y) {

var playground = {
	controls: new dat.GUI({autoPlace: false}),
	editor: null,
	source: null,

	init: function() {
		var instance = this;

		instance.setupControls();
		instance.setupEditor();
		instance.load(Y.one('#introduction').get('href'), Y.bind(instance.run, instance));
		instance.setupToolbar();
	},

	load: function(gistURL, afterComplete) {
		if (gistURL === '') {
			return;
		}

		var instance = this,
			io = new Y.IO({emitFacade: true}),
			gistId = gistURL.slice(gistURL.lastIndexOf('/') + 1),
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

						Y.one('#templates-menu .dropdown-menu').setStyle('display', 'none');

						if (event.arguments.afterComplete) {
							event.arguments.afterComplete();
						}
					}
				}
			};

		if (gistId.indexOf('.git') > 0) {
			gistId = gistId.slice(0,  gistId.length - 4);
		}

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

	save: function() {
		var instance = this,
			visible = savePopover.get('visible'),
			io, config;

		if (visible) {
			savePopover.set('visible', false);

			return;
		}
		
		io = new Y.IO({emitFacade: true});

		config = {
			method: 'POST',
			data: JSON.stringify({
				'public': true,
				'files': {
					'y3d-script.js': {
						'content': instance.editor.get('value')
					}
				}
			}),
			headers: {
				'Accept': 'application/vnd.github.raw',
				'Content-Type': 'application/json'
			},
			on: {
				complete: function(event) {
					var response = JSON.parse(event.data.responseText),
						input = savePopover.get('contentBox').one('input');

					input.set('value', response.html_url);

					savePopover.set('visible', true);

					input.select();
				}
			}
		};

		io.send('https://api.github.com/gists', config);
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
	},

	setupToolbar: function() {
		var instance = this,
			loadUrl = Y.Node.one('#load-url'),
			templatesMenu = Y.one('#templates-menu');

		new Y.Toolbar({
			children: [
				[{
					label: 'Templates',
					on: {
						'click': Y.bind(instance.toggleTemplatesMenu, instance)
					},
					srcNode: '#templates-button'
				}],
				[{
					label: 'Save',
					on: {
						'click': Y.bind(instance.save, instance)
					},
					srcNode: '#save'
				}],
				[{
					label: 'Run',
					on: {
						'click': Y.bind(instance.run, instance)
					},
					primary: true,
					srcNode: '#run'
				}],
				[{
					label: 'Reset',
					on: {
						'click': Y.bind(instance.reset, instance)
					},
					srcNode: '#reset'
				}]
			]
		}).render('#right');

		loadUrl.once('key', function(event) {
			var gistURL = loadUrl.get('value');

			instance.load(gistURL);
		}, 'enter');

		if (!templatesMenu.hasPlugin()) {
			templatesMenu.plug(Y.Plugin.Align);
		}

		templatesMenu.delegate('click', function(event) {
			var gistURL = this.get('href');

			event.preventDefault();

			instance.load(gistURL, Y.bind(instance.run, instance));
		}, 'a.template');
	},

	toggleTemplatesMenu: function() {
		var instance = this,
			templatesMenu = Y.one('#templates-menu'),
			dropdownMenu = templatesMenu.one('.dropdown-menu'),
			visible = dropdownMenu.getStyle('display');

		if (visible == 'block') {
			dropdownMenu.setStyle('display', 'none');

			return;
		}

		templatesMenu.align.to(Y.one('#templates-button'), Y.WidgetPositionAlign.BL, Y.WidgetPositionAlign.TL);

		dropdownMenu.setStyle('display', 'block');
	}
};

playground.init();

window.playground = playground;
window.controls = playground.controls;

	var savePopover = new Y.Popover({
		align: {
			node: Y.Node.one('#save'),
			points:[Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC]
		},
		bodyContent: '<input type="text" />',
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
});