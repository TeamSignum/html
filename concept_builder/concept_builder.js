/*
 * Learning Universe Concept Builder
 * Date: 1/26/16 
 */ 

$( document ).ready(function() {

	var mapNodeId = "mapNode"; // Id for all nodes that end up on the map

	var canvas = new fabric.Canvas('map', {backgroundColor: "#99ffff"}); // Create Canvas

	var mngr = new MManager(canvas); // Construct map manager
	mngr.LoadIds(); // Get the last id from the node table

	// We manually add Nodes and Edges to toolbar because it will be different for each view. But the dividing line and the lock and upload icon 
	// should stay the same (added on when we create map manager).
	mngr.AddToolbarNode(new fabric.Circle({ radius: 50, fill: '#fff', top: 50,  left: 50, stoke: '#fff', strokeWidth: 5, id: 'tb_concept' }));
	mngr.AddToolbarNode(new fabric.Circle({ radius: 50, fill: '#fdf5e6', top: 200, left: 50, stoke: '#fdf5e6', strokeWidth: 5, id: 'tb_assignment' }));
	mngr.AddToolbarNode(new fabric.Circle({ radius: 50, fill: '#faf0e6', top: 320, left: 50, stoke: '#faf0e6', strokeWidth: 5, id: 'tb_quiz' }));

	mngr.AddToolbarEdge(new fabric.Line([60, 450, 120, 550], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	mngr.AddToolbarEdge(new fabric.Line([60, 575, 120, 675], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

	//Canvas events
	canvas.on({

	  'mouse:down': function(e) {
	    if (e.target) {

	    	mngr.LockOrUpload(e.target); 

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
			else if(e.target.id === mapNodeId)
			{
				mngr.HandleMapNodeSelect(e.target);
			}

	      	canvas.renderAll();
	    }
	  },

	  'mouse:up': function(e) {
	  	if (e.target) {
			mngr.CheckBoundsAndAddText(e.target);
			mngr.DrawEdge(e.target);
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
			mngr.MoveNodeTitle(e.target);
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