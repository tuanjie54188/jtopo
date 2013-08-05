$(document).ready(function(){
    nodetest();
});

/**
 * 节点
 */
function nodetest() {
    var box = new JTopo.DataBox('dataBox', $("#canvas")[0]);

    var textNode = new JTopo.TextNode('This is a Text node.');
    textNode.setLocation(317, 410);
    box.addElement(textNode);

    var node = new JTopo.Node('主机');
    node.setType('host');
    node.setLocation(300, 200);
    box.addElement(node);

    var node2 = new JTopo.TipNode('hello');
    node2.setLocation(540, 100);
    box.addElement(node2);

    var node3 = new JTopo.Node('');
    node3.setLocation(500, 200);
    node3.width = 64;
    node3.height = 64;
    node3.setImage('./img/person.png');
    box.addElement(node3);

    var node4 = new JTopo.Node('');
    node4.setLocation(310, 270);
    node4.width = 128;
    node4.height = 128;
    node4.style = {fillStyle: '71, 167, 184'};
    box.addElement(node4);

    function ZoneNode(name){
        var node = new JTopo.Node(name);
        node.setType('zone');
        return node;
    }

    var zoneNode = new ZoneNode('zone');
    zoneNode.setLocation(200, 200);
    box.addElement(zoneNode);

    var cirNode = new JTopo.CircleNode();
    cirNode.style.fillStyle = '0, 0, 255';
    cirNode.setLocation(390, 190);
    box.addElement(cirNode);

    var heartNode = new JTopo.HeartNode();	
    heartNode.style.fillStyle = '255, 0, 0';
    heartNode.setLocation(300, 270);
    box.addElement(heartNode);

    box.updateView();
}

function umlNodetest(){
    var box = new JTopo.DataBox('dataBox', $("canvas")[0]);

	var User = {
		id: 001,name:'jack',address: [],
		getName: function(){}, setName: function(){}
	};
    var userNode = new JTopo.UMLClassNode('User');
	userNode.classObj = User;
    userNode.setLocation(377, 77);
    box.addElement(userNode);

    var accountNode = new JTopo.UMLClassNode('Account');
	accountNode.operations = ['+ add(user) :Integer', '+ getUsers :List'];
	accountNode.attributes = ['- id :String', '+ users :List'];
    accountNode.setLocation(92, 221);
    box.addElement(accountNode);

    var resourceNode = new JTopo.UMLClassNode('Resource');
	resourceNode.operations = [];
	resourceNode.attributes = ['- id :String', '+ accounts :List', '+ type :String'];
    resourceNode.setLocation(381, 351);
    box.addElement(resourceNode);

    box.addElement(new JTopo.ArrowsFoldLink(userNode, accountNode));

	var link = new JTopo.ArrowsLink(userNode, resourceNode);
	link.style.fillStyle = '116, 166, 250';
    box.addElement(link);

	box.updateView();
}

function endPointNodetest(){
    var box = new JTopo.DataBox('dataBox', $("canvas")[0]);

	var node = new JTopo.EndPointNode('');
	node.setLocation(300, 200);
    box.addElement(node);

	box.updateView();
}


function linktest0(parameters) {
    var box = new JTopo.DataBox('dataBox', $("canvas")[0]);

    var nodeA = new JTopo.CircleNode('NodeA');
    nodeA.setLocation(50, 420);
    box.addElement(nodeA);

    var nodeB = new JTopo.Node('NodeB');
    nodeB.setLocation(300, 420);
	nodeB.setSize(100, 50);
    box.addElement(nodeB);

    var link = new JTopo.ArrowsLink(nodeA, nodeB);
    box.addElement(link);

	box.updateView();
}

function grouptest(){
    var box = new JTopo.DataBox('dataBox', $("canvas")[0]);

	var text1 = new JTopo.TextNode('Shelf-1');
	text1.setLocation(190, 300);
	box.addElement(text1);

	var text1 = new JTopo.TextNode('Shelf-2');
	text1.setLocation(390, 300);
	box.addElement(text1);

	var text1 = new JTopo.TextNode('Shelf-2');
	text1.setLocation(590, 300);
	box.addElement(text1);

	function GravityNode(name){
		var node = new JTopo.Node(name);
		node.inContainer = function(target){
			return true;
		};
		node.outContainer = function(target){
			return true;
		};
		return node;
	}
	var node0 = new JTopo.Node('node');
	node0.setType('host');
	box.addElement(node0);

	for(var i=0; i<20; i++){
		var node = new JTopo.GravityNode('node'+i);
		node.x = 400+Math.random()*50;
		node.y = 320+Math.random()*50;
		if(Math.random() > 0.5){
			node.setType('host');
		}else{
			node.setType('vm');
			node.x -= 100;
		}
		box.addElement(node);
	}

	var group = new JTopo.GridContainer("hostgroup");
	group.x = 150; group.y = 100;
	box.addElement(group);

	for(var i=0; i<3; i++){
		var oneContainer = new JTopo.OneItemContainer();
		oneContainer.setDragable(false);
		box.addElement(oneContainer);
		group.add(oneContainer);
	}

	box.updateView();
}

function grouptest2(){		
	var box = new JTopo.DataBox('dataBox', $("canvas")[0]);
	//box.image.src= './img/room.jpg';

	(function(){
		var text1 = new JTopo.TextNode('组 装');
		text1.setLocation(115, 423);
		text1.style.fontSize = '14pt';
		box.addElement(text1);

		var text1 = new JTopo.TextNode('硬盘');
		text1.setLocation(640, 235);
		//box.addElement(text1);

		var text1 = new JTopo.TextNode('内存条');
		text1.setLocation(638, 489);
		//box.addElement(text1);

		function HardDiskNode(name){
			var node = new JTopo.Node(name);
			node.inContainer = function(target){
				return true;
			};
			node.outContainer = function(target){
				return true;
			};
			node.setSize(128, 128);
			node.setImage('./img/harddisk.png');
			return node;
		}
		function MemoryNode(name){
			var node = new JTopo.Node(name);
			node.inContainer = function(target){
				return true;
			};
			node.outContainer = function(target){
				return true;
			};
			node.setTip('DDR-3');
			node.setSize(128, 128);
			node.setImage('./img/memory.png');
			return node;
		}

		function OsNode(name){
			var node = new JTopo.Node(name);
			node.inContainer = function(target){
				return true;
			};
			node.outContainer = function(target){
				return true;
			};
			node.setSize(128, 128);
			node.setImage('./img/memory.png');
			return node;
		}

		var vmGroup = new JTopo.GridContainer("vm");
		vmGroup.setDragable(false);

		vmGroup.x = 21; vmGroup.y = 100;
		vmGroup.cellWidth = 140;
		vmGroup.cellHeight = 160;
		box.addElement(vmGroup);

		var group = new JTopo.GridContainer("disk");
		group.setDragable(false);

		group.cellWidth = 128;
		group.cellHeight = 128;
		box.addElement(group);
		group.x = 350; group.y = 30;
		group.rows = 1; group.cols = 3;
		group.style = {fillStyle: '255, 200, 254'};
		for(var i=0; i<3; i++){
			var node = new HardDiskNode((i+1)*20 + 'GB');
			box.addElement(node);
			group.add(node);
		}

		var group = new JTopo.GridContainer("memory");
		group.setDragable(false);
		group.cellWidth = 128;
		group.cellHeight = 128;
		box.addElement(group);
		group.x = 350; group.y = 208;
		group.rows = 1; group.cols = 3;
		group.style = {fillStyle: '255, 200, 254'};
		for(var i=0; i<3; i++){
			var node = new MemoryNode((i+1) + 'GB');
			box.addElement(node);
			group.add(node);
		}

		var group = new JTopo.GridContainer("");
		group.setDragable(false);
		group.cellWidth = 128;
		group.cellHeight = 128;
		box.addElement(group);
		group.x = 350; group.y = 408;
		group.rows = 1; group.cols = 3;
		group.style = {fillStyle: '255, 200, 254'};

		var vms = new JTopo.GridContainer("vms");
		vms.setDragable(false);
		box.addElement(vms);
		vms.cellWidth = 128;
		vms.cellHeight = 128;
		vms.x = 0; vms.y = 577;
		vms.rows = 2; vms.cols = 10;
		
		var oss = [
			{name:'Windows-8', image: './img/OS_Windows_8.png'},
			{name:'Linux', image: './img/OS_Ubuntu.png'},
			{name:'Mac', image: './img/OS_Apple.png'}
		];
		for(var i=0; i<oss.length; i++){
			var os = oss[i];
			var node = new OsNode(os.name);
			node.setSize(128, 128);
			node.setImage(os.image);
			box.addElement(node);
			group.add(node);
		}

		var okNode = new JTopo.Node();
		okNode.setTip('确定');
		okNode.setDragable(false);
		okNode.setImage('./img/ok.png');
		okNode.setSize(64, 64);
		okNode.setLocation(120, 490);
		box.addElement(okNode);
		
		var arr = [];
		box.subscribe('mousedown', function(e){
			console.log(e);
			if(e.target === okNode && vmGroup.items.length >= 3){
				var node = new JTopo.Node();
				node.setImage('./img/acer-samll.jpg');
				//				node.setType('host');
				box.addElement(node);
				node.setSize(65, 124);
				node.setLocation(100+ arr.length*148, 590);
				//vms.add(node);
				arr.push(node);
				var name = '';
				for(var i=0; i<vmGroup.items.length; i++){
					name += ' ' + vmGroup.items[i].name;
				}
				node.setName(name);
				box.updateView();
			}
		});
	})();

	box.updateView();
}


function grouptest3(){		
	var box = new JTopo.DataBox('dataBox', $("canvas")[0]);

	function HostNode(name){
		var node = new JTopo.Node(name);
		node.setType('host');
		return node;
	}
	function VmNode(name){
		var node = new JTopo.Node(name);
		node.setType('vm');
		return node;
	}
	
	var nodeA = null;
	(function(){
		var node0 = new JTopo.RhomboidNode('vm_0');
		node0.setLocation(34, 181);
		box.addElement(node0);
		
		var node1 = new JTopo.RhomboidNode('vm_1');
		node1.setLocation(244, 191);
		box.addElement(node1);
		nodeA = node1;
		
		var node2 = new JTopo.RhomboidNode('vm_2');
		node2.setLocation(281, 94);				
		box.addElement(node2);
		
		var group = new JTopo.RhomboidContainer("vmgroup");
		group.style = {fillStyle: '0, 100, 0'};
		group.add(node0);
		group.add(node1);
		group.add(node2);		
		
		box.addElement(group);
	})();
	
	(function(){
		var node0 = new JTopo.RhomboidNode('vm_0');
		node0.setLocation(11, 393);
		box.addElement(node0);
		
		var node1 = new JTopo.RhomboidNode('vm_1');
		node1.setLocation(213, 292);
		box.addElement(node1);
		
		var node2 = new JTopo.RhomboidNode('vm_2');
		node2.setLocation(285, 345);				
		box.addElement(node2);
		
		var group = new JTopo.RhomboidContainer("vmgroup");
		group.style = {fillStyle: '0, 0, 100'};
		group.add(node0);
		group.add(node1);
		group.add(node2);		
		
		box.addElement(new JTopo.FoldLink(nodeA, node1));
		
		box.addElement(group);
	})();

	box.updateView();
}


function gravitatetest(){		
	var box = new JTopo.DataBox('dataBox', $("canvas")[0]);

	function ZoneNode(name){
		var node = new JTopo.Node(name);
		node.setType('zone');
		return node;
	}
	function HostNode(name){
		var node = new JTopo.Node(name);
		node.setType('host');
		return node;
	}
	function VmNode(name){
		var node = new JTopo.Node(name);
		node.setType('vm');
		node.gravitate = function(targetNode){
			return targetNode.getType() === 'host';
		};
		return node;
	}
	var zoneNode = new JTopo.ZoneNode('testzone');
	box.addElement(zoneNode);			
	zoneNode.setLocation(350, 30);
	var hostCount =  3;

	zoneNode.layout = {width: 240, height: 160};
	var hostPoints = JTopo.Layout.getTreePositions(zoneNode.x, zoneNode.y, hostCount, zoneNode.layout.width, zoneNode.layout.height);

	for(var i=0; i<hostCount; i++){
		var hostNode = new JTopo.HostNode("host" + i);
		hostNode.setLocation(hostPoints[i].x, hostPoints[i].y);
		box.addElement(hostNode);
		
		box.addElement(new JTopo.Link(zoneNode, hostNode));
		
		var n =  1+Math.round(Math.random() * 5);

		hostNode.layout = {r:100, beginDegree:0, endDegree:Math.PI};
		var points = JTopo.Layout.getStarPositions(hostNode.x, hostNode.y, n, hostNode.layout.r, hostNode.layout.beginDegree, hostNode.layout.endDegree);
		for(var j=0; j<n; j++){
			var vmNode = new JTopo.VmNode("vm-" + i + "" + j );
			box.addElement(vmNode);
			vmNode.setLocation(points[j].x , points[j].y);
			box.addElement(new JTopo.Link(hostNode, vmNode));
		}
	}

	box.updateView();
}

function linktest(){		
	var box = new JTopo.DataBox('dataBox', $("canvas")[0]);

	(function(){

		var nodeA = new JTopo.CircleNode('NodeA');
		nodeA.setType('host');
		nodeA.r = 20;
		nodeA.setLocation(50, 420);
		box.addElement(nodeA);

		var nodeB = new JTopo.CircleNode('NodeB');
		nodeB.r = 20;
		nodeB.setType('host');
		nodeB.setLocation(300, 420);
		box.addElement(nodeB);
		
		var link = new JTopo.ArrowsLink(nodeA, nodeB);
		box.addElement(link);	
	})();
	
	(function(){
		var nodeA = new JTopo.Node('NodeA');
		nodeA.setType('host');
		nodeA.setLocation(300, 100);
		box.addElement(nodeA);

		var nodeB = new JTopo.Node('NodeB');
		nodeB.setType('host');
		nodeB.setLocation(130, 200);
		box.addElement(nodeB);
		
		var link = new JTopo.CurveLink(nodeA, nodeB);
		box.addElement(link);	
	})();
	
	(function(){
		var nodeD = new JTopo.Node('NodeD');
		nodeD.setType('host');
		nodeD.setLocation(350, 210);
		box.addElement(nodeD);

		var nodeE = new JTopo.Node('NodeE');
		nodeE.setType('zone');
		nodeE.setLocation(470, 100);
		box.addElement(nodeE);
		
		var nodeC = new JTopo.Node('NodeC');
		nodeC.setType('host');
		nodeC.setLocation(540, 300);
		box.addElement(nodeC);
		
		var nodeH = new JTopo.Node('NodeG');
		nodeH.setType('host');
		nodeH.setLocation(540, 400);
		box.addElement(nodeH);
		
		var nodeG = new JTopo.Node('NodeH');
		nodeG.setType('host');
		nodeG.setLocation(350, 360);
		box.addElement(nodeG);

		
		var link = new JTopo.FoldLink(nodeD, nodeE);
		box.addElement(link);
		
		var link2 = new JTopo.FoldLink(nodeE, nodeC);
		link2.fold = 'y';
		box.addElement(link2);
		
		var link3 = new JTopo.FoldLink(nodeE, nodeG);
		link3.fold = 'y';
		box.addElement(link3);

		var link4 = new JTopo.FoldLink(nodeE, nodeH);
		link4.fold = 'y';
		box.addElement(link4);
		
	})();

	box.updateView();
}

function layout(){		
	var startTime = new Date();
	var box = new JTopo.DataBox('dataBox', $("canvas")[0]);

	function ZoneNode(name){
		var node = new JTopo.Node(name);
		node.setType('zone');
		return node;
	}
	function HostNode(name){
		var node = new JTopo.Node(name);
		node.setType('host');
		return node;
	}
	function VmNode(name){
		var node = new JTopo.Node(name);
		node.setType('vm');
		return node;
	}

	var treeLayout = {auto: true, type: 'tree', width: 60, height: 70, direction:'bottom'};
	var starLayout = {auto: true, type: 'star', r:220, beginDegree:0, endDegree:Math.PI};

	var zoneNode = new ZoneNode('testzone');
	box.addElement(zoneNode);			
	zoneNode.setLocation(350, 230);
	zoneNode.layout = starLayout;

	for(var i=0; i<10; i++){
		var hostNode = new HostNode("host" + i);
		hostNode.layout = treeLayout;
		box.addElement(hostNode);
		
		var link = new JTopo.Link(zoneNode, hostNode);
		link.fold = 'x';
		box.addElement(link);
		
		for(var j=0; j<20; j++){
			var vmNode = new VmNode("vm-" + i + "" + j );
			box.addElement(vmNode);
			var link = new JTopo.Link(hostNode, vmNode);

			link.fold = 'x';
			box.addElement(link);
		}
	}
	box.layoutNode(zoneNode);
	
	box.subscribe('mouseup', function(e){
		if(e.target && e.target.getType() == 'vm'){
			e.target.goBack(box);		
		}
	});

	box.updateView();
	var endTime = new Date();
	console.log(endTime.getTime() - startTime.getTime());
}

function animation_gravity(){		
	var box = new JTopo.DataBox('dataBox', $("canvas")[0]);
	var node = new JTopo.CircleNode();
	node.setLocation(300,300);
	box.addElement(node);
	
	JTopo.Animation.gravity(node, {
		targetX: 300,
		targetY: 500,
		dx: 0,
		dy: 10
	}, box);
	
	box.updateView();
};

function animation_circlemove(){		
	var box = new JTopo.DataBox('dataBox', $("canvas")[0]);
	var node = new JTopo.CircleNode();
	node.setLocation(300,300);
	box.addElement(node);
	
	JTopo.Animation.circleMove(node, {
		targetX: 300,
		targetY: 500
	}, box);
	
	box.updateView();
};
