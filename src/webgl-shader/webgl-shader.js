YUI.add('webgl-shader', function(Y) {
	var Shader = Y.namespace('Shader');

	Shader.compile = function(context, id) {
		var node = Y.Node.one(id),
			type = node.getAttribute('type');
		
		var shader;

		if (type === 'x-shader/x-fragment') {
			shader = context.createShader(context.FRAGMENT_SHADER);
		}
		else if (type === 'x-shader/x-vertex') {
			shader = context.createShader(context.VERTEX_SHADER);
		}

		var source = node.get('text');

		context.shaderSource(shader, source);
		context.compileShader(shader);

		if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
			console.log(context.getShaderInfoLog(shader));

			return null;
		}

		return shader;		
	};

	Shader.link = function(context) {
		var fragmentShader = Shader.compile(context, '#fragment-shader'),
			vertexShader = Shader.compile(context, '#vertex-shader');

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

        program.projectionMatrixUniform = context.getUniformLocation(program, "projectionMatrix");
        program.modelViewMatrixUniform = context.getUniformLocation(program, "modelViewMatrix");

        return program;
	};
}, '1.0', {requires: ['node-base']});