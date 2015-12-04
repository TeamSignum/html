var canvas;

$( document ).ready(function() {

	canvas = new fabric.Canvas('map');

	loadMap();

});

function loadMap(){

	$.ajax({
		type: 'POST',
		url: "loadmap.php",
		dataType: 'json',
		data: {map: 1},
		
		success: function(result){
			for(var i = 0; i < result.length; i++)
			{
				//alert(result[i]["top"] +1);
				drawNode(parseFloat(result[i]["top"]), parseFloat(result[i]["left"]));
			}
			//canvas.renderAll();
		}
	});
	
	return false;
}

function drawNode(top, left){
	var c = new fabric.Circle({
			top: top,
			left: left,
			radius: 15,
			fill: '#fff',
			stroke: 'white'
			});
			
	canvas.add(c);
}