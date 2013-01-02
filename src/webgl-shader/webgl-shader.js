YUI.add('webgl-shader', function(Y) {
	var colorProgram = null,
		textureProgram = null,

		fragmentShaderSource = [
			'precision mediump float;',

			'varying vec4 fragmentColor;',

			'#ifdef USE_TEXTURE',
				'varying vec2 vertexTextureCoordinates;',
				'uniform sampler2D sampler;',
			'#endif',

			'void main(void) {',
				'gl_FragColor = fragmentColor;',

				'#ifdef USE_TEXTURE',
					'gl_FragColor = gl_FragColor * texture2D(sampler, vertexTextureCoordinates);',
				'#endif',
			'}'
		].join('\n'),

		vertexShaderSource = [
			'attribute vec3 vertexPosition;',
			'attribute vec4 vertexColor;',

			'#ifdef USE_TEXTURE',
				'attribute vec2 textureCoordinates;',
				'varying vec2 vertexTextureCoordinates;',
			'#endif',

			'uniform mat4 projectionMatrix;',
			'uniform mat4 modelViewMatrix;',

			'varying vec4 fragmentColor;',
		
			'void main(void) {',
				'gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);',
				'fragmentColor = vertexColor;',

				'#ifdef USE_TEXTURE',
					'vertexTextureCoordinates = textureCoordinates;',
				'#endif',
			'}'
		].join('\n');
	
	var Shader = Y.namespace('Shader');

	Y.Shader = {
		compile: function(context, type, constants) {
			var shader, source;

			if (type === 'fragment') {
				shader = context.createShader(context.FRAGMENT_SHADER);
				source = fragmentShaderSource;
			}
			else if (type === 'vertex') {
				shader = context.createShader(context.VERTEX_SHADER);
				source = vertexShaderSource;
			}

			source = [constants, source].join('\n');

			context.shaderSource(shader, source);
			context.compileShader(shader);

			if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
				console.log(context.getShaderInfoLog(shader));

				return null;
			}

			return shader;		
		},

		getColorProgram: function(context) {
			if (colorProgram != null) {
				return colorProgram;
			}

			colorProgram = Y.Shader.link(context, []);

			return colorProgram;
		},

		getTextureProgram: function(context) {
			if (textureProgram != null) {
				return textureProgram;
			}

			textureProgram = Y.Shader.link(context, ['#define USE_TEXTURE']);

			textureProgram.textureCoordinatesAttribute = context.getAttribLocation(textureProgram, "textureCoordinates");
			context.enableVertexAttribArray(textureProgram.textureCoordinatesAttribute);

			textureProgram.samplerUniform = context.getUniformLocation(textureProgram, "sampler");

			return textureProgram;
		},

		link: function(context, constants) {
			var fragmentShader = Y.Shader.compile(context, 'fragment', constants),
				vertexShader = Y.Shader.compile(context, 'vertex', constants);

			var program = context.createProgram();

			context.attachShader(program, fragmentShader);
			context.attachShader(program, vertexShader);

			context.linkProgram(program);

			if (!context.getProgramParameter(program, context.LINK_STATUS)) {
				console.log("Could not link shaders");
			}

			program.vertexPositionAttribute = context.getAttribLocation(program, "vertexPosition");
			context.enableVertexAttribArray(program.vertexPositionAttribute);

			program.vertexColorAttribute = context.getAttribLocation(program, "vertexColor");
			context.enableVertexAttribArray(program.vertexColorAttribute);

			program.projectionMatrixUniform = context.getUniformLocation(program, "projectionMatrix");
			program.modelViewMatrixUniform = context.getUniformLocation(program, "modelViewMatrix");

			return program;
		}
	};
}, '1.0', {requires: ['node-base']});