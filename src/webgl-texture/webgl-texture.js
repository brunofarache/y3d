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
		addTexture: function(texture) {
			var instance = this,
				image = texture.get('image'),
				imageUrl = texture.get('imageUrl')
				textures = instance.get('textures');

			textures[imageUrl] = texture;

			image.onload = function() {
				instance._textureLoaded(texture);
			};

			image.src = imageUrl;
		},

		_isEmpty: function() {
			var instance = this;

			for (var imageUrl in textures) {
				if (textures.hasOwnProperty(imageUrl)) {
					return false;
				}
			}

			return true;
		},

		_textureLoaded: function(texture) {
			var instance = this,
				imageUrl = texture.get('imageUrl'),
				scene = instance.get('scene'),
				textures = instance.get('textures');

			scene.bindTexture(texture);

			delete textures[imageUrl];

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
				value: {}
			}
		}
	});
}, '1.0', {requires: ['base-build']});