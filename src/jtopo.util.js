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
	function MessageBus(name){
		var _self = this;
		this.name = name;
		this.messageMap = {};
		this.messageCount = 0;
		
		this.subscribe = function(topic, action){
			if(! typeof topic == 'string'){
				subscribes(topic, action);
			}else{
				var actions = _self.messageMap[topic];
				if(actions == null){
					_self.messageMap[topic] = [];
				}
				_self.messageMap[topic].push(action);
				_self.messageCount++;
			}
		};

		function subscribes(topics, action){
			var results = [];
			var counter = 0;
			for(var i=0; i<topics.length; i++){
				var topic = topics[i];
				var actions = _self.messageMap[topic];
				if(actions == null){
					_self.messageMap[topic] = [];
				}
				function actionProxy(result){
					results[i] = result;
					counter++;
					if(counter == topics.length){
						counter = 0;
						return action.apply(null, results);
					}else{
						return null;
					}
				};
				
				_self.messageMap[topic].push(actionProxy);
				_self.messageCount++;			
			}	
		};

		this.unsubscribe = function(topic){
			var actions = _self.messageMap[topic];
			if(actions != null){
				_self.messageMap[topic] = null;
				delete(_self.messageMap[topic]);
				_self.messageCount--;
			}
		};

		this.publish = function(topic, data, concurrency){
			var actions = _self.messageMap[topic];
			if(actions != null){
				for(var i=0; i<actions.length; i++){
					if(concurrency){
						(function(action, data){
							setTimeout(function(){action(data);}, 10);
						})(actions[i], data);
					}else{
						actions[i](data);
					}
				}
			}
		};
	}

	function getDistance(p1 , p2){
 		var dx = p2.x - p1.x;
		var dy = p2.y - p1.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	Array.prototype.del=function(n){ 
		if(typeof n != 'number'){
			for(var i=0; i<this.length; i++){
				if(this[i] === n){
					return this.slice(0,i).concat(this.slice(i+1,this.length));  
				}
			}
			return this;
		}else{
			if(n<0)	return this;  
			return this.slice(0,n).concat(this.slice(n+1,this.length));  
		}
	};

	if(! [].indexOf){ //IE
		Array.prototype.indexOf = function(data){
			for(var i=0; i<this.length; i++){
				if(this[i] === data) return i;
			}
			return -1;
		};
	}

	if(! window.console){ //IE
		window.console = {
			log: function(msg){},
			info: function(msg){},
			debug: function(msg){},
			warn: function(msg){},
			error: function(msg){}
		};
	}

	function mouseCoords(event){ 
		if(event.pageX || event.pageY){ 
			return {x:event.pageX, y:event.pageY}; 
		} 
		return { 
			x:event.clientX + document.body.scrollLeft - document.body.clientLeft, 
			y:event.clientY + document.body.scrollTop - document.body.clientTop 
		}; 
	}

	function getXY(box, event){
		event = event || mouseCoords(window.event); 
		var x = document.body.scrollLeft + (event.x || event.layerX);
		var y = document.body.scrollTop + (event.y || event.layerY) ;
		return {x: x-box.offset.left, y: y-box.offset.top};
	}

	function rotatePoint(bx, by, x, y, angle){
		var dx = x - bx;
		var dy = y - by;
		var r = Math.sqrt(dx * dx + dy * dy);
		var a = Math.atan2(dy , dx) + angle;
		return {
			x: bx + Math.cos(a)*r, 
			y: by + Math.sin(a)*r
		};
	}

	function rotatePoints(target, points, angle){
		var result = [];
		for(var i=0; i<points.length; i++){
			var p = rotatePoint(target.x, target.y, points[i].x, points[i].y, angle);
			result.push(p);
		}
		return result;
	}

	function $foreach(datas, f, dur){
	   if(datas.length == 0) return;
	   var n = 0;
	   function doIt(n){
		 if(n == datas.length) return;
		 f(datas[n]);
		 setTimeout(function(){doIt(++n)}, dur);
	   }
	   doIt(n);
	}

	function $for(i, m, f, dur){
	   if(m < i) return;
	   var n = 0;
	   function doIt(n){
		 if(n == m) return;
		 f(m);
		 setTimeout(function(){doIt(++n)}, dur);
	   }
	   doIt(n);
	}

	JTopo.util = {
		rotatePoint : rotatePoint,
		rotatePoints : rotatePoints,
		getDistance : getDistance,
		getXY: getXY,
		mouseCoords: mouseCoords,
		MessageBus: MessageBus
	};
	window.$for = $for;
	window.$foreach = $foreach;
})(JTopo);
