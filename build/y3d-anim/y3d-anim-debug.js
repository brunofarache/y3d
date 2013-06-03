YUI.add('y3d-anim', function (Y, NAME) {

var requestAnimFrame =
	window.requestAnimationFrame		||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

function WebGLAnim(scene, animationFn, debugFn) {
	this.scene = scene;
	this.animationFn = animationFn;
	this.debugFn = debugFn;
}

WebGLAnim.prototype = {
	start: function() {
		this.animationFn();
		this.scene.render();
		
		if (this.debugFn) {
			this.last = this.now;
			this.now = (new Date()).getTime();

			var elapsed = this.now - this.last;

			this.debugFn(parseInt(1000 / elapsed, 10));
		}

		requestAnimFrame(Y.bind(this.start, this));
	}
};

Y.WebGLAnim = WebGLAnim;

}, '0.1');
