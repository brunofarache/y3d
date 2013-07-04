# y3d

This is a YUI3 WebGL module.

## Getting Started

Import YUI3:

``` html
<script src="http://yui.yahooapis.com/3.10.3/build/yui/yui-min.js"></script>
```

Import y3d:

``` html
<script src="http://brunofarache.github.io/y3d/build/y3d/y3d.js"></script>
```

Add a `<canvas>` element to your page:

``` html
<canvas id='y3d'></canvas>
```

Create scene and camera objects and add an object to your scene:

``` javascript
YUI().use('y3d-scene', 'y3d-camera', 'y3d-geometry-box', function(Y) {
	var scene = new Y.Scene({
		camera: new Y.Camera({
			z: 20
		}),

		background: '#272822'
	});

	var box = new Y.Box({
		color: '#ff7700'
	});

	box.rotate('xy', 45);

	scene.add(box);

	scene.render();
});
```

## License

Code is under [MIT](http://mit-license.org) license.
