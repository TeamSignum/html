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

$( document ).ready(function() {

	var mapNodeId = "mapNode"; // Id for all nodes that end up on the map

	canvas = new fabric.Canvas('map');
	canvas.setBackgroundImage('../imports/images/maxresdefault.jpg' , canvas.renderAll.bind(canvas), {
    });


	mngr = new MManager(canvas, true, 1); // Construct map manager
	mngr.LoadIds(2); // Get the last id from the node table
	mngr.LoadMap(mngr, 2, 1);
	mngr.LoadEdges(mngr, 2, 1);
	mngr.LoadConnections(2);

	// We manually add Nodes and Edges to toolbar because it will be different for each view. But the dividing line and the lock and upload icon 
	// should stay the same (added on when we create map manager).
	
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
	
	//Canvas events
	canvas.on({

	  'mouse:down': function(e) {
	    if (e.target) {

	    	mngr.LockOrUpload(e.target, 2); 

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
			else if(e.target.id === "tb_lineSolid")
			{
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
				mngr.HandleMapNodeSelect(e.target);
			}
			else if(e.target.id === "deleteNode")
			{
				mngr.DeleteNode(e.target.node, 2);
			}
			else if(mngr.lineEdit == true)
			{
				if(e.target.id === "mapNode")
				{
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
							strokeWidth: 5,
							selectable: false,
							id: "solid"
						});
					}
					else
					{
						cline = new fabric.Line(points, {
							fill: 'white',
							stroke: 'white',
							strokeWidth: 5,
							strokeDashArray: [5, 5],
							selectable: false,
							id: "dotted"
						});
					}
					canvas.add(cline);
				}
			}


	      	canvas.renderAll();
	    }
	  },
	  
	  'mouse:move': function(e) {
		if(isDown == false)
		{
			return;
		}
		else
		{
			if(e.target)
			{
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
				var y = temp.getCenterPoint().y;
				cline.set({ x2: x, y2: y });
			}
			else
			{
				var pointer = canvas.getPointer(e.target);
				cline.set({ x2: pointer.x, y2: pointer.y });
			}
			canvas.renderAll();
		}
	  },

	  'mouse:up': function(e) {
		if(isDown)
		{
			if(e.target)
			{
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
					cline.eid = mngr.eid;
					cline.hasControls = cline.hasBorders = false;
					cline.lockMovementX = cline.lockMovementY = true;
					cline.perPixelTargetFind = true;
				
					fromn.lines.push(cline);
					fromn.lines2.push(1);
					temp.lines.push(cline);
					temp.lines2.push(2);
				
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
				canvas.remove(cline);
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
	    e.target.opacity = 0.5;
	  },

	  'object:modified': function(e) {
	   	e.target.opacity = 1;
	  },
	  
	  'text:changed': function(e) {
		if(e.target.id === "nodeText")
		{
			//Center title text when text is edited
			e.target.left = e.target.node.getCenterPoint().x - e.target.getWidth()/2;
		}
	  },
	  
	  'mouse:over': function(e){
		if(e.target.id === mapNodeId)
		{
			//Highlight node
			//e.target.setStroke('yellow');
			//canvas.renderAll();
		}
		if(e.target.id === "tb_concept" || e.target.id === "tb_assignment" || e.target.id === "tb_quiz" || e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
		{
			timeOut = setTimeout(function(){
				showTooltip(e.target.id, e.target.top, e.target.left);
			}, 1000);
			//showTooltip(e.target.id, e.target.top, e.target.left);
		}
	  },
	
	  'mouse:out': function(e){
		if(e.target.id === mapNodeId)
		{
			//De-Highlight node
			//e.target.setStroke('white');
			//canvas.renderAll();
		}
		if(e.target.id === "tb_concept" || e.target.id === "tb_assignment" || e.target.id === "tb_quiz" || e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
		{
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

	$( "#p_Save" ).click(function() {
		mngr.SavePopup();
	});

	$( "#p_Cancel" ).click(function() {
		mngr.HidePopup();
	});
});

function HelpMessageHelper(){
	DisplayHelpMessage("concept_builder");
}

function showTooltip(type, top, left)
{
	var ttid = type + "tt";
	$("#" + ttid).show();
    $("#" + ttid).css({"position": "absolute", "top": top, "left": left, "background-color": "white", "width": "250px"});
}

function hideTootltip(type)
{
	var ttid = type + "tt";
	$("#" + ttid).hide();
}