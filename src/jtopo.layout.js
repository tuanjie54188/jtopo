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

	function getStarPositions(x, y, count, radius, beginDegree, endDegree){
		var start = beginDegree ? beginDegree : 0;
		var end = endDegree ? endDegree : 2*Math.PI;
		var total = end - start;
		var degree = total / count;
		var result = [];
		
		start += degree/2;
		for(var i=start; i<=end; i+=degree){
			var dx = x + Math.cos(i) * radius;
			var dy = y + Math.sin(i) * radius;
			result.push({x: dx, y: dy});
		}
		return result;
	} 

	function getTreePositions(x, y, count, horizontal, vertical, dir){
		var direction = dir || 'bottom';
		var result = [];	
		
		if(direction == 'bottom'){
			var start = x - (count/2) * horizontal + horizontal/2;
			for(var i=0; i<=count; i++){	   
				result.push({x: start + i*horizontal , y: y + vertical});
			}
		}else if(direction == 'top'){
			var start = x - (count/2) * horizontal + horizontal/2;
			for(var i=0; i<=count; i++){	   
				result.push({x: start + i*horizontal, y: y - vertical});
			}
		}else if(direction == 'right'){
			var start = y - (count/2) * horizontal + horizontal/2;
			for(var i=0; i<=count; i++){	   
				result.push({x: x + vertical, y: start + i*horizontal});
			}
		}else if(direction == 'left'){
			var start = y - (count/2) * horizontal + horizontal /2;
			for(var i=0; i<=count; i++){	   
				result.push({x: x - vertical, y: start + i*horizontal});
			}
		}
		return result;
	} 

	function getBusPositions(x, y, count, r, vertical, dir){
		var direction = dir || 'horizontal';//vertical
		var result = [];
		var mid = Math.round(count/2);
		var startx = x + r;

		if(direction == 'horizontal'){
			for(var i=0; i<mid; i++){	   
				result.push({x: startx + i*r, y: y - vertical});
			}
			for(var i=mid; i<=count; i++){	   
				result.push({x: startx + i*r, y: y + vertical});
			}
		}else if(direction == 'vertical'){

		}
		return result;
	} 

	JTopo.Layout = {
		getStarPositions : getStarPositions,
		getTreePositions : getTreePositions,
		getBusPositions : getBusPositions
	};

})(JTopo);
