YUI.add("y3d-anim",function(e,t){function r(e,t,n){this.scene=e,this.animationFn=t,this.debugFn=n}var n=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)};r.prototype={start:function(){this.animationFn(),this.scene.render();if(this.debugFn){this.last=this.now,this.now=(new Date).getTime();var t=this.now-this.last;this.debugFn(parseInt(1e3/t,10))}n(e.bind(this.start,this))}},e.WebGLAnim=r},"0.1");