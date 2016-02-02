var canvas;
var nid; 
var checked_off;
var tempi = 0;
var tempp = 12; 
var mngr;

$( document ).ready(function() {

	canvas = new fabric.Canvas('map', {backgroundColor: "#99ffff"});

	// Construct map manager
	mngr = new MManager(canvas, false);

	//Load the learning map from the DB
	mngr.LoadMap(mngr, 1);
	mngr.LoadEdges(mngr, 1);
	
	//Canvas events
	canvas.on({

		'mouse:down': function(e) {
			if(e.target)
			{
				if (e.target.id === "mapNode") 
				{
					mngr.LoadNodePopup(e.target, mngr); 
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