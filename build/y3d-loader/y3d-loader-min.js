YUI.add("y3d-loader",function(e,t){var n=e.Lang;e.Loader=e.Base.create("loader",e.Base,[],{load:function(){var e=this,t=e.get("geometry"),n=t.get("indices"),r=t.get("vertices"),i=t.get("normals"),s=e.get("src"),o=s.split("\n"),u,a,f;for(u=0;u<o.length;u++){a=o[u].trim(),f=a.split(/\s+/);if(a.indexOf("v ")===0){var l=parseFloat(f[1],10),c=parseFloat(f[2],10),h=parseFloat(f[3],10);r.push(l,c,h)}else if(a.indexOf("f ")===0){var p=parseInt(f[1],10)-1,d=parseInt(f[2],10)-1,v=parseInt(f[3],10)-1;if(f.length===4)n.push(p,d,v);else if(f.length===5){var m=parseInt(f[4],10)-1;n.push(p,d,v,p,v,m)}}}for(u=0;u<r.length/3;u++)i.push(0,1,0);return t.set("color","blue"),t}},{ATTRS:{geometry:{value:new e.Geometry},src:{value:["# Vertex list","","v -0.5 -0.5 0.5","v -0.5 -0.5 -0.5","v -0.5 0.5 -0.5","v -0.5 0.5 0.5","v 0.5 -0.5 0.5","v 0.5 -0.5 -0.5","v 0.5 0.5 -0.5","v 0.5 0.5 0.5","","# Point/Line/Face list","","f 4 3 2 1","f 2 6 5 1","f 3 7 6 2","f 8 7 3 4","f 5 8 4 1","f 6 7 8 5"].join("\n"),validator:n.isString}}})},"0.1",{requires:["y3d-geometry-base"]});