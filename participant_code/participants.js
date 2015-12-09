// JavaScript Document
var _top;
var _left;
var _radius;
var _participants;
var _maxParticipants = 12;

// ajax call to get node info and process it
function getNodeInfo() {
	$.ajax({
		async: true,
		type: 'POST',
		url: "participants.php",
		datatpye: "json",
		success: function(result){
			var parsedResult = JSON.parse(result);
			//alert(parsedResult);
			_top = parsedResult[0].top;
			_left = parsedResult[0].left;
			_radius = parsedResult[0].radius;
			_participants = Math.min(parsedResult[0].participants, _maxParticipants);  // makes sure the number of participant nodes isn't greater than _maxParticipants

			drawParticipantsNodes();
		}
		
			
	});
}

function drawParticipantNodes(){
	
	// calculate the center of the node we're drawing around
	var nodeCenterX = _left + _radius;
	var nodeCenterY = _top - radius;
	
	// determine the angle between each participant node
	var participantNodeSpacing = (Math.PI * 2) / _participants;

	for (var i = _participants - 1; i >= 0; i--) {
		//
		var currentAngle = i * participantNodeSpacing;

		//draw the circle
		var participantNode = new fabric.Circle({
			radius: 5,
			left: nodeCenterX + Math.cos(currentAngle) * (_radius + 5);  // need to verify this math
			top: nodeCenterY + Math.cos(currentAngle) * (_radius + 5);  // need to verify this math
			fill: '#B80000 '
		});
		
		canvas.add(participantNode);
}