YUI.add('webgl-shader', function(Y) {
	var fragmentShaderSource = [
		'precision mediump float;',
		'',
		'varying vec4 fragmentColor;',
		'varying vec2 vertexTextureCoordinates;',
		'',
		'uniform sampler2D sampler;',
		'',
		'void main(void) {',
		'	gl_FragColor = texture2D(sampler, vec2(vertexTextureCoordinates.s, vertexTextureCoordinates.t));',
		'}'
	].join('\n');

	var vertexShaderSource = [
		'attribute vec3 vertexPosition;',
		'attribute vec4 vertexColor;',
		'attribute vec2 textureCoordinates;',
		'',
		'uniform mat4 projectionMatrix;',
		'uniform mat4 modelViewMatrix;',
		'',
		'varying vec4 fragmentColor;',
		'varying vec2 vertexTextureCoordinates;',
		'',
		'void main(void) {',
		'	gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);',
		'	fragmentColor = vertexColor;',
		'	vertexTextureCoordinates = textureCoordinates;',
		'}'
	].join('\n');
	
	var Shader = Y.namespace('Shader');

	Shader.compile = function(context, type) {
		var shader, source;

		if (type === 'fragment') {
			shader = context.createShader(context.FRAGMENT_SHADER);
			source = fragmentShaderSource;
		}
		else if (type === 'vertex') {
			shader = context.createShader(context.VERTEX_SHADER);
			source = vertexShaderSource;
		}

		context.shaderSource(shader, source);
		context.compileShader(shader);

		if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
			console.log(context.getShaderInfoLog(shader));

			return null;
		}

		return shader;		
	};

	Shader.link = function(context) {
		var fragmentShader = Shader.compile(context, 'fragment'),
			vertexShader = Shader.compile(context, 'vertex');

		var program = context.createProgram();

		context.attachShader(program, fragmentShader);
		context.attachShader(program, vertexShader);

		context.linkProgram(program);

		if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            console.log("Could not link shaders");
        }

        context.useProgram(program);

        program.vertexPositionAttribute = context.getAttribLocation(program, "vertexPosition");
        context.enableVertexAttribArray(program.vertexPositionAttribute);

        program.vertexColorAttribute = context.getAttribLocation(program, "vertexColor");
    	context.enableVertexAttribArray(program.vertexColorAttribute);

    	program.textureCoordinatesAttribute = context.getAttribLocation(program, "textureCoordinates");
        context.enableVertexAttribArray(program.textureCoordinatesAttribute);

        program.projectionMatrixUniform = context.getUniformLocation(program, "projectionMatrix");
        program.modelViewMatrixUniform = context.getUniformLocation(program, "modelViewMatrix");
        program.samplerUniform = context.getUniformLocation(program, "sampler");

        return program;
	};
}, '1.0', {requires: ['node-base']});