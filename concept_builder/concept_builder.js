/*
 * Learning Universe Concept Builder
 * Date: 1/26/16 
 */ 

 var mngr;
 var canvas;

$( document ).ready(function() {

	var mapNodeId = "mapNode"; // Id for all nodes that end up on the map

	canvas = new fabric.Canvas('map');
	canvas.setBackgroundImage('../imports/images/stars.png' , canvas.renderAll.bind(canvas), {
    });


	mngr = new MManager(canvas, true, 1); // Construct map manager
	mngr.LoadIds(2); // Get the last id from the node table
	mngr.LoadMap(mngr, 2, 1);
	mngr.LoadEdges(mngr, 2, 1);
	mngr.LoadConnections(2);

	// We manually add Nodes and Edges to toolbar because it will be different for each view. But the dividing line and the lock and upload icon 
	// should stay the same (added on when we create map manager).
	var imgElement = document.getElementById('my-image1');
	var c = new fabric.Image(imgElement, {
	  left: 50,
	  top: 50,
	  id: "tb_concept"
	});
	c.scale(.25);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	imgElement = document.getElementById('my-image2');
	c = new fabric.Image(imgElement, {
	  left: 48,
	  top: 185,
	  id: "tb_assignment"
	});
	c.scale(.25);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	imgElement = document.getElementById('my-image3');
	c = new fabric.Image(imgElement, {
	  left: 48,
	  top: 320,
	  id: "tb_quiz"
	});
	c.scale(.25);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	mngr.AddToolbarEdge(new fabric.Line([60, 450, 120, 550], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	mngr.AddToolbarEdge(new fabric.Line([60, 575, 120, 675], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

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
			e.target.setStroke('yellow');
			canvas.renderAll();
		}
	  },
	
	  'mouse:out': function(e){
		if(e.target.id === mapNodeId)
		{
			//De-Highlight node
			e.target.setStroke('white');
			canvas.renderAll();
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
