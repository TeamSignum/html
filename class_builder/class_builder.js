/*
 * Learning Universe Class Builder
 * Authors: Daniel Cushing and Dustin Reitstetter
 * Date: 1/17/16 
 */ 

 var mngr;
 var canvas;

$( document ).ready(function() {

	var mapNodeId = "mapNode";

	// Create canvas
	canvas = new fabric.Canvas('map');

    canvas.setBackgroundImage('../imports/images/maxresdefault.jpg' , canvas.renderAll.bind(canvas), {
    });

	// Construct map manager
	mngr = new MManager(canvas, true, 0);
	mngr.LoadIds(1);
	mngr.LoadMap(mngr, 1, 1);
	mngr.LoadEdges(mngr, 1, 1);
	mngr.LoadConnections(1);

	// We manually add Nodes and Edges to toolbar because it will be different for each view. But the dividing line and the lock and upload icon 
	// should stay the same (added on when we create map manager).
	
	var ctext = new fabric.Text("Concept Nodes", {
		fontFamily: 'arial black',
		fontSize: 17,
		fill: 'white',
		top: 110,
		left: 25
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
	  id: "tb_largeCircle"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.25);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	c = new fabric.Image(imgElement, {
	  left: 55,
	  top: 265,
	  id: "tb_mediumCircle"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.20);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	c = new fabric.Image(imgElement, {
	  left: 65,
	  top: 380,
	  id: "tb_smallCircle"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.15);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);
	
	var ltext = new fabric.Text("Line Editors", {
		fontFamily: 'arial black',
		fontSize: 17,
		fill: 'white',
		top: 470,
		left: 40
	});
	ltext.hasControls = false;
	ltext.hasBorders = false;
	ltext.lockMovementX = true;
	ltext.lockMovementY = true;
	canvas.add(ltext);

	mngr.AddToolbarEdge(new fabric.Line([60, 500, 120, 600], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	mngr.AddToolbarEdge(new fabric.Line([60, 625, 120, 725], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

	canvas.hoverCursor = 'pointer';
	
	//Canvas events
	canvas.on({

	  'mouse:down': function(e) {
	    if (e.target) {

	    	mngr.LockOrUpload(e.target, 1); 

	    	if(e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle" )
	    	{
		    	mngr.CopyNode(e.target, mapNodeId, "concept");
		    }
			else if(e.target.id === "tb_lineSolid")
			{
				mngr.LineEditor(e.target, true);
			}
			else if(e.target.id === "tb_lineDotted"){
				mngr.LineEditor(e.target, false);
			}
			else if(e.target.id === mapNodeId || e.target.id === "popupnode")
			{
				mngr.HandleMapNodeSelect(e.target);
			}
			else if(e.target.id === "deleteNode")
			{
				mngr.DeleteNode(e.target.node, 1);
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
		if(e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle" || e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
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
		if(e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle" || e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
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