window.YUI_config = {
    groups: {
        y3d: {
            base: location.origin + '/y3d/build/',
            combine: false,
            modules: {
	"y3d-anim": {},
	"y3d-camera": {
		"requires": [
			"base-build",
			"event-key",
			"event-mousewheel"
		]
	},
	"y3d-color": {
		"requires": [
			"color"
		]
	},
	"y3d-geometry": {
		"use": [
			"y3d-geometry-base",
			"y3d-geometry-box",
			"y3d-geometry-cylinder",
			"y3d-geometry-plane",
			"y3d-geometry-sphere",
			"y3d-geometry-triangle"
		]
	},
	"y3d-geometry-base": {
		"requires": [
			"base-build",
			"y3d-texture"
		]
	},
	"y3d-geometry-box": {
		"requires": [
			"y3d-geometry-base"
		]
	},
	"y3d-geometry-cylinder": {
		"requires": [
			"y3d-geometry-base"
		]
	},
	"y3d-geometry-plane": {
		"requires": [
			"y3d-geometry-base"
		]
	},
	"y3d-geometry-sphere": {
		"requires": [
			"y3d-geometry-base"
		]
	},
	"y3d-geometry-triangle": {
		"requires": [
			"y3d-geometry-base"
		]
	},
	"y3d-light": {
		"requires": [
			"base-build",
			"y3d-color"
		]
	},
	"y3d-picker-plugin": {
		"requires": [
			"plugin"
		]
	},
	"y3d-scene": {
		"requires": [
			"base-build",
			"base-pluginhost",
			"node-base",
			"y3d-camera",
			"y3d-color",
			"y3d-shader"
		]
	},
	"y3d-shader": {},
	"y3d-texture": {
		"requires": [
			"base-build"
		]
	}
}
       }
    }
};