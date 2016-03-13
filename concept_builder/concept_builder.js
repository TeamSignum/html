/*
 * Learning Universe Concept Builder
 * Date: 1/26/16 
 */ 

 var mngr;
 var canvas;

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
	canvas.add(ltext);

	mngr.AddToolbarEdge(new fabric.Line([60, 570, 120, 670], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	mngr.AddToolbarEdge(new fabric.Line([60, 695, 120, 795], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

	canvas.hoverCursor = 'pointer';
	
	//Canvas events
	canvas.on({

	  'mouse:down': function(e) {
	    if (e.target) {

	    	mngr.LockOrUpload(e.target, 2); 

	    	if(e.target.id === "tb_concept")
	    	{
		    	mngr.CopyNode(e.target, mapNodeId, "concept"); // copy an assignment node over with id mapNodeId and type concept
		    }
		    else if(e.target.id === "tb_assignment")
		    {
		    	mngr.CopyNode(e.target, mapNodeId, "assignment");
		    }
		    else if(e.target.id === "tb_quiz")
		    {
		    	mngr.CopyNode(e.target, mapNodeId, "quiz");
		    }
			else if(e.target.id === "tb_lineSolid")
			{
				mngr.LineEditor(e.target, true);
			}
			else if(e.target.id === "tb_lineDotted")
			{
				mngr.LineEditor(e.target, false);
			}
			else if(e.target.id === mapNodeId || e.target.id === "popupnode")
			{
				mngr.HandleMapNodeSelect(e.target);
			}
			else if(e.target.id === "deleteNode")
			{
				mngr.DeleteNode(e.target.node, 2);
			}


	      	canvas.renderAll();
	    }
	  },

	  'mouse:up': function(e) {
	  	if (e.target) {
	  		if (e.target.id === "mapNode"){
				mngr.AddNodeToCanvas(e.target);
	  		}
			mngr.DrawEdgeBetweenNodes(e.target);
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
			showTooltip(e.target.id, e.target.top, e.target.left);
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