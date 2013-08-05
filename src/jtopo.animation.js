/*
 * JTopo (Javascript topology libraries) 0.2.0
 * https://github.com/wondery/jtopo
 * 
 * Copyright (c) 2013 wondery
 * Released under the LGPL license, Version 3.0
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Author: wondery
 * Email: jtopology@163.com
 */

(function(JTopo){
	var isStopAll = false;

	//gravity
	function gravity(node, option){
		var box = option.context;
		var gravity = option.gravity || 0.1;
		
		var t = null;
		var effect = {};
		
		function stop(){
			window.clearInterval(t);
			if(effect.onStop){
				effect.onStop(node);
			}
			return effect;
		}

		function run(){
			var dx = option.dx || 0, dy = option.dy || 2;
			t = setInterval(function(){
				if(isStopAll){
					effect.stop();
					return;
				}
				dy += gravity;
				if(node.y + node.height < box.canvas.height){
					node.setLocation(node.x + dx, node.y + dy);
					box.updateView();
				}else{
					dy = 0;	
					stop();
				}
			}, 20);
			return effect;
		}

		effect.run = run;
		effect.stop = stop;
		effect.onStop = function(f){ effect.onStop = f; return effect;};
		return effect;
	}

	//
	function rotate(node, option){
		var box = option.context;
		var t = null;
		var effect = {};
		var v = option.v;
		
		function run(){
			t = setInterval(function(){
				if(isStopAll){
					effect.stop();
					return;
				}
				node.rotate += v || 0.2;
				if(node.rotate>2*Math.PI){
					node.rotate = 0;
				}
				box.updateView();
			}, 100);
			return effect;
		}
		function stop(){
			window.clearInterval(t);
			if(effect.onStop){
				effect.onStop(node);
			}
			return effect;
		}

		effect.run = run;
		effect.stop = stop;
		effect.onStop = function(f){ effect.onStop = f; return effect;};
		return effect;
	}

	//
	function dividedTwoPiece(node, option){
		var box = option.context;
		var style = node.style;
		var effect = {};

		function genNode(x, y, r, beginDegree, endDegree){
			var newNode = new JTopo.Node();
			newNode.setImage(node.image);
			newNode.setSize(node.width, node.height);
			newNode.setLocation(x, y);
			newNode.draw = function(ctx){
				ctx.save();
				ctx.arc(this.x+this.width/2, this.y+this.height/2, r, beginDegree, endDegree);
				ctx.clip();
				ctx.beginPath();
				if(this.image != null){	
					ctx.drawImage(this.image, this.x, this.y);
				}else{
					ctx.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.alpha + ')';
					ctx.rect(this.x, this.y, this.width, this.height);
					ctx.fill();
				}
				ctx.closePath();
				ctx.restore();
			};
			return newNode;
		};

		function split(angle, box){
			var beginDegree = angle;
			var endDegree = angle + Math.PI;

			var node1 = genNode(node.x, node.y , node.width, beginDegree, endDegree);
			var node2 = genNode(node.x- 2 + Math.random()*4, node.y , node.width, beginDegree + Math.PI, beginDegree);

			node.setVisible(false);

			box.add(node1);
			box.add(node2);
			box.updateView();

			JTopo.Animation.gravity(node1, {context:box, dx:0.3}).run().onStop(function(n){
				box.remove(node1);
				box.remove(node2);
				box.updateView();
				effect.stop();
			});
			JTopo.Animation.gravity(node2, {context:box, dx:-0.2}).run();
		}

		function run(){	
			split(option.angle, box);
			return effect;
		}
		function stop(){	
			if(effect.onStop){
				effect.onStop(node);
			}
			return effect;
		}

		effect.onStop = function(f){ effect.onStop = f; return effect;};
		effect.run = run;
		effect.stop = stop;
		return effect;
	}

	function repeatThrow(node, option){
		var gravity = 0.8;
		var wind = 2;
		var angle = 0;
		var box = option.context;
		node.isSelected = function(){ return false;	};
		node.isFocus = function(){return false;	};
		node.setDragable(false);

		function initNode(node){
			node.setVisible(true);
			node.rotate = Math.random();
			var w = box.canvas.width/2;
			node.x = w + Math.random() * (w - 100)  -   Math.random() * (w - 100);
			node.y = box.canvas.height;
			node.vx = Math.random() * 5 - Math.random() * 5;
			node.vy =  -25;
		}

		var t = null;
		var effect = {};
		function run(){				
			initNode(node);
			t = setInterval(function(){
				if(isStopAll){
					effect.stop();
					return;
				}
				node.vy += gravity;
				node.x += node.vx;
				node.y += node.vy;
				if(node.x < 0 || node.x >box.canvas.width || node.y>box.canvas.height){
					if(effect.onStop){
						effect.onStop(node);
					}
					initNode(node);
				}
				box.updateView();
			}, 50);
			return effect;
		}
		function stop(){
			window.clearInterval(t);
		}

		effect.onStop = function(f){ effect.onStop = f; return effect;};
		effect.run = run;
		effect.stop = stop;
		return effect;
	}

	function stopAll(){
		isStopAll = true;
	}

	function startAll(){
		isStopAll = false;
	}

	
	//cycle
	function cycle(node, option){
		var p1 = option.p1;
		var p2 = option.p2;
		var box = option.context;

		var midX = p1.x + (p2.x - p1.x)/2;
		var midY = p1.y + (p2.y - p1.y)/2;
		var r = JTopo.util.getDistance(p1, p2)/2;

		var angle = Math.atan2(midY, midX);
		var speed = option.speed || 0.2;
		var effect = {};
		var t = null;
		function run(){
			t = setInterval(function(){
				if(isStopAll){
					effect.stop();
					return;
				}
				//var newx = p1.x + midX + Math.cos(angle) * r;
				var newy = p1.y + midX + Math.sin(angle) * r;
				node.setLocation(node.x,newy);
				box.updateView();
				angle += speed;
			}, 100);	
			return effect;
		}
		function stop(){
			window.clearInterval(t);
		}
		
		effect.run = run;
		effect.stop = stop;
		return effect;
	}

	//move
	function move(node, option){
		var p = option.position;
		var box = option.context;
		var easing = option.easing || 0.2;

		var effect = {};
		var t = null;
		function run(){
			t = setInterval(function(){
				if(isStopAll){
					effect.stop();
					return;
				}
				var dx = p.x - node.x;
				var dy = p.y - node.y;
				var vx = dx * easing;
				var vy = dy * easing;
				
				node.x += vx;
				node.y += vy;
				box.updateView();
				if(vx < 0.01 && vy<0.1){
					stop();
				}
			}, 100);	
			return effect;
		}
		function stop(){
			window.clearInterval(t);
		}
		effect.onStop = function(f){ effect.onStop = f; return effect;};
		effect.run = run;
		effect.stop = stop;
		return effect;
	}

	//scala
	function scala(node, option){
		var p = option.position;
		var box = option.context;
		var scala = option.scala || 1;
		var v = 0.06;
		var oldScala = node.scala;

		var effect = {};
		var t = null;
		function run(){
			t = setInterval(function(){				
				node.scala += v;

				if(node.scala >= scala){
					stop();
				}
				box.updateView();
			}, 100);	
			return effect;
		}
		function stop(){
			if(effect.onStop){
				effect.onStop(node);
			}
			node.scala = oldScala;
			window.clearInterval(t);
		}
		effect.onStop = function(f){ effect.onStop = f; return effect;};
		effect.run = run;
		effect.stop = stop;
		return effect;
	}

	JTopo.Animation = {
		gravity : gravity,
		dividedTwoPiece : dividedTwoPiece,
		repeatThrow: repeatThrow,
		rotate: rotate,
		cycle: cycle,
		move: move,
		scala: scala,
		stopAll: stopAll,
		startAll: startAll
	};
})(JTopo);
