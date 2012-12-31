YUI.add('webgl-texture', function(Y) {
	var Lang = Y.Lang;

	Y.Texture = Y.Base.create('texture', Y.Base, [], {
	}, {
		ATTRS: {
			image: {
				value: new Image()
			},

			imageUrl: {
				value: '',
				validator: Lang.isString
			},

			webglTexture: {
				value: null
			}
		}
	});

	Y.TextureLoader = Y.Base.create('texture-loader', Y.Base, [], {
		initializer: function() {
			var instance = this,
				textures = instance.get('textures'),
				unloadedTextures = instance.get('unloadedTextures');

			for (var i = 0; i < textures.length; i++) {
				var texture = textures[i],
					image = texture.get('image'),
					imageUrl = texture.get('imageUrl');

				unloadedTextures[imageUrl] = texture;

				image.onload = function() {
					instance._textureLoaded(texture);
				};

				image.src = imageUrl;
			}
		},

		_isEmpty: function() {
			var instance = this,
				unloadedTextures = instance.get('unloadedTextures');

			for (var imageUrl in unloadedTextures) {
				if (unloadedTextures.hasOwnProperty(imageUrl)) {
					return false;
				}
			}

			return true;
		},

		_textureLoaded: function(texture) {
			var instance = this,
				imageUrl = texture.get('imageUrl'),
				scene = instance.get('scene'),
				unloadedTextures = instance.get('unloadedTextures');

			scene.bindTexture(texture);

			delete unloadedTextures[imageUrl];

			if (instance._isEmpty()) {
				scene.render();
			}
		}
	}, {
		ATTRS: {
			scene: {
				value: null
			},

			textures: {
				value: [],
				validator: Lang.isArray
			},

			unloadedTextures: {
				value: {}
			}
		}
	});
}, '1.0', {requires: ['base-build']});