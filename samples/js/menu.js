var menus = [
	{text:'Hello world', href:'index.html'},
	'Basic', 
	{text:'Node', href:'node.html'},
	{text:'UML-Node', href:'umlNode.html'},
	{text:'phoneNode', href:'phoneNode.html'},
	{text:'Link', href:'link.html'},
	{text:'Container', href:'container.html'},
	{text:'Container-2', href:'container2.html'},
	'Layout',
	{text:'star', href:'star.html'},
	{text:'star-2', href:'star2.html'},
	{text:'star-3', href:'star3.html'},
	{text:'tree', href:'tree.html'},
	{text:'tree-2', href:'tree2.html'},
	{text:'tree-3', href:'tree3.html'},
	{text:'mix', href:'mix.html'},
	{text:'mix-2', href:'mix2.html'},
	{text:'mix-3', href:'mix3.html'},
	{text:'mix-4', href:'mix4.html'},
	'Effect',
	{text:'gravitate', href:'gravitate.html'},
	{text:'rotate', href:'rotate.html'},
	{text:'nodeDown', href:'nodeDown.html'},
	'Animation',
	{text:'basic', href:'animation.html'},
	{text:'cutFruit', href:'cutFruit.html'},
	'Event',
	{text:'mouse', href:'mouse.html'},
	{text:'keyboard', href:'keyboard.html'},
	'Real',
	{text:'DIY Machine', href:'diy.html'},
	{text:'Device', href:'device.html'},
	'3D',
	{text:'basic', href:'3d.html'}

];

function drawMenus(menus){
	var ul = $('#Menu_ul');
	$.each(menus, function(i, e){
		var li = $('<li>').appendTo(ul);
		if(typeof e == 'string'){
			li.addClass('nav-header').html(e);
		}else{
			var a = $('<a>').attr('href', e.href).html(e.text);
			li.append(a);
			if(location.href.indexOf(e.href) != -1){
				li.addClass('active');
			}
		}
	});
}


String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
};

$(document).ready(function(){
	drawMenus(menus);
	$('.brand').html('JTopo');
	$('.pull-right').html('');

	var code = $('#code').text();
	code = code.replaceAll('>', '&gt;');
	code = code.replaceAll('<', '&lt;');
	$('<pre width="600">').appendTo($('#canvas').parent().css('width', '800px'))
		.html(code).snippet("javascript",{style:"acid",collapse:true});
});


