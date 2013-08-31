#!/usr/bin/env node

var fs = require('fs'),
	modules = require('../js/y3d-config-modules.json'),
	content,
	gallery = [];

content = fs.readFileSync('./js/y3d-config-template.js').toString();
content = content.replace('@MODULES@', JSON.stringify(modules, null, '\t'));

fs.writeFileSync('./js/y3d.js', content);