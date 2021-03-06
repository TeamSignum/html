/*
 * Learning Universe Concept Builder
 * Date: 1/26/16 
 */ 

var mngr;
var canvas;
var isDown = false;
var cline;
var fromn;
var timeOut;
var drag = false;
var xpos;
var ypos;

$( document ).ready(function() {

	var mapNodeId = "mapNode"; // Id for all nodes that end up on the map

	canvas = new fabric.Canvas('map');
	// canvas.setBackgroundImage('../imports/images/maxresdefault.jpg' , canvas.renderAll.bind(canvas), {
 //    });

	canvas.selection = false;
	
	mngr = new MManager(canvas, true, 1); // Construct map manager
	mngr.LoadIds(2); // Get the last id from the node table
	mngr.LoadMap(mngr, 2, 1);
	mngr.LoadEdges(mngr, 2, 1);
	mngr.LoadConnections(2);

	// We manually add Nodes and Edges to toolbar because it will be different for each view. But the dividing line and the lock and upload icon 
	// should stay the same (added on when we create map manager).
	
	//Set up the titles and icons for the toolbar
	var ctext = new fabric.Text("Concept Node", {
		fontFamily: 'arial black',
		fontSize: 17,
		fill: 'white',
		top: 110,
		left: 30
	});
	ctext.hasControls = false;
	ctext.hasBorders = false;
	ctext.lockMovementX = true;
	ctext.lockMovementY = true;
	ctext.selectable = false;
	canvas.add(ctext);
	
	//Concept tool
	var imgElement = document.getElementById('my-image1');
	var c = new fabric.Image(imgElement, {
	  left: 45,
	  top: 135,
	  id: "tb_concept"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.25);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);
	
	var atext = new fabric.Text("Assignment Node", {
		fontFamily: 'arial black',
		fontSize: 16,
		fill: 'white',
		top: 255,
		left: 20
	});
	atext.hasControls = false;
	atext.hasBorders = false;
	atext.lockMovementX = true;
	atext.lockMovementY = true;
	atext.selectable = false;
	canvas.add(atext);

	//Assignment tool
	imgElement = document.getElementById('my-image2');
	c = new fabric.Image(imgElement, {
	  left: 45,
	  top: 275,
	  id: "tb_assignment"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.25);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);
	
	var qtext = new fabric.Text("Quiz Node", {
		fontFamily: 'arial black',
		fontSize: 17,
		fill: 'white',
		top: 395,
		left: 55
	});
	qtext.hasControls = false;
	qtext.hasBorders = false;
	qtext.lockMovementX = true;
	qtext.lockMovementY = true;
	qtext.selectable = false;
	canvas.add(qtext);

	//Quiz tool
	imgElement = document.getElementById('my-image3');
	c = new fabric.Image(imgElement, {
	  left: 45,
	  top: 415,
	  id: "tb_quiz"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.25);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);
	
	//Line editors
	var ltext = new fabric.Text("Line Editors", {
		fontFamily: 'arial black',
		fontSize: 17,
		fill: 'white',
		top: 540,
		left: 40
	});
	ltext.hasControls = false;
	ltext.hasBorders = false;
	ltext.lockMovementX = true;
	ltext.lockMovementY = true;
	ltext.selectable = false;
	canvas.add(ltext);

	mngr.AddToolbarEdge(new fabric.Line([60, 570, 120, 670], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	mngr.AddToolbarEdge(new fabric.Line([60, 695, 120, 795], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

	canvas.hoverCursor = 'pointer';
	
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
	    if (e.target) {

	    	mngr.LockOrUpload(e.target, 2); 
			//Event to copy a node onto the map
	    	if(mngr.lineEdit == false && e.target.id === "tb_concept")
	    	{
				$("#tb_concepttt").hide();
			
		    	mngr.CopyNode(e.target, mapNodeId, "concept"); // copy an assignment node over with id mapNodeId and type concept
		    }
		    else if(mngr.lineEdit == false && e.target.id === "tb_assignment")
		    {
				$("#tb_assignmenttt").hide();
			
		    	mngr.CopyNode(e.target, mapNodeId, "assignment");
		    }
		    else if(mngr.lineEdit == false && e.target.id === "tb_quiz")
		    {
				$("#tb_quiztt").hide();
			
		    	mngr.CopyNode(e.target, mapNodeId, "quiz");
		    }
			//Line editor event
			else if(e.target.id === "tb_lineSolid")
			{
				//Lock all the nodes on the canvas to allows lines to be dragged from one node to the next
				mngr.LineEditor(e.target, true);
				if(mngr.lineEdit == true)
				{
					var cobjs = canvas.getObjects();
					for(var i = 0; i < cobjs.length; i++)
					{
						if(cobjs[i].id)
						{
							if(cobjs[i].id === "tb_concept" || cobjs[i].id === "tb_assignment" || cobjs[i].id === "tb_quiz")
							{
								cobjs[i].lockMovementX = true;
								cobjs[i].lockMovementY = true;
							}
						}
					}
				}
				else
				{
					//Unlock all the nodes
					var cobjs = canvas.getObjects();
					for(var i = 0; i < cobjs.length; i++)
					{
						if(cobjs[i].id)
						{
							if(cobjs[i].id === "tb_concept" || cobjs[i].id === "tb_assignment" || cobjs[i].id === "tb_quiz")
							{
								cobjs[i].lockMovementX = false;
								cobjs[i].lockMovementY = false;
							}
						}
					}
				}
			}
			else if(e.target.id === "tb_lineDotted")
			{
				//Lock all the nodes on the canvas to allows lines to be dragged from one node to the next
				mngr.LineEditor(e.target, false);
				if(mngr.lineEdit == true)
				{
					var cobjs = canvas.getObjects();
					for(var i = 0; i < cobjs.length; i++)
					{
						if(cobjs[i].id)
						{
							if(cobjs[i].id === "tb_concept" || cobjs[i].id === "tb_assignment" || cobjs[i].id === "tb_quiz")
							{
								cobjs[i].lockMovementX = true;
								cobjs[i].lockMovementY = true;
							}
						}
					}
				}
				else
				{
					//Unlock all the nodes
					var cobjs = canvas.getObjects();
					for(var i = 0; i < cobjs.length; i++)
					{
						if(cobjs[i].id)
						{
							if(cobjs[i].id === "tb_concept" || cobjs[i].id === "tb_assignment" || cobjs[i].id === "tb_quiz")
							{
								cobjs[i].lockMovementX = false;
								cobjs[i].lockMovementY = false;
							}
						}
					}
				}
			}
			else if(mngr.lineEdit == false && (e.target.id === mapNodeId || e.target.id === "popupnode"))
			{
				//Handle node and popup selections
				mngr.HandleMapNodeSelect(e.target);
			}
			else if(e.target.id === "deleteNode")
			{
				//Delete a node
				mngr.DeleteNode(e.target.node, 2);
			}
			else if(mngr.lineEdit == true)
			{
				//If we are on a node create a new line
				if(e.target.id === "mapNode")
				{
					//Set initial line coords x1,y1 = x2,y2
					fromn = e.target;
					isDown = true;
					var x = e.target.getCenterPoint().x;
					var y = e.target.getCenterPoint().y;
					var points = [x, y, x, y];
					if(mngr.solid == true)
					{
						cline = new fabric.Line(points, {
							fill: 'white',
							stroke: 'white',
							strokeWidth: 3,
							selectable: false,
							id: "solid"
						});
					}
					else
					{
						cline = new fabric.Line(points, {
							fill: 'white',
							stroke: 'white',
							strokeWidth: 3,
							strokeDashArray: [5, 5],
							selectable: false,
							id: "dotted"
						});
					}
					
					//Calculate the correct angle for the triangle for direct arrow
					var headLength = 15;
					
					var x1 = x;
					var y1 = y;
					var x2 = x;
					var y2 = y;
					
					var dx = x2 - x1;
					var dy = y2 - y1;

					var angle = Math.atan2(dy, dx);
					
					angle *= 180 / Math.PI;
					angle += 90;
					
					//Create the triangle
					var triangle = new fabric.Triangle({
						angle: angle,
						fill: 'white',
						top: y2,
						left: x2,
						height: headLength,
						width: headLength,
						id: "arrowhead",
						originX: 'center',
						originY: 'center',
						selectable: false
					});
					
					cline.trian = triangle;
					
					canvas.add(cline);
					canvas.add(triangle);
				}
			}


	      	canvas.renderAll();
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
	  
	  'mouse:move': function(e) {
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
		
		if(isDown == false)
		{
			return;
		}
		else
		{
			if(e.target)
			{
				//As the line is being dragged if we hit a node snap the end of the line to the top of the node
				var temp;
				if(e.target.id === "mapNode")
				{
					temp = e.target;
				}
				if(e.target.id === "nodeText")
				{
					temp = e.target.node;
				}
				if(e.target.id === "popupnode")
				{
					temp = e.target.node;
				}
				if(e.target.id === "deleteNode")
				{
					temp = e.target.node;
				}
				var x = temp.getCenterPoint().x;
				var y = temp.title.top - 5;
				cline.set({ x2: x, y2: y });
				
				//Recalculate the angle for the triangle for the directed arrow
				var x1 = cline.x1;
				var y1 = cline.y1;
				var x2 = x;
				var y2 = y;
					
				var dx = x2 - x1;
				var dy = y2 - y1;

				var angle = Math.atan2(dy, dx);
					
				angle *= 180 / Math.PI;
				angle += 90;
				
				cline.trian.angle = angle;
				cline.trian.top = y2;
				cline.trian.left = x2;
			}
			else
			{
				//As the line is being dragged update the end of the line to the current mouse coords
				var pointer = canvas.getPointer(e.target);
				cline.set({ x2: pointer.x, y2: pointer.y });
				
				//Recalculate the angle for the triangle for the directed arrow
				var x1 = cline.x1;
				var y1 = cline.y1;
				var x2 = pointer.x;
				var y2 = pointer.y;
					
				var dx = x2 - x1;
				var dy = y2 - y1;

				var angle = Math.atan2(dy, dx);
					
				angle *= 180 / Math.PI;
				angle += 90;
				
				cline.trian.angle = angle;
				cline.trian.top = y2;
				cline.trian.left = x2;
			}
			canvas.renderAll();
		}
	  },

	  'mouse:up': function(e) {
		drag = false;
		
		if(isDown)
		{
			if(e.target)
			{
				//On mouse up if we are on a node set the final coords of the line
				var temp;
				if(e.target.id === "mapNode")
				{
					temp = e.target;
				}
				if(e.target.id === "nodeText")
				{
					temp = e.target.node;
				}
				if(e.target.id === "popupnode")
				{
					temp = e.target.node;
				}
				if(e.target.id === "deleteNode")
				{
					temp = e.target.node;
				}
				
				if(temp.nid != fromn.nid)
				{
					//Set the lines controls
					cline.eid = mngr.eid;
					cline.hasControls = cline.hasBorders = false;
					cline.lockMovementX = cline.lockMovementY = true;
					cline.perPixelTargetFind = true;
					
					cline.trian.hasControls = false;
					cline.trian.hasBorders = false;
					cline.trian.lockMovementX = true;
					cline.trian.lockMovementY = true;
				
					//Push the line to the to and from nodes
					fromn.lines.push(cline);
					fromn.lines2.push(1);
					temp.lines.push(cline);
					temp.lines2.push(2);
				
					//Add the line to the map manager
					var linetemp = {
						line: cline,
						id: mngr.eid
					};
				
					mngr.eid++;
					mngr.edges.push(linetemp);
					canvas.sendToBack(cline);
				}
			}
			else
			{
				//On mouse up if we are not on a node delete the line
				canvas.remove(cline);
				canvas.remove(cline.trian);
			}
			isDown = false;
		}
	  	if (e.target) {
	  		if (e.target.id === "mapNode"){
				mngr.AddNodeToCanvas(e.target);
	  		}
			//mngr.DrawEdgeBetweenNodes(e.target);
			canvas.renderAll();
		}
	  },

	  'object:moved': function(e) {
	    //e.target.opacity = 0.5;
	  },

	  'object:modified': function(e) {
	   	//e.target.opacity = 1;
	  },
	  
	  'text:changed': function(e) {
		if(e.target.id === "nodeText")
		{
			//Center title text when text is edited
			e.target.left = e.target.node.getCenterPoint().x - e.target.getWidth()/2;
		}
	  },
	  
	  'mouse:over': function(e){
		if(e.target.id === "deleteNode")
		{
			//Highlight delete X on mouseover
			e.target.fill = 'red';
			canvas.renderAll();
		}
		if(e.target.id === "tb_concept" || e.target.id === "tb_assignment" || e.target.id === "tb_quiz" || e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
		{
			//Set timeout for tooltips to appear
			timeOut = setTimeout(function(){
				showTooltip(e.target.id, e.target.top, e.target.left);
			}, 1000);
			//showTooltip(e.target.id, e.target.top, e.target.left);
		}
	  },
	
	  'mouse:out': function(e){
		if(e.target.id === "deleteNode")
		{
			//Dehighlight delete X on mouseout
			e.target.fill = 'white';
			canvas.renderAll();
		}
		if(e.target.id === "tb_concept" || e.target.id === "tb_assignment" || e.target.id === "tb_quiz" || e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
		{
			//Hide tooltip on mouseout
			clearTimeout(timeOut);
			hideTootltip(e.target.id);
		}
	  },
	
	  'object:moving' : function(e) {
		if(e.target.id === mapNodeId)
		{
			mngr.MoveNode(e.target);
			mngr.MoveEdges(e.target);
			canvas.renderAll();
		}
	  }
	});

	//Save map button
	$( "#p_Save" ).click(function() {
		mngr.SavePopup();
	});

	//Close popup button
	$( "#p_Cancel" ).click(function() {
		mngr.HidePopup();
	});
});

//Display helper message for the page
function HelpMessageHelper(){
	DisplayHelpMessage("concept_builder");
}

//Display tooltip for current tool
function showTooltip(type, top, left)
{
	var ttid = type + "tt";
	$("#" + ttid).show();
    $("#" + ttid).css({"position": "absolute", "top": top, "left": left, "background-color": "white", "width": "250px"});
}

//Hide tooltip
function hideTootltip(type)
{
	var ttid = type + "tt";
	$("#" + ttid).hide();
}