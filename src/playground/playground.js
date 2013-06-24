YUI().use('align-plugin', 'aui-ace-editor', 'aui-button', 'aui-popover', 'aui-toolbar', 'event-key', 'event-resize', 'io-base', 'node', function(Y) {

var playground = {
	controls: new dat.GUI({autoPlace: false}),
	editor: null,
	savePopover: null,
	source: null,
	templatesMenu: null,

	init: function() {
		var instance = this;

		instance.setupControls();
		instance.setupEditor();
		instance.setupToolbar();
		instance.load(Y.one('#introduction').get('href'), Y.bind(instance.run, instance));
		instance.render();
	},

	hideControls: function() {
		var instance = this,
			controls = Y.one('.dg .main');

		if (controls) {
			controls.remove(true);

			instance.controls.revert(instance.controls);
		}
	},

	hideSavePopover: function() {
		var instance = this;

		instance.savePopover.set('visible', false);
	},

	hideTemplatesMenu: function() {
		var instance = this;

		instance.templatesMenu.removeClass('open');

		Y.Node.one('#load-url').set('value', '');
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

						instance.hideTemplatesMenu();

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

	render: function() {
		var instance = this,
			resize = function() {
				var width = Y.DOM.winWidth()/2,
					height = Y.DOM.winHeight(),
					canvas = Y.Node.one('#y3d');

				instance.editor.set('height', height);
				instance.editor.set('width', width);

				canvas.set('height', height);
				canvas.set('width', width);;

				instance.editor.render();
				instance.run();

				instance.hideTemplatesMenu();
				instance.hideSavePopover();
			};

		resize();

		Y.on('windowresize', Y.bind(resize, instance));
	},

	reset: function() {
		var instance = this;

		instance.editor.set('value', instance.source);
	},

	run: function() {
		var instance = this;

		instance.hideControls();

		eval(instance.editor.get('value'));
	},

	save: function() {
		var instance = this,
			savePopover = instance.savePopover,
			visible = savePopover.get('visible'),
			io, config;

		if (visible) {
			hideSavePopover();

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

					instance.hideTemplatesMenu();
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
			positionFolder = instance.controls.addFolder('Position'),
			rotationFolder = instance.controls.addFolder('Rotation'),
			colorFolder = instance.controls.addFolder('Color');

		positionFolder.open();
		rotationFolder.open();
		colorFolder.open();

		instance.controls.position = {
			x: positionFolder.add(values, 'x', -6, 6),
			y: positionFolder.add(values, 'y', -6, 6),
			z: positionFolder.add(values, 'z', -6, 6)
		};

		instance.controls.rotation = {
			x: rotationFolder.add(values, 'x', -180, 180).step(1),
			y: rotationFolder.add(values, 'y', -180, 180).step(1),
			z: rotationFolder.add(values, 'z', -180, 180).step(1)
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
			loadUrl = Y.Node.one('#load-url');
			templatesMenu = Y.one('#templates-menu');

		new Y.Toolbar({
			children: [
				[{
					label: 'Templates',
					on: {
						'click': Y.bind(instance.toggleTemplatesMenu, instance)
					},
					srcNode: '#templates'
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

		loadUrl.on('key', function(event) {
			var gistURL = Y.Lang.trim(loadUrl.get('value'));

			if (gistURL) {
				instance.load(gistURL);
			}
		}, 'enter');

		instance.templatesMenu = templatesMenu;

		if (!templatesMenu.hasPlugin()) {
			templatesMenu.plug(Y.Plugin.Align);
		}

		templatesMenu.delegate('click', function(event) {
			var gistURL = this.get('href');

			event.preventDefault();

			instance.load(gistURL, Y.bind(instance.run, instance));
		}, 'a.template');

		instance.savePopover = new Y.Popover({
			align: {
				node: Y.Node.one('#save'),
				points:[Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC]
			},
			bodyContent: '<input type="text" />',
			position: 'bottom',
			zIndex: 1,
			visible: false
		}).render();
	},

	toggleTemplatesMenu: function() {
		var instance = this,
			templatesMenu = instance.templatesMenu;

		templatesMenu.align.to(Y.one('#templates'), Y.WidgetPositionAlign.BL, Y.WidgetPositionAlign.TL);

		templatesMenu.toggleClass('open');

		if (templatesMenu.hasClass('open')) {
			instance.hideSavePopover();
		}
	}
};

playground.init();

window.playground = playground;
window.controls = playground.controls;
});