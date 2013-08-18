#!/usr/bin/env node

var fs = require('fs'),
	modules = require('../js/y3d-config-modules.json'),
	content,
	gallery = [];

content = fs.readFileSync('./js/y3d-config-template.js').toString();
content = content.replace('@MODULES@', JSON.stringify(modules, null, '\t'));

fs.writeFileSync('./js/y3d.js', content);

for (module in modules) {
	if (module === 'gallery-y3d') {
		continue;
	}

	if (modules[module]['use'] !== undefined) {
		continue;
	}

	gallery.push(module);
}

content = fs.readFileSync('./js/gallery-y3d-template.js').toString();
content = content.replace(new RegExp('@GALLERY_MODULES@', 'g'), JSON.stringify(gallery, null, '\t\t\t\t\t'));

fs.writeFileSync('../gallery-y3d/build.json', content);