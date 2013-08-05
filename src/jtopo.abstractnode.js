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
	/**
	 * Abstract node object
	 * @param {int} id
	 * @param {String} name
	 */
	function AbstractNode(name) {
		this.id = null;
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.visible = true;
		this.dragable = true;

		this.name = name;
		this.image = null;
		this.color = null;
		this.layout = null;
		this.gravitate = null;//function(){};
		this.parentContainer = null;
		this.inContainer = null;
		this.outContainer = null;
		this.fixed = false;
	};

	AbstractNode.prototype = new JTopo.Element();

	AbstractNode.prototype.getName = function(){
		return this.name;
	};

	AbstractNode.prototype.setName = function(n){
		this.name = n;
		return this;
	};

	AbstractNode.prototype.getImage = function(){
		return this.image;
	};

	AbstractNode.prototype.setImage = function(i){
		var node = this;
		if(typeof i == 'string'){
			var img = this.image = new Image();
			this.image.onload = function(){
				node.setSize(img.width, img.height);
			};
			this.image.src = i;
		}else{
			this.image = i;
		}
	};

	var ImageCache = {};
	AbstractNode.prototype.getTypeImage = function(type){
		var typeImages = {
			'zone' : './img/zone.png',
			'host' : './img/host.png',
			'vm' : './img/vm.png'
		};
		if(ImageCache[type]){
			return ImageCache[type];
		}
		var src = typeImages[type];
		if(src == null) return null;

		var image = new Image();
		image.src = src;
		return ImageCache[type] = image;
	};

	AbstractNode.prototype.getType = function(){
		return this.type;
	};

	AbstractNode.prototype.setType = function(type){
		this.type = type;
		this.setImage(this.getTypeImage(type));
	};

	JTopo.AbstractNode = AbstractNode;

})(JTopo);
