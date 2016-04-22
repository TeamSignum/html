/*
 * Learning Universe
 * Student concept view
 *
 * Student's view of the learning map for a specified concept node.
 */
 
var canvas;
var nid; 
var checked_off;
var mngr;
var timeOut;
var drag = false;
var xpos;
var ypos;

$( document ).ready(function() {

	canvas = new fabric.Canvas('map');
	// canvas.setBackgroundImage('../imports/images/maxresdefault.jpg' , canvas.renderAll.bind(canvas), {
 //    });
	
	canvas.selection = false;

	// Construct map manager
	mngr = new MManager(canvas, false, 1);

	//Load the learning map from the DB
	mngr.LoadMap(mngr, 2, 0);
	mngr.LoadEdges(mngr, 2, 0);
	mngr.LoadConnections(2);
	
	//Load participant nodes
	getParticipants();
	
	canvas.hoverCursor = 'pointer';
	
	//Animate the participant nodes
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		animateNode(mngr.nodes[i], i);
	}
	
	//Zoom mousewheel event
	$(window).on('mousewheel', function(e){
		e.preventDefault();
		e.stopPropagation();
		
		if(e.originalEvent.wheelDelta / 120 > 0) 
		{
			mngr.zoomIn();
		} 
		else 
		{
			mngr.zoomOut();
		}
	});
	
	//Canvas events
	canvas.on({

		'mouse:down': function(e) {
			if(e.target)
			{
				//Events for selecting a node or popup
				if (e.target.id === "mapNode" || e.target.id === "popupnode") 
				{
					clearTimeout(timeOut);
					//Sets node a current node the student is working on
					setParticipant(e.target.nid);
					getParticipants();
					mngr.HandleMapNodeSelect(e.target);
				}
			}
			else
			{
				//Panning starting coords
				var mpointer = canvas.getPointer(e.e);
				xpos = mpointer.x;
				ypos = mpointer.y;
				drag = true;
			}
	    },
		
		'mouse:move': function(e){
			if(drag == true)
			{
				//Panning, change window location to new mouse coords
				var mpointer = canvas.getPointer(e.e);
				var newxpos = mpointer.x;
				var newypos = mpointer.y;
				
				//window.scrollTo(document.body.scrollLeft + (xpos - e.pageX), document.body.scrollTop + (ypos - e.pageY));
				$(window).scrollTop($(window).scrollTop() + (ypos - newypos));
				$(window).scrollLeft($(window).scrollLeft() + (xpos - newxpos));
			}
		},
		
		'mouse:up': function(e){
			//Set panning off
			drag = false;
		},
	
		'mouse:over': function(e){
			//Old highlighting events
			if(e.target.id === "mapNode" || e.target.id === "cmapNode")
			{
				//e.target.setStroke('yellow');
				//canvas.renderAll();
			}
		},
	
		'mouse:out': function(e){
			//Old highlighting events
			if(e.target.id === "mapNode")
			{
				//e.target.setStroke('white');
			}
			if(e.target.id === "cmapNode")
			{
				//e.target.setStroke("#0d0");
			}
			//canvas.renderAll();
		}
	});

	//Check off node button
	$( "#checkoff" ).click(function() {
		mngr.CheckOffNode();
	});

	//Close popup button
	$( "#xmark" ).click(function() {
		mngr.HidePopup();
	});

});

//Sets up the animation loop for a participant node
function animateNode(n, ind){
	//Speed of animation
	var duration = 10000;
	
	//Orbital rotation angles
	var startAngle = fabric.util.getRandomInt(-180, 0);
	var endAngle = startAngle + 359;
	
	(function animate() {
		fabric.util.animate({
			startValue: startAngle,
			endValue: endAngle,
			duration: duration,
			
			easing: function(t, b, c, d) { return c*t/d + b; },
			
			onChange: function(angle) {
				angle = fabric.util.degreesToRadians(angle);
				
				//Radius of the orbit
				var radius = 100;
				radius = radius * mngr.canvasScale;
				
				//Get center points to orbit around
				var cx = n.getCenterPoint().x;
				var cy = n.getCenterPoint().y;
				
				//Calculate the position of the orbit
				var x = cx + radius * Math.cos(angle);
				var y = cy + radius * Math.sin(angle);
				
				//Update the positions of the participant node
				n.pnode.originX = 'center';
				n.pnode.originY = 'center';
				
				n.pnode.set({left: x, top: y}).setCoords();
				
				n.pnode.ptext.originX = 'center';
				n.pnode.ptext.originY = 'center';
				
				n.pnode.ptext.top = y + 2;
				n.pnode.ptext.left = x;
				
				//After updating each participant node render their new positions
				if(ind == mngr.nodes.length-1)
				{
					canvas.renderAll();
				}
			},
			onComplete: animate
		});
	})();
}

//Sets the node the student is currently working on
function setParticipant(nid)
{
	$.ajax({
		type: 'POST',
		url: "concept_view.php",
		dataType: 'html',
		data: {setp: nid},
		//async: false,
		
		success: function(result){
			//alert(result);
		}
	});
	
	return false;
}

//Gets the students completion percentage for each node
function getPercents()
{
	//Get the ids for each node
	var temp = [];
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		temp.push(mngr.nodes[i].nid);
	}
	$.ajax({
		async: true,
		type: 'POST',
		url: "concept_view.php",
		dataType: 'json',
		data: {userperc: temp},
		success: function(result){
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

//Draw the completion percentages for each node
function drawPercents(nid, count, total)
{
	//Find the correct node from the nid
	var temp;
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		if(mngr.nodes[i].nid == nid)
		{
			temp = mngr.nodes[i];
		}
	}
	
	var perc = "0%";
	
	//Calculate the percentage
	if(count != 0)
	{
		var p = Math.floor((parseFloat(count) / parseFloat(total)) * 100);
		perc = p + "%";
	}
	
	//Add text for the percentage
	var t = new fabric.Text(perc, {
		fontFamily: 'arial black',
		fontSize: 20,
		left: temp.left,
		top: temp.top + temp.radius
	});

	t.lockMovementX = t.lockMovementY = true;
	t.selectable = t.hasControls = t.hasBorders = false;

	var len = t.getWidth()/2;
	var cenX = temp.getCenterPoint().x;
	t.left = cenX - len;
	
	//canvas.add(t);
}

//Display helper message for the page
function HelpMessageHelper(){
	DisplayHelpMessage("concept_view");
}

//Get the number of participants for each node from the database(current number of students working on a node)
function getParticipants()
{
	//Get the ids for each node
	var temp = [];
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		temp.push(mngr.nodes[i].nid);
	}
	$.ajax({
		async: true,
		type: 'GET',
		url: "concept_view.php",
		dataType: 'json',
		data: {pnodes: temp},
		
		success: function(result){
			//alert(result);
			//Foreach node update the participant number
			for(var i = 0; i < result.length; i++)
			{
				if(result[i].count != null)
				{
					drawParticipants(result[i].nid, result[i].count);
				}
			}
			canvas.renderAll();
			//Set timeout to update participants every 15 secs
			timeOut = setTimeout(function(){
				getParticipants();
			}, 15000);
		}
	});
	
	return false;
}

//Update the number in the participant node
function drawParticipants(nid, count)
{
	//Find the correct node from the nid
	var temp;
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		if(mngr.nodes[i].nid == nid)
		{
			temp = mngr.nodes[i];
		}
	}
	
	//Update the new number
	temp.pnode.ptext.setText(count);
}