var canvas;
var nid; 
var checked_off;
var tempi = 0;
var tempp = 12; 
var mngr;

$( document ).ready(function() {

	canvas = new fabric.Canvas('map', {backgroundColor: "#99ffff"});

	// Construct map manager
	mngr = new MManager(canvas, false, 0);

	//Load the learning map from the DB
	mngr.LoadMap(mngr, 1, 0);
	mngr.LoadEdges(mngr, 1, 0);
	
	getParticipants();
	getPercents();
	
	//Canvas events
	canvas.on({

		'mouse:down': function(e) {
			if(e.target)
			{
				if (e.target.id === "mapNode") 
				{
					mngr.HandleMapNodeSelect(e.target);
				}
			}
	    },
	
		'mouse:over': function(e){
			if(e.target.id === "mapNode" || e.target.id === "cmapNode")
			{
				e.target.setStroke('yellow');
				canvas.renderAll();
			}
		},
	
		'mouse:out': function(e){
			if(e.target.id === "mapNode")
			{
				e.target.setStroke('white');
			}
			if(e.target.id === "cmapNode")
			{
				e.target.setStroke("#0d0");
			}
			canvas.renderAll();
		}
	});

	$( "#checkoff" ).click(function() {
		mngr.CheckOffNode();
	});

	$( "#xmark" ).click(function() {
		mngr.HidePopup2();
	});

});

function getPercents()
{
	var temp = [];
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		//alert(mngr.nodes[i].id);
		temp.push(mngr.nodes[i].id);
	}
	$.ajax({
		type: 'POST',
		url: "class_view.php",
		dataType: 'json',
		data: {userperc: temp},
		//async: false,
		
		success: function(result){
			//alert(result);
			//alert(result[0].nid + " " + result[0].count);
			for(var i = 0; i < result.length; i++)
			{
				if(result[i].count != null)
				{
					drawPercents(result[i].nid, result[i].count, result[i].total);
				}
			}
		}
	});
	
	return false;
}

function drawPercents(nid, count, total)
{
	var temp;
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		if(mngr.nodes[i].id == nid)
		{
			temp = mngr.nodes[i].node;
		}
	}
	
	var perc = "0%";
	
	if(count != 0)
	{
		var p = Math.floor((parseFloat(count) / parseFloat(total)) * 100);
		//alert(Math.floor((parseFloat(count) / parseFloat(total)) * 100));
		perc = p + "%";
	}
	
	var t = new fabric.Text(perc, {
			fontFamily: 'arial black',
			fontSize: 20,
			left: temp.left,
			top: temp.top + temp.radius - 10
	});
	
	var len = t.getWidth()/2;
	var cenX = temp.getCenterPoint().x;
	t.left = cenX - len;
	
	canvas.add(t);
}

function getParticipants()
{
	var temp = [];
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		//alert(mngr.nodes[i].id);
		temp.push(mngr.nodes[i].id);
	}
	$.ajax({
		type: 'POST',
		url: "class_view.php",
		dataType: 'json',
		data: {pnodes: temp},
		//async: false,
		
		success: function(result){
			//alert(result);
			//alert(result[0].nid + " " + result[0].count);
			for(var i = 0; i < result.length; i++)
			{
				if(result[i].count != null)
				{
					drawParticipants(result[i].nid, result[i].count);
				}
			}
		}
	});
	
	return false;
}

function drawParticipants(nid, count)
{
	var temp;
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		if(mngr.nodes[i].id == nid)
		{
			temp = mngr.nodes[i].node;
		}
	}
	
	temp.pnode.ptext.setText(count);
}

//Calculates the participant nodes spacing
//Draws the participant nodes around the specified node
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
	var participantNodeSpacing = (2 * Math.PI - (2 * Math.PI / 3)) / _participants;
	var currentAngle = (Math.PI / 2) + (Math.PI / 6); 

	for (var i = _participants; i >= 0; i--) {

		//draw the circle
		var participantNode = new fabric.Circle({
			radius: 7,
			left: nodeCenterX + Math.sin(currentAngle) * (_radius + 14) - 7,  // need to verify this math
			top: nodeCenterY + Math.cos(currentAngle) * (_radius + 14) - 7,  // need to verify this math
			fill: '#50a35d'
		});
		
		participantNode.lockMovementX = true;
		participantNode.lockMovementY = true;
		participantNode.hasControls = false;
		participantNode.hasBorders = false;
		
		canvas.add(participantNode);

		currentAngle = currentAngle - participantNodeSpacing; 
	}
}
