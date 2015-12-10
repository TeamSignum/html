var canvas;
var nid; 
var nodes = [];
var checked_off;
var tempi = 0;
var tempp = 16; 

$( document ).ready(function() {

	canvas = new fabric.Canvas('map');

	loadNodes();
	loadEdges();
	
	canvas.on({

		'mouse:down': function(e) {
	    	if (e.target.id === "mapNode") 
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
				tempi++;
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
	
	if(tempi < 3)
	{
		drawParticipantNodes(c, tempp);
		//alert(tempp);
		tempp = tempp - 6;
	}

	var temp = {
		node: c,
		id: nodeID,
	}

	nodes.push(temp); 

	var t = new fabric.Text(title, {
			fontFamily: 'arial black',
			fontSize: 25,
			left: left,
			top: top - 35,
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
	canvas.sendToBack(l);
}

function loadNodePopup(node){

	var id; 
	for(var i = 0; i < nodes.length; i++){
		if(node.top == nodes[i].node.top && node.left == nodes[i].node.left){
			id = nodes[i].id; 
		}
	}

	nid = id; 
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
	$("#duedate").html("Due date: " + duedate); 
	$("#notes").html(notes); 
}

function hidePopup(){
	$("#popup").hide(); 
}

function checkOffNode(){
	swal({   
		title: "Are you sure?",   
		text: "Clicking yes will check off this node.",   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Yes",   
		cancelButtonText: "No",   
		closeOnConfirm: false,   
		closeOnCancel: false }, 
		function(isConfirm){   
			if (isConfirm) {     
				swal("Completed", "The node has been completed.", "success");
				for(var i = 0; i < nodes.length; i++){
					if(nodes[i].id == nid){
						nodes[i].node.setFill("#0d0"); 
						$("#popup").hide(); 
					}
				}   
			} 
			else {     
				swal("Cancelled", "The node has not been completed.", "error");   
			} 
	});
}

function drawParticipantNodes(c, num){

	var _left = c.left;
	var _top = c.top;
	var _radius = c.radius;
	var _participants = num;
	
	// calculate the center of the node we're drawing around
	//var nodeCenterX = _left + _radius;
	//var nodeCenterY = _top + radius;
	var nodeCenterX = c.getCenterPoint().x;
	var nodeCenterY = c.getCenterPoint().y;
	
	// determine the angle between each participant node
	var participantNodeSpacing = (Math.PI * 2) / _participants;

	for (var i = _participants - 1; i >= 0; i--) {
		//
		var currentAngle = i * participantNodeSpacing;

		//draw the circle
		var participantNode = new fabric.Circle({
			radius: 5,
			left: nodeCenterX + Math.sin(currentAngle) * (_radius + 10) - 5,  // need to verify this math
			top: nodeCenterY + Math.cos(currentAngle) * (_radius + 10) - 5,  // need to verify this math
			fill: 'red'
		});
		
		participantNode.lockMovementX = true;
		participantNode.lockMovementY = true;
		participantNode.hasControls = false;
		participantNode.hasBorders = false;
		
		canvas.add(participantNode);
	}
}
