Y.Program = function(context) {
	this.context = context;
	this.program = context.createProgram();
};

Y.Program.prototype = {
	attrs: {
	},

	uniforms: {
	},

	link: function(vertexShader, fragmentShader) {
		var instance = this,
			context = instance.context,
			program = instance.program;

		context.attachShader(program, vertexShader);
		context.attachShader(program, fragmentShader);

		context.linkProgram(program);

		if (!context.getProgramParameter(program, context.LINK_STATUS)) {
			console.error('Error while linking shaders.');

			return;
		}
	},

	setAttr: function(input) {
		var instance = this,
			context = instance.context,
			program = instance.program,
			name = input.name;

		program.attrs[name] = context.getAttribLocation(program, name);
		context.enableVertexAttribArray(program.attrs[name]);
	},

	setUniform: function(input) {
		var instance = this,
			context = instance.context,
			program = instance.program,
			name = input.name;

		program.uniforms[name] = context.getUniformLocation(program, name);
	}
};

var Variables = {
	ID: {
		ATTRIBUTE: 'attribute',
		UNIFORM: 'uniform',
		VARYING: 'varying'
	},

	TYPES: {
		MAT4: 'mat4',
		SAMPLER2D: 'sampler2D',
		VEC2: 'vec2',
		VEC3: 'vec3',
		VEC4: 'vec4'
	}
};

Y.Shader = function(context, type) {
	this.context = context;
	this.shader = context.createShader(type);
};

Y.Shader.prototype = {
	compile: function(source) {
		var instance = this,
			context = instance.context,
			shader = instance.shader;

		context.shaderSource(shader, source);
		context.compileShader(shader);

		if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
			console.error('Error while compiling shader.', context.getShaderInfoLog(shader));

			return;
		}
	}
};

Y.Shader.TEMPLATES = {
	VERTEX: {
		BASIC: [
			'{{% Y.Array.each(this.variables, function(variable) { %}}',
			'	{{{ variable.id }}} {{{ variable.type }}} {{{ variable.name }}};',
			'{{% }); %}}',

			'void main(void) {',
			'	gl_Position = projection * modelViewMatrix * vec4(position, 1.0);',

				'{{% Y.Array.each(this.assigns, function(assign) { %}}',
				'	{{{ assign }}}',
				'{{% }); %}}',
			'}'
		].join('\n')
	}
};

Y.Shader.Builder = {
	compile: function(source, data) {
		Y.mix(Y.Template.Micro.options, {
			code: /\{\{%([\s\S]+?)%\}\}/g,
			escapedOutput: /\{\{(?!%)([\s\S]+?)\}\}/g,
			rawOutput: /\{\{\{([\s\S]+?)\}\}\}/g
		}, true);

		var template = new Y.Template();

		var data = {
			variables: [
				{ name: 'position', id: Variables.ID.ATTRIBUTE, type: Variables.TYPES.VEC3 },
				{ name: 'projection', id: Variables.ID.UNIFORM, type: Variables.TYPES.MAT4 },
				{ name: 'modelViewMatrix', id: Variables.ID.UNIFORM, type: Variables.TYPES.MAT4 },
				{ name: 'colorVarying', id: Variables.ID.VARYING, type: Variables.TYPES.VEC4 }
			],

			assigns: []
		};

		// console.log(template.render(source, data));

		data.variables.push({ name: 'textureVarying', id: Variables.ID.VARYING, type: Variables.TYPES.VEC2 });

		Y.Array.each(data.variables, function(variable) {
			if (variable.id !== Variables.ID.VARYING) {
				return;
			}

			var name = variable.name.slice(0, -7);

			data.variables.push({ name: name, id: Variables.ID.ATTRIBUTE, type: variable.type });
			data.assigns.push(variable.name + ' = ' + name + ';');
		});

		console.log(template.render(source, data));
	}
};