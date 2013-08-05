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

	function DataBox(name, canvas) {
		this.name = name;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.messageBus = new JTopo.util.MessageBus();
		this.image = new Image();
		this.image.src = './img/bg.jpg';
		this.init();
	};

	DataBox.prototype.init = function(){
		this.ctx.shadowBlur = 5;
		this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
		this.ctx.shadowOffsetX = 3;
		this.ctx.shadowOffsetY = 6;

		this.startDragMouseX = 0;
		this.startDragMouseY = 0;
		this.offset = $(canvas).offset();
		this.isRangeSelectable = true;

		this.elements = [];
		this.containers = [];
		this.links = [];
		this.nodes = [];
		this.elementMap = {};
		this.selectedElements = [];

		var box = this;
		this.canvas.onmousedown = function(event){
			box.isMousedown = true;
			box.mousedown(event);
		};
		this.canvas.onmousemove = function(event){
			box.mousemove(event);
		};
		this.canvas.onmouseup = function(event){
			box.isMousedown = false;
			box.mouseup(event);
		};
		try{// IE !!
			window.addEventListener('keydown', function(e){
				box.keydown(e);
			},true);
			window.addEventListener('keyup', function(e){
				box.keyup(e);
			},true);
		}catch(e){}
		
		setTimeout(function(){box.updateView()}, 300);
	};

	DataBox.prototype.getElementByXY = function(x,y){
		var e = null;
		for (var i = this.nodes.length-1; i >= 0 ; i--) {
			var node = this.nodes[i];
			if (x > node.x && x < node.x + node.width && y > node.y && y < node.y + node.height) {
				e = node;
				break;
			}
		}
		if (! e) {
			for (var i = this.containers.length-1; i >=0 ; i--) {
				var group = this.containers[i];
				if (x > group.x && x < group.x + group.width && y > group.y && y < group.y + group.height) {
					e = group;					
					break;
				}
			}
		}
		return e;
	};

	DataBox.prototype.getElementByName = function(name){
		for (var i = this.nodes.length-1; i >= 0 ; i--) {
			if(this.nodes[i].getName() == name){
				return this.nodes[i];
			}
		}
		return null;
	};

	DataBox.prototype.findCloserNode = function (node, cond){
		var min = {distance: Number.MAX_VALUE, node:null};
		for (var i = this.nodes.length-1; i >=0 ; i--) {
			var typeNode = this.nodes[i];
			if(typeNode === node) continue;
			if(cond(typeNode) == true){
				var dist = JTopo.util.getDistance(node, typeNode);
				if(dist < min.distance){
					min.node = typeNode;
					min.distance = dist;
				}
			}
		}
		return min.node;
	};

	DataBox.prototype.cancleAllSelected = function(){
		for (var i = 0; i < this.selectedElements.length; i++) {
			this.selectedElements[i].cancleSelected();
		}
		this.selectedElements = [];
	};

	DataBox.prototype.mousedown = function(event){
		var box = this;
		var xy = JTopo.util.getXY(box, event);
		var x = xy.x;
		var y = xy.y;
		
		var selectedNode = box.getElementByXY(x, y);
		if(selectedNode != null){
			selectedNode.onMousedown({x:x, y:y, context:box});
			box.currElement = selectedNode;
		}else if(box.currElement){
			box.currElement.cancleSelected();
			box.currElement = null;
		}

		box.startDragMouseX = x;
		box.startDragMouseY = y;

		if (box.currElement) {
			if(box.selectedElements.indexOf(box.currElement) == -1){
				box.cancleAllSelected();
				box.selectedElements.push(box.currElement);
			}
		}else{
			box.cancleAllSelected();
		}

		for (var i = 0; i < box.selectedElements.length; i++) {
			var node = box.selectedElements[i];
			node.selectedLocation = {x: node.x, y:node.y};
		}

		box.isOnMouseDown = true;
		box.publish('mousedown', {target:box.currElement, x: x, y:y, context:box});
	};

	DataBox.prototype.mousemove = function(event){
		var box = this;
		var xy = JTopo.util.getXY(box, event);
		var x = xy.x;
		var y = xy.y;
		var dx = (x - box.startDragMouseX);
		var dy = (y - box.startDragMouseY);
		box.publish('mousemove', {target:box.currElement, x: x, y:y,dx: dx, dy:dy, context:box});

		//if(box.currElement && !box.currElement.isDragable()) return;

		box.updateView();
		for (var i = this.nodes.length-1; i >= 0 ; i--) {
			var node = this.nodes[i];
			if(node.x + node.width < 0 || node.x > box.canvas.width) continue;

			if (x > node.x && x < node.x + node.width && y > node.y && y < node.y + node.height) {
				node.onMouseover({x: x, y: y, dx:dx, dy:dy, context:box});
				box.publish('mouseover', {target:node, x: x, y:y,dx: dx, dy:dy, context:box});
			}else{
				if(node.isOnMousOver){
					node.onMouseout({x: x, y: y, dx:dx, dy:dy, context:box});
					box.publish('mouseout', {target:node, x: x, y:y,dx: dx, dy:dy, context:box});
				}
			}
		}

		if(box.currElement && box.isOnMouseDown && box.currElement.isDragable()){
			for (var i = 0; i < box.selectedElements.length; i++) {
				var node = box.selectedElements[i];
				node.onMousedrag({x:x, y:y, dx:dx, dy:dy, context: box});
			}
			box.publish('mousedrag', {target:box.currElement, x: x, y:y});
		}else if(box.isOnMouseDown && box.isRangeSelectable) {
			var startx = x >= box.startDragMouseX ? box.startDragMouseX : x;
			var starty = y >= box.startDragMouseY ? box.startDragMouseY : y;
			var width = Math.abs(x-box.startDragMouseX);
			var height = Math.abs(y-box.startDragMouseY);

			box.ctx.beginPath();
			box.ctx.fillStyle = 'rgba(168,202,236,0.5)';
			box.ctx.fillRect(startx, starty, width, height);					
			box.ctx.closePath();

			for (var i = 0; i < box.nodes.length; i++) {
				var node = box.nodes[i];
				if(node.x + node.width < 0 || node.x > box.canvas.width) continue;

				if (node.x > startx && node.x+node.width < startx + width){
					if(node.y > starty && node.y+ node.height < starty + height) {
						node.onMouseselected({x:x, y:y, dx: dx, dy:dy, context:box});
						box.selectedElements.push(node);
					}
				}else{
					node.cancleSelected();
				}
			}
		}
	};

	DataBox.prototype.mouseup = function(event){
		var box = this;
		var xy = JTopo.util.getXY(this, event);
		var x = xy.x;
		var y = xy.y;
		var dx = (x - box.startDragMouseX);
		var dy = (y - box.startDragMouseY);

		box.publish('mouseup', {target:box.currElement, x: x, y:y, dx:dx, dy:dy, context:box});
		box.startDragMouseX = null;
		
		if(box.currElement){
			box.currElement.onMouseup({x:x, y:y, context: box, dx:dx, dy:dy});
		}

		box.updateView();
		box.isOnMouseDown = false;
	};

	DataBox.prototype.keydown = function(e){
		var box = this;
		var keyID = e.keyCode ? e.keyCode :e.which;
		box.publish('keydown', keyID);
		box.updateView();
		return;

		if(keyID === 17){ // Ctrl
		}
		if(keyID === 18) {// Alt 
		}
		if(keyID === 16) { // Shift
		} 
		if(keyID === 27){ // Esc
			this.cancleAllSelected();
			this.currElement = null;
		}
		if(keyID === 38 || keyID === 87)  { // up arrow and W 
			if(this.currElement){
				this.currElement.y -= 5;
			}
		}  
		if(keyID === 39 || keyID === 68)  { // right arrow and D  
			if(this.currElement){
				this.currElement.x += 5;
			}        
		}  
		if(keyID === 40 || keyID === 83)  { // down arrow and S  
			if(this.currElement){
				this.currElement.y += 5;
			}
		}  
		if(keyID === 37 || keyID === 65)  { // left arrow and A  
			if(this.currElement){
				this.currElement.x -= 5;
			}
		} 
		box.updateView();
	};

	DataBox.prototype.keyup = function(e){
		var box = this;
		var keyID = e.keyCode ? e.keyCode :e.which;
		box.publish('keyup', keyID);
		box.updateView();
	};

	DataBox.prototype.subscribe = function(topic, action){
		this.messageBus.subscribe(topic, action);
		return this;
	};

	DataBox.prototype.publish = function(topic, msg){
		this.messageBus.publish(topic, msg);
		return this;
	};

	DataBox.prototype.removeElementById = function (id) {
		for(var i=0; i<this.elements.length; i++){
			if(this.elements[i].id == id){
				this.remove(i);
				break;
			}
		}
	};

	DataBox.prototype.remove = function (e) {
		this.elements = this.elements.del(e);
		this.containers = this.containers.del(e);
		this.links = this.links.del(e);
		this.nodes = this.nodes.del(e);
		this.elementMap[e.id] = e;
	};

	DataBox.prototype.addElement = function (e) {
		return this.add(e);
	};

	DataBox.prototype.add = function (e) {
		if(this.elementMap[e.id] != null){
			return ;
		}
		if(! e.id) e.id = $.now();
		if(! e.z) e.z = this.elements.length;
		this.elements.push(e);

		if(e instanceof JTopo.Container) {
			this.containers.push(e);
		}else if (e instanceof JTopo.Link) {
			this.links.push(e);
		}else if (e instanceof JTopo.Node) {
			this.nodes.push(e);
		}
		this.elementMap[e.id] = e;
	};

	DataBox.prototype.clear = function () {
		this.elements = [];
		this.links = [];
		this.nodes = [];
		this.containers = [];
		this.elementMap = {};
	};

	DataBox.prototype.getChilds = function(node){
		var result = [];
		for(var i=0; i<this.links.length; i++){
			if(this.links[i].nodeA === node){
				result.push(this.links[i].nodeB);
			}
		}
		return result;
	};

	DataBox.prototype.getNodesBound = function(nodes){
		var bound = {x: 10000000, y:1000000, width:0, height:0};
		if(nodes.length > 0){
			var minX = 10000000;
			var maxX = -10000000;
			var minY = 10000000;
			var maxY = -10000000;
			var width = maxX - minX;
			var height = maxY - minY;
			for (var i = 0; i < nodes.length; i++) {
				var item = nodes[i];
				if (item.x <= minX) {
					minX = item.x;
				}
				if (item.x >= maxX) {
					maxX = item.x;
				}
				if (item.y <= minY) {
					minY = item.y;
				}
				if (item.y >= maxY) {
					maxY = item.y;
				}
				width = maxX - minX + item.width;
				height = maxY - minY + item.height;
			}
			
			bound.x = minX;
			bound.y = minY;
			bound.width = width;
			bound.height = height;
			return bound;
		}
		return null;
	};

	DataBox.prototype.isAllChildIsEndpoint = function(node){
		var childs = this.getChilds(node);
		for(var i=0; i<childs.length; i++){
			var grandsons = this.getChilds(childs[i]);
			if(grandsons.length > 0) return false;
		}
		return true;
	};

	DataBox.prototype.getBoundRecursion = function(node){
		var childs = this.getChilds(node);
		if(childs.length == 0 ) return node.getBound();
		return this.getNodesBound(childs);
	};

	DataBox.prototype.layoutNode = function(node){
		var childs = this.getChilds(node);
		if(childs.length == 0) return node.getBound();

		this.adjustPosition(node);
		if(this.isAllChildIsEndpoint(node)){
			return null;
		}
		for(var i=0; i<childs.length; i++){
			this.layoutNode(childs[i]);
		}	
		return null;
	};

	DataBox.prototype.adjustPosition = function(node){
		var childs = this.getChilds(node);
		var layout = node.layout;
		var type = layout.type;
		var points = null;
		if(type == 'star'){
			points = JTopo.Layout.getStarPositions(node.x, node.y, childs.length, node.layout.radius, 
												   node.layout.beginDegree, node.layout.endDegree);
		}else if(type == 'tree'){
			points = JTopo.Layout.getTreePositions(node.x, node.y, childs.length, layout.width, 
												   layout.height, layout.direction);
		}
		for(var i=0; i<childs.length; i++){
			childs[i].setLocation(points[i].x, points[i].y);
		}
	};

	DataBox.prototype.getParents = function(node){
		var result = [];
		for(var i=0; i<this.links.length; i++){
			if(this.links[i].nodeB === node){
				result.push(this.links[i].nodeA);
			}
		}
		return result;
	};

	DataBox.prototype.updateView = function () {
		var box = this;
		var nodes = this.nodes;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if(this.image != null){
			this.ctx.drawImage(this.image , 0, 0);
		}

		for (var i = 0; i < this.links.length; i++) {
			var link = this.links[i];
			if(link.nodeA.x+link.nodeA.width < 0 || link.nodeA.x > box.canvas.width) continue;
			if(link.nodeB.x+link.nodeA.width < 0 || link.nodeB.x > box.canvas.width) continue;

			link.draw(this.ctx);
		}

		for (var i = 0; i < this.containers.length; i++) {
			var c = this.containers[i];
			if(c.x + c.width < 0 || c.x > box.canvas.width) continue;

			this.containers[i].draw(this.ctx);
		}

		for (var i = 0; i < this.nodes.length; i++) {
			if(this.nodes[i].x + this.nodes[i].width < 0 || this.nodes[i].x > box.canvas.width) continue;
			this.nodes[i].draw(this.ctx);
		}
	};

	JTopo.DataBox = DataBox;
})(JTopo);
