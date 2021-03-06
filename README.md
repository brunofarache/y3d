# y3d

YUI3 WebGL module.

## [Demos](http://brunofarache.github.io/y3d)

Check out the **[playground page](http://brunofarache.github.io/y3d)**, it contains some examples. Click on the `Examples` button to load more scripts and learn how to use y3d.

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

Create a scene and add a 3D object to it:

``` javascript
YUI().use('y3d-scene', 'y3d-camera', 'y3d-geometry-box', function(Y) {
	var scene = new Y.Scene({
		camera: new Y.Camera({
			position: {
				z: 20
			}
		}),

		background: '#272822'
	});

	var box = new Y.Box({
		color: '#ff7700'
	});

	box.set('rotation', { x: 45, y: 45 });

	scene.add(box);

	scene.render();
});
```

## License

Code is under [YUI BSD License](http://yuilibrary.com/license).
