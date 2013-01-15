YUI.add('webgl-shader', function(Y) {
	var colorProgram = null,
		textureProgram = null,

		fragmentShaderSource = [
			'precision mediump float;',

			'varying vec4 fragmentColor;',
			'varying vec3 lightWeight;',

			'#ifdef USE_TEXTURE',
				'varying vec2 vertexTextureCoordinates;',
				'uniform sampler2D sampler;',
			'#endif',

			'void main(void) {',
				'gl_FragColor = fragmentColor;',

				'#ifdef USE_TEXTURE',
					'gl_FragColor = gl_FragColor * texture2D(sampler, vertexTextureCoordinates);',
				'#endif',

				'#ifdef USE_LIGHT',
					'gl_FragColor = vec4(gl_FragColor.rgb * lightWeight, gl_FragColor.a);',
				'#endif',
			'}'
		].join('\n'),

		vertexShaderSource = [
			'attribute vec3 vertexPosition;',
			'attribute vec4 vertexColor;',
			'attribute vec3 vertexNormal;',

			'#ifdef USE_TEXTURE',
				'attribute vec2 textureCoordinates;',
				'varying vec2 vertexTextureCoordinates;',
			'#endif',

			'uniform mat4 projectionMatrix;',
			'uniform mat4 modelViewMatrix;',
			'uniform mat3 normalMatrix;',

			'varying vec4 fragmentColor;',
			'varying vec3 lightWeight;',
		
			'void main(void) {',
				'gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);',

				'fragmentColor = vertexColor;',

				'#ifdef USE_TEXTURE',
					'vertexTextureCoordinates = textureCoordinates;',
				'#endif',

				'#ifdef USE_LIGHT',
					'vec3 lightColor = vec3(0.8, 0.8, 0.8);',
					'vec3 lightDirection = vec3(0.25, 2, -1.0);',
					'vec3 ambientLightColor = vec3(1.0, 1.0, 1.0);',

					'vec3 transformedNormal = normalMatrix * vertexNormal;',
					'float directionalLightWeight = max(dot(transformedNormal, lightDirection), 0.0);',

					'lightWeight = ambientLightColor + lightColor * directionalLightWeight;',
				'#else',
					'lightWeight = vec3(1.0, 1.0, 1.0);',
					'vertexNormal;',
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

			constants = constants.join('\n');
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

			textureProgram = Y.Shader.link(context, ['#define USE_TEXTURE', '#define USE_LIGHT']);

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

			program.vertexNormalAttribute = context.getAttribLocation(program, "vertexNormal");
			context.enableVertexAttribArray(program.vertexNormalAttribute);

			program.projectionMatrixUniform = context.getUniformLocation(program, "projectionMatrix");
			program.modelViewMatrixUniform = context.getUniformLocation(program, "modelViewMatrix");
			program.normalMatrixUniform = context.getUniformLocation(program, "normalMatrix");

			return program;
		}
	};
}, '1.0', {});