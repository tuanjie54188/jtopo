
//round
function basic(){
	var node = new JTopo.CircleNode();
	node.setLocation(400,30);
	box.addElement(node);
	var dx = 5, dy = 5;
	var angle = 0;
	var t = setInterval(function(){
		if(node.x <= 1 || node.x+ node.width > canvas.width){
			dx = -dx;
		}
		if(node.y <=1 || node.y + node.height > canvas.height){
			dy = -dy;
		}
		node.setLocation(node.x + dx, node.y + dy);
		box.updateView();
	}, 20);			
}

//gravity
function basic1(){
	var node = new JTopo.CircleNode();
	node.setLocation(400,30);
	box.addElement(node);
	var dx = 0, dy = 2;
	var gravity = 0.1;
	var t = setInterval(function(){
		dy += gravity;
		if(node.y + node.height < canvas.height){
			node.setLocation(node.x + dx, node.y + dy);
			box.updateView();
		}else{
			dy = 0;	
		}
	}, 20);			
}

//cycle
function basic2(){
	var node = new JTopo.CircleNode();
	node.setLocation(400,30);
	box.addElement(node);
	var centerX = node.x;
	var angle = 0;
	var speed = 0.1;
	var t = setInterval(function(){
		var newx = centerX + Math.sin(angle) * 50;
		node.setLocation(newx, node.y);
		box.updateView();
		angle += speed;
	}, 50);			
}

//cycle and stop
function basic3(node){
	var node = new JTopo.CircleNode();
	node.setLocation(400, 200);
	box.addElement(node);
	var centerX = node.x;
	var angle = 0;
	var speed = 0.1;
	var dv = 100;
	var t = setInterval(function(){
		var newx = centerX + Math.sin(angle) * dv;
		node.setLocation(newx, node.y);
		box.updateView();
		angle += speed;
		dv -= 0.4;
		if(dv < 0) dv = 0;
	}, 20);			
}

//Fountain
function basic4(){
	var count = 1000;
	var nodes = [];
	var gravity = 0.5;
	var wind = 2;
	var angle = 0;

	function initNode(node){
		node.r = 3;
		node.style.fillStyle = 'rgba('+ Math.round(Math.random()*255)+',' 
			+ Math.round(Math.random()*255) 
			+ ',' + Math.round(Math.random()*255) + ',0.5)';
		node.x = canvas.width/2;
		node.y = canvas.height;
		node.vx = Math.random() * 2 - 1;
		node.vy = Math.random() * -10 - 10;
	}

	for(var i=0; i<count; i++){
		var node = new JTopo.CircleNode();
		initNode(node);
		box.addElement(node);
		nodes.push(node);
	}
	//change wind direction
	setInterval(function(){
		wind = Math.sin(angle) * 4;
		angle += 0.1;
		if(angle > 2*Math.PI) angle = 0;
	}, 400);
	var t = setInterval(function(){
		for(var i=0; i<count; i++){
			var node = nodes[i];
			node.vy += gravity;
			node.x += node.vx + wind;
			node.y += node.vy;
			if(node.x < 0 || node.x >canvas.width || node.y>canvas.height){
				initNode(node);
			}
		}
		box.updateView();
	}, 80);	
	
}

//friction
function basic5(){
	var node = new JTopo.CircleNode();
	node.setLocation(200, 180);
	box.addElement(node);

	var friction = 0.9;
	var vx = 30, vy = 0;

	var t = setInterval(function(){
		if(vx < 0) window.clearInterval(t);
		node.x += vx;
		node.y += vy;  
		vx *= friction;
		box.updateView();
	}, 50);
}

//slow move
function advance1(){
	var node = new JTopo.CircleNode();
	node.setLocation(600,100);
	box.addElement(node);

	var easing = 0.2;
	var vx = 1, vy = 1;

	var t = setInterval(function(){
		//if(vx < 0.5 && vy < 0.5) window.clearInterval(t);
		var dx = canvas.width/2 - node.x;
		var dy = canvas.height/2 - node.y;
		vx = dx * easing;
		vy = dy * easing;
		
		node.x += vx;
		node.y += vy;
		box.updateView();
	}, 50);	
}

//spring
function advance2(){
	var node = new JTopo.CircleNode();
	node.setLocation(600,100);
	box.addElement(node);

	var node2 = new JTopo.CircleNode();
	node2.setLocation(600,100);
	box.addElement(node2);

	var link = new JTopo.Link(node, node2);
	box.addElement(link);

	var spring = 0.2;
	var friction = 0.95;
	var vx = 0, vy = 1;

	var t = setInterval(function(){
		var dx = node2.x - node.x;
		var dy = node2.y+100 - node.y;
		var ax = dx * spring; //加速度
		var ay = dy * spring;

		vx += ax;
		vy += ay;
		vx *= friction;
		vy *= friction;

		node.x += vx;
		node.y += vy;
		box.updateView();
	}, 50);
}

//spring chain
function advance3(){
	var count = 5;
	var nodes = [];
	
	for(var i=0; i<count; i++){
		var node = new JTopo.CircleNode();
		node.r = 20;
		node.fillStyle = 'rgba(0,0,0,0.5)';
		node.setLocation(300+90 * i, 100);
		node.vx = 1;
		node.vy = 1;
		box.addElement(node);
		if(i>0){
			var link = new JTopo.Link(node, nodes[i-1]);
			box.addElement(link);
		}
		nodes.push(node);
	}
	box.updateView();

	var spring = 0.1;
	var friction = 0.75;
	
	var t = setInterval(function(){
		for(var i=0; i<nodes.length; i++){
			var node = nodes[i];
			var preNode = nodes[i-1];
			if(i>0){
				var dx = preNode.x - node.x;
				var dy = preNode.y+100 - node.y;
				var ax = dx * spring; //加速度
				var ay = dy * spring;
				node.vx += ax;	
				node.vy += ay;

				node.vx *= friction;
				node.vy *= friction;

				node.x += node.vx;
				node.y += node.vy;
			}
		}
		
		box.updateView();
	}, 50);
}

//spring muti-target
function advance4(){
	var node = new JTopo.Node();
	node.setLocation(400,100);
	box.addElement(node);
	var node2 = new JTopo.Node();
	node2.setLocation(200, 200);
	box.addElement(node2);
	var node3 = new JTopo.Node();
	node3.setLocation(600,300);
	box.addElement(node3);

	var cNode = new JTopo.CircleNode();
	cNode.setLocation(600,100);
	box.addElement(cNode);

	box.addElement(new JTopo.Link(node, cNode));
	box.addElement(new JTopo.Link(node2, cNode));
	box.addElement(new JTopo.Link(node3, cNode));
	
	box.updateView();
	var spring = 0.2;
	var friction = 0.8;
	var vx = 1, vy = 1;

	function linkNode(node, nodeb){
		var dx = nodeb.x - node.x;
		var dy = nodeb.y - node.y;
		var ax = dx * spring; //acceleration
		var ay = dy * spring;
		vx += ax;	
		vy += ay;
	}

	var t = setInterval(function(){
		linkNode(cNode, node);
		linkNode(cNode, node2);
		linkNode(cNode, node3);

		vx *= friction;
		vy *= friction;

		cNode.x += vx;
		cNode.y += vy;
		box.updateView();
	}, 50);
}

//Sun-Moon-Star
function sunstart(){
	var node = new JTopo.CircleNode('');
	node.setLocation(200 , 360);
	node.color = "rgb(234, 226, 74)";
	
	var sunNode = new JTopo.HeartNode('');
	sunNode.style.fillStyle = 'rgba(255,0,0,0.5)';
	sunNode.setLocation(300 , 200);
	sunNode.color = "rgb(0, 0, 255)";
	
	var moonNode = new JTopo.CircleNode('');
	moonNode.setLocation(360 , 360);
	moonNode.color = "rgb(234, 226, 74)";					

	var link = new JTopo.Link(node , moonNode);
	box.addElement(link);
	
	var link2 = new JTopo.Link(sunNode , moonNode);
	box.addElement(link2);		
	
	box.addElement(node);
	box.addElement(sunNode);
	box.addElement(moonNode);
	
	var r = 0;
	var r2 = 0;
	var t = setInterval(function(){
		if(r > 2*Math.PI) {window.clearInterval(t); return;};
		r+=0.035;
		var newX= sunNode.x + Math.cos(r) * 200;
		var newY = sunNode.y + Math.sin(r) * 200;
		moonNode.setLocation(newX, newY);
		
		r2-=0.25;
		if(r2 < -2*Math.PI) r2 = 0;
		newX= moonNode.x + Math.cos(r2) * 100;
		newY = moonNode.y + Math.sin(r2) * 100;
		node.setLocation(newX, newY);		

		box.updateView();
	}, 100);
}

//basic
function d3(){
	var vpx = box.canvas.width/2;
	var vpy = box.canvas.height/2;
	var node = new JTopo.CircleNode();
	node.setLocation(vpx, vpy);
	box.addElement(node);

	var fl = 250;
	var zpos = 0;
	var r = node.r;

	box.subscribe('keydown', function(k){
		console.log(k);
		if(k == 87){ //w
			zpos += 5;
		}else if(k == 83){
			zpos -= 5;
		}
		var scala = fl / (fl + zpos);
		node.r = r * scala;
		node.x = vpx * scala;
		node.y = vpy * scala;
	});
}

//friction
function d3_2(){
	var node = new JTopo.CircleNode();
	node.vpx = box.canvas.width/2;
	node.vpy = box.canvas.height/2;
	node.vr = node.r;

	node.vx = 0;
	node.vy = 0;
	node.vz = 0;
	node.setLocation(node.vpx, node.vpy);
	box.addElement(node);
	box.updateView();

	var fl = 250;
	var friction = 0.98;

	function reLocation(node){
		var scala = fl / (fl + node.z);
		node.r = node.vr * scala;
		node.x = node.vpx * scala;
		node.y = node.vpy * scala;	
	}

	var t = setInterval(function(){
		node.vpx += node.vx;
		node.vpy += node.vy;
		node.z += node.vz;

		node.vx *= friction;
		node.vy *= friction;
		node.vz *= friction;

		reLocation(node);
		box.updateView();
	}, 50);
	box.subscribe('keydown', function(k){
		console.log(k);
		if(k == 87){ //w
			node.vz = 1;
		}else if(k == 83){
			node.vz = -1;
		}else if(k == 65){
			node.vx = -1;
		}else if(k == 68){
			node.vx = 1;
		}else if(k == 81){
			node.vy = -1;
		}else if(k == 65){
			node.vy = 1;
		}
		reLocation(node);
	});
}

//bound check
function d3_3(){
	var node = new JTopo.CircleNode();
	node.vpx = box.canvas.width/2;
	node.vpy = box.canvas.height/2;
	node.vr = node.r;

	node.vx = Math.random()*10 - 5;
	node.vy = Math.random()*10 - 5;
	node.vz = Math.random()*10 -5;
	node.setLocation(node.vpx, node.vpy);
	box.addElement(node);
	box.updateView();

	var mid = {x: box.canvas.width/2, y:box.canvas.height/2};

	var top = -100;
	var bottom = 100;
	var left = -100;
	var right = 100;
	var front = 100;
	var back = -100;

	var fl = 250;
	var friction = 0.99999;

	function move(node){
		if(node.z > - fl){
			var scala = fl / (fl + node.z);
			node.r = node.vr * scala;
			node.x = node.vpx * scala;
			node.y = node.vpy * scala;	
			node.visible = true;
		}else{
			node.visible = false;
		}
	}

	var t = setInterval(function(){
		node.vpx += node.vx;
		node.vpy += node.vy;
		node.z += node.vz;

		node.vx *= friction;
		node.vy *= friction;
		node.vz *= friction;
		if(node.x + node.r > right){
			node.vx *= -1;
		}
		if(node.x - node.r < left){
			node.vx *= -1;
		}
		if(node.y + node.r > bottom){
			node.vy *= -1;
		}
		if(node.y - node.r < top){
			node.vy *= -1;
		}

		if(node.z + node.r > front){
			node.vz *= -1;
		}
		if(node.z - node.r < back){
			node.vz *= -1;
		}
		move(node);
		box.updateView();
	}, 50);
}

//fireworks
function d3_4(){
	var nodes = [];
	for(var i=0; i<100; i++){
		var node = new JTopo.CircleNode();
		node.vpx = box.canvas.width/2;
		node.vpy = box.canvas.height/2;
		node.vr = node.r = 2;

		node.vx = Math.random()*6 - 3;
		node.vy = Math.random()*6 - 6;
		node.vz = Math.random()*6 - 3;
		node.style.fillStyle = 'rgba('+ Math.round(Math.random()*255)+',' 
			+ Math.round(Math.random()*255) 
			+ ',' + Math.round(Math.random()*255) + ',0.8)';
		node.setLocation(node.vpx, node.vpy);
		nodes.push(node);
		box.addElement(node);
	}
	box.updateView();

	var top = -100;
	var bottom = 100;
	var left = -100;
	var right = 100;
	var front = 100;
	var back = -100;

	var fl = 250;
	var friction = 0.98;
	var gravity = 0.2;
	var floor = 200;
	var bounce = -0.6;

	function move(node){
		node.vy += gravity;
		node.vpx += node.vx;
		node.vpy += node.vy;
		node.z += node.vz;

		node.vx *= friction;
		node.vy *= friction;
		node.vz *= friction;
		if(node.z > - fl){
			var scala = fl / (fl + node.z);
			node.r = node.vr * scala;
			node.x = node.vpx * scala;
			node.y = node.vpy * scala;	
			node.visible = true;
		}else{
			node.visible = false;
		}

		if(node.y + node.r > floor){
			node.vpy = floor;
			node.vy *= bounce;
		}
	}

	var t = setInterval(function(){
		for(var i=0; i<nodes.length; i++){
			move(nodes[i]);
		}
		box.updateView();
	}, 50);
}

//3D-space
function d3_5(){
	var fl = 250;
	var floor = 100;
	var dx = 0;
	var dy = 0;
	var dz = -30;
	var mid = {x: box.canvas.width/2, y:box.canvas.height/2};

	var nodes = [];
	for(var i=0; i<100; i++){
		var node = new JTopo.CircleNode();
		node.vpx = Math.random() * 2000 - 1000;
		node.vpy = floor;
		node.z = Math.random() * 10000;
		node.setLocation(node.vpx, node.vpy);
		nodes.push(node);
		box.addElement(node);
	}
	box.updateView();

	function move(node){
		node.z += dz;
		node.vpx += dx;
		node.vpy += dy;

		if(node.z < -fl){
			node.z += 10000;
		}
		if(node.z > 10000 - fl){
			node.z -= 10000;
		}
		
		var scala = fl / (fl + node.z);
		node.scala = scala;
		node.x = mid.x + node.vpx * scala;
		node.y = mid.y + node.vpy * scala;
		node.alpha = node.scala * 2;
	}

	var t = setInterval(function(){
		for(var i=0; i<nodes.length; i++){
			move(nodes[i]);
		}
		box.updateView();
	}, 100);

	box.subscribe('mousemove', function(e){
		dx = (e.x - mid.x)/ mid.x * 30;
		dy = (e.y - mid.y)/ mid.y * 30;
 	});
}
