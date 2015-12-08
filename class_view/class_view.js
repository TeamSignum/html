var canvas;

$( document ).ready(function() {

	canvas = new fabric.Canvas('map');

	loadNodes();
	loadEdges();

});

function loadNodes(){

	$.ajax({
		type: 'POST',
		url: "loadmap.php",
		dataType: 'json',
		data: {map: 1},
		
		success: function(result){
			for(var i = 0; i < result.length; i++)
			{
				//alert(result[i]["top"] +1);
				drawNode(parseFloat(result[i]["top"]), parseFloat(result[i]["left"]), parseFloat(result[i]["radius"]));
			}
			//canvas.renderAll();
		}
	});
	
	return false;
}

function loadEdges(){

	$.ajax({
		type: 'POST',
		url: "loadmap.php",
		dataType: 'json',
		data: {map: 2},
		
		success: function(result){
			for(var i = 0; i < result.length; i++)
			{
				drawEdge(parseFloat(result[i]["x1"]), parseFloat(result[i]["y1"]), parseFloat(result[i]["x2"]), parseFloat(result[i]["y2"]), result[i]["type"]);
				//alert(result[i]["x1"]);
			}
			//canvas.renderAll();
		}
	});
	
	return false;
}

function drawNode(top, left, radius){
	var c = new fabric.Circle({
			top: top,
			left: left,
			radius: radius,
			fill: '#fff',
			stroke: 'white'
			});
			
	c.hasControls = false;
	c.hasBorders = false;
	c.lockMovementX = true;
	c.lockMovementY = true;
	
	canvas.add(c);
}

function drawEdge(x1, y1, x2, y2, type){
	var l;
	if(type === "solid")
	{
		l = new fabric.Line([x1, y1, x2, y2], {
			fill: 'black',
			stroke: 'black',
			strokeWidth: 5
			});
	}
	if(type === "dotted")
	{
		l = new fabric.Line([x1, y1, x2, y2], {
			fill: 'black',
			stroke: 'black',
			strokeWidth: 5,
			strokeDashArray: [5, 5],
			});
	}
	
	l.hasControls = false;
	l.hasBorders = false;
	l.lockMovementX = true;
	l.lockMovementY = true;
	
	canvas.add(l);
}