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

	var imgElement = document.getElementById('my-image1');
	var c = new fabric.Image(imgElement, {
	  left: 50,
	  top: 50,
	  id: "tb_largeCircle"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.25);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	c = new fabric.Image(imgElement, {
	  left: 55,
	  top: 200,
	  id: "tb_mediumCircle"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.20);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	c = new fabric.Image(imgElement, {
	  left: 60,
	  top: 320,
	  id: "tb_smallCircle"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.15);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	mngr.AddToolbarEdge(new fabric.Line([60, 400, 120, 500], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	mngr.AddToolbarEdge(new fabric.Line([60, 525, 120, 625], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

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
	  },
	
	  'mouse:out': function(e){
		if(e.target.id === mapNodeId)
		{
			//De-Highlight node
			//e.target.setStroke('white');
			//canvas.renderAll();
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