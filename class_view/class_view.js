var canvas;
var nid; 
var nodes = [];

$( document ).ready(function() {

	canvas = new fabric.Canvas('map');

	loadNodes();
	loadEdges();
	
	canvas.on({

		'mouse:down': function(e) {
	    	if (e.target) 
	    	{
	    		loadNodePopup(e.target); 
	    	}
	    },

	
		'mouse:over': function(e){
			if(e.target.id === "mapNode")
			{
				e.target.setStroke('yellow');
				canvas.renderAll();
			}
		},
	
		'mouse:out': function(e){
			if(e.target.id === "mapNode")
			{
				e.target.setStroke('white');
				canvas.renderAll();
			}
		}
	});
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
				drawNode(parseFloat(result[i]["top"]), parseFloat(result[i]["left"]), parseFloat(result[i]["radius"]), result[i]["type"], result[i]["title"], result[i]["id"]);
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

function drawNode(top, left, radius, type, title, nodeID){
	var c = new fabric.Circle({
			top: top,
			left: left,
			radius: radius,
			fill: '#fff',
			stroke: 'white',
			strokeWidth: 5,
			id: type
	});
			
	c.hasControls = false;
	c.hasBorders = false;
	c.lockMovementX = true;
	c.lockMovementY = true;
	
	canvas.add(c);

	var temp = {
		node: c,
		id: nodeID,
	}

	nodes.push(temp); 

	var t = new fabric.Text(title, {
			fontFamily: 'arial black',
			fontSize: 25,
			left: left,
			top: top - 30,
			id: "nodeText"
			});
			
	var len = t.getWidth()/2;
	var cenX = c.getCenterPoint().x;
	t.left = cenX - len;
				
	t.hasControls = false;
	t.hasBorders = false;
	t.lockMovementX = true;
	t.lockMovementY = true;
			
	canvas.add(t);
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

function loadNodePopup(node){

	var id; 
	for(var i = 0; i < nodes.length; i++){
		if(node.top == nodes[i].node.top && node.left == nodes[i].node.left){
			id = nodes[i].id; 
		}
	}

	var _data = 'nid=' + id; 

	$.ajax({
		async: false, 
		type: 'POST', 
		url: "load_node_popup.php",
		data: _data, 
		dataType: "json", 
		success: function(result){
			fillPopup(result["title"], result["description"], result["duedate"], result["notes"]); 
		}
	}); 

	return false; 
}


function fillPopup(title, description, duedate, notes){
	$("#popup").show(); 
	$("#title").html(title); 
	$("#description").html(description); 
	var _duedate = $("#duedate").html(); 
	$("#duedate").html(_duedate + duedate); 
	$("#notes").html(notes); 
}

function hidePopup(){
	$("#popup").hide(); 
}
