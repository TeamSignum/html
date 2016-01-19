/*
 * Learning Universe Class Builder
 * Authors: Daniel Cushing and Dustin Reitstetter
 * Date: 1/17/16 
 */ 

$( document ).ready(function() {

	var mapNodeId = "mapNode";

	// Create canvas
	var canvas = new fabric.Canvas('map', {backgroundColor: "#99ffff"});

	// Construct map manager
	var mngr = new MManager(canvas);
	mngr.LoadIds();

	// We manually add Nodes and Edges to toolbar because it will be different for each view. But the dividing line and the lock and upload icon 
	// should stay the same (added on when we create map manager).
	mngr.AddToolbarNode(new fabric.Circle({ radius: 50, fill: '#fff', top: 50,  left: 50, stoke: 'white', strokeWidth: 5, id: 'tb_largeCircle' }));
	mngr.AddToolbarNode(new fabric.Circle({ radius: 40, fill: '#fff', top: 200, left: 55, stoke: 'white', strokeWidth: 5, id: 'tb_mediumCircle' }));
	mngr.AddToolbarNode(new fabric.Circle({ radius: 30, fill: '#fff', top: 320, left: 60, stoke: 'white', strokeWidth: 5, id: 'tb_smallCircle' }));

	mngr.AddToolbarEdge(new fabric.Line([60, 400, 120, 500], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	mngr.AddToolbarEdge(new fabric.Line([60, 525, 120, 625], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

	//Canvas events
	canvas.on({

	  'mouse:down': function(e) {
	    if (e.target) {

	    	mngr.LockOrUpload(e.target); 

	    	if(e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle")
		    {
		    	mngr.CopyNode(e.target, mapNodeId);
		    }
			else if(e.target.id === "tb_lineSolid")
			{
				mngr.LineEditor(e.target, true);
			}
			else if(e.target.id === "tb_lineDotted"){
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


	$("#p_Save").click(function(){
		mngr.SavePopup();
    });

    $("#p_Cancel").click(function(){
 		mngr.HidePopup($("#popup"));
    });

});
