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
 * Date: 2013-07-22
 */

(function(JTopo){

	function Link(nodeA, nodeB) {
		this.nodeA = nodeA;
		this.nodeB = nodeB;
		this.style = {strokeStyle: '116, 166, 250', alpha: 1, lineWidth: 2};
	};

	Link.prototype = new JTopo.Element();

	Link.prototype.draw = function (ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')';
		ctx.lineWidth = this.style.lineWidth;
		ctx.moveTo(this.nodeA.x + this.nodeA.width / 2, this.nodeA.y + this.nodeA.height / 2);
		ctx.lineTo(this.nodeB.x + this.nodeB.width / 2, this.nodeB.y + this.nodeB.height / 2);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	};

	Link.prototype.getLength = function(){
		return getDistance(this.nodeA , this.nodeB);
	};

	function FoldLink(nodeA, nodeB) {
		var link = new JTopo.Link(nodeA, nodeB);
		link.fold = 'x';
		link.draw = function (ctx) {
			var x1 = this.nodeA.x;
			var y1 = this.nodeA.y;
			var x2 = this.nodeB.x;
			var y2 = this.nodeB.y;
			var mx = x1;
			var my = y1;
			
			if(x1 == x2 || y1 == y2){
				ctx.save();
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')';
				ctx.lineWidth = this.style.lineWidth;
				ctx.moveTo(this.nodeA.x + this.nodeA.width / 2, this.nodeA.y + this.nodeA.height / 2);
				ctx.lineTo(this.nodeB.x + this.nodeB.width / 2, this.nodeB.y + this.nodeB.height / 2);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();
			}else{
				if(this.fold == 'x'){
					mx = x1 + (x2 - x1);
				}else{
					my = y1 + (y2 - y1);
				}
				ctx.save();
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')';
				ctx.lineWidth = this.style.lineWidth;
				ctx.moveTo(x1 + this.nodeA.width / 2, y1+ this.nodeA.height / 2);
				ctx.lineTo(mx + this.nodeA.width / 2, my+ this.nodeA.height / 2);
				ctx.lineTo(x2 + this.nodeA.width / 2, y2+ this.nodeA.height / 2);
				ctx.stroke();		
				ctx.closePath();
				ctx.restore();
			}
		};

		return link;
	};


	function CurveLink(nodeA, nodeB) {
		var link = new JTopo.Link(nodeA, nodeB);
		link.curve = 0.5; 
		link.draw = function (ctx) {
			var x1 = this.nodeA.x;
			var y1 = this.nodeA.y;
			var x2 = this.nodeB.x;
			var y2 = this.nodeB.y;
			var mx = x1;
			var my = y1;

			mx = x1 + (x2 - x1);
			my = y1 + (y2 - y1);

			mx *= this.curve;
			my *= this.curve;

			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')';
			ctx.lineWidth = this.style.lineWidth;
			ctx.moveTo(x1 + this.nodeA.width / 2, y1+ this.nodeA.height / 2);
			ctx.quadraticCurveTo(mx + this.nodeA.width / 2, my+ this.nodeA.height / 2, 
								 x2 + this.nodeA.width / 2, y2+ this.nodeA.height / 2);
			ctx.stroke();		
			ctx.closePath();
			ctx.restore();
		};
		return link;
	};

	function ArrowsLink(nodeA, nodeB){
		var link = new JTopo.Link(nodeA, nodeB);
		link.angle = 0.4;
		link.offset = 30;
		//link.style.fillStyle = '116, 166, 250';
		link.draw = function(ctx){
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')';
			ctx.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.style.alpha + ')';
			ctx.lineWidth = this.style.lineWidth;
			
			var ta = {x: this.nodeA.x + this.nodeA.width/2, y:this.nodeA.y + this.nodeA.height/2};
			var t = {x: this.nodeB.x + this.nodeB.width/2, y:this.nodeB.y + this.nodeB.height/2};

			var angle = Math.atan2(ta.y - t.y, ta.x - t.x);
			t.x = t.x + Math.cos(angle) * this.nodeB.width/2;
			t.y = t.y + Math.sin(angle) * this.nodeB.height/2;
			
			var da = 0.4;
			var pointA = {x: t.x + Math.cos(angle-da) * this.offset,
						  y: t.y + Math.sin(angle-da) * this.offset};

			var pointB = {x: t.x + Math.cos(angle+da) * this.offset,
						  y: t.y + Math.sin(angle+da) * this.offset};

			ctx.moveTo(this.nodeA.x + this.nodeA.width / 2, this.nodeA.y + this.nodeA.height / 2);
			//ctx.lineTo(this.nodeB.x + this.nodeB.width / 2, this.nodeB.y + this.nodeB.height / 2);
			ctx.lineTo(pointA.x + (pointB.x - pointA.x)/2, pointA.y + (pointB.y - pointA.y)/2);

			ctx.moveTo(pointA.x , pointA.y);
			ctx.lineTo(t.x, t.y);
			ctx.lineTo(pointB.x, pointB.y);
			ctx.lineTo(pointA.x , pointA.y);
			if(this.style.fillStyle != null){
				ctx.fill();
			}
			ctx.stroke();
			ctx.closePath();
			ctx.restore();		
		};
		return link;
	}

	function ArrowsFoldLink(nodeA, nodeB) {
		var link = new JTopo.Link(nodeA, nodeB);
		link.fold = 'x';
		link.angle = 0.4;
		link.offset = 30;

		link.draw = function (ctx) {
			var x1 = this.nodeA.x;
			var y1 = this.nodeA.y;
			var x2 = this.nodeB.x;
			var y2 = this.nodeB.y;
			var mx = x1;
			var my = y1;
			
			if(x1 == x2 || y1 == y2){
				ctx.save();
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')';
				ctx.lineWidth = this.style.lineWidth;

				var ta = {x: this.nodeA.x + this.nodeA.width/2, y:this.nodeA.y + this.nodeA.height/2};
				var t = {x: this.nodeB.x + this.nodeB.width/2, y:this.nodeB.y + this.nodeB.height/2};

				var angle = Math.atan2(ta.y - t.y, ta.x - t.x);
				t.x = t.x + Math.cos(angle) * this.nodeB.width/2;
				t.y = t.y + Math.sin(angle) * this.nodeB.height/2;
				
				var da = 0.4;
				var pointA = {x: t.x + Math.cos(angle-da) * this.offset,
							  y: t.y + Math.sin(angle-da) * this.offset};

				var pointB = {x: t.x + Math.cos(angle+da) * this.offset,
							  y: t.y + Math.sin(angle+da) * this.offset};

				ctx.lineTo(pointA.x + (pointB.x - pointA.x)/2, pointA.y + (pointB.y - pointA.y)/2);

				ctx.moveTo(pointA.x , pointA.y);
				ctx.lineTo(t.x, t.y);
				ctx.lineTo(pointB.x, pointB.y);
				ctx.lineTo(pointA.x , pointA.y);
				if(this.style.fillStyle != null){
					ctx.fill();
				}
				ctx.closePath();
				ctx.stroke();
				ctx.restore();
			}else{
				if(this.fold == 'x'){
					mx = x1 + (x2 - x1);
				}else{
					my = y1 + (y2 - y1);
				}
				ctx.save();
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')';
				ctx.lineWidth = this.style.lineWidth;
				ctx.moveTo(x1 + this.nodeA.width / 2, y1+ this.nodeA.height / 2);
				ctx.lineTo(mx + this.nodeA.width / 2, my+ this.nodeA.height / 2);

				var ta = {x: mx + this.nodeA.width / 2, y: my+ this.nodeA.height / 2};
				var t = {x: this.nodeB.x + this.nodeB.width/2, y:this.nodeB.y + this.nodeB.height/2};

				var angle = Math.atan2(ta.y - t.y, ta.x - t.x);
				t.x = t.x + Math.cos(angle) * this.nodeB.width/2;
				t.y = t.y + Math.sin(angle) * this.nodeB.height/2;
				
				var da = 0.4;
				var pointA = {x: t.x + Math.cos(angle-da) * this.offset,
							  y: t.y + Math.sin(angle-da) * this.offset};

				var pointB = {x: t.x + Math.cos(angle+da) * this.offset,
							  y: t.y + Math.sin(angle+da) * this.offset};
				
				ctx.lineTo(pointA.x + (pointB.x - pointA.x)/2, pointA.y + (pointB.y - pointA.y)/2);

				ctx.moveTo(pointA.x , pointA.y);
				ctx.lineTo(t.x, t.y);
				ctx.lineTo(pointB.x, pointB.y);
				ctx.lineTo(pointA.x , pointA.y);

				if(this.style.fillStyle != null){
					ctx.fill();
				}
				ctx.stroke();		
				ctx.closePath();
				ctx.restore();
			}
		};

		return link;
	};


	JTopo.Link = Link;
	JTopo.FoldLink = FoldLink;
	JTopo.CurveLink = CurveLink;
	JTopo.ArrowsLink = ArrowsLink;
	JTopo.ArrowsFoldLink = ArrowsFoldLink;
})(JTopo);
