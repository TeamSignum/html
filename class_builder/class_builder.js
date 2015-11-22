/**
 * Learning Universe Class Builder
 * Authors: Daniel Cushing and Dustin Reitstetter
 * Date: 11/21/15 
 */ 

 function copyNode(canvas, node){
	 var radius = node.radius; 
 	 var fill = node.fill; 
 	 var top = node.top;
 	 var left = node.left; 
 	 var id = node.id; 

 	 var n = new fabric.Circle({
 	 	radius: radius, 
 	 	fill : fill, 
 	 	top : top, 
 	 	left : left, 
 	 	id: id 
 	 }); 

     n.hasControls = false; 
     n.hasBorders  = false; 

     canvas.add(n);  
 }

 function copyEdge(canvas, edge){
 	var x1 = edge.x1; 
 	var x2 = edge.x2; 
 	var y1 = edge.y1; 
 	var y2 = edge.y2; 
 	var fill = edge.fill; 
 	var stroke = edge.stroke; 
 	var strokeWidth = edge.strokeWidth; 
 	var id = edge.id; 
 	var dotted; 
 	var e; 

 	if (id === "tb_lineDotted"){
 		dotted = edge.strokeDashArray; 
 	}

 	e = new fabric.Line([x1, y1, x2, y2], {
		fill: fill, 
		stroke: stroke, 
		strokeWidth: strokeWidth, 
		strokeDashArray: dotted,
		id: id
 	}); 

 	e.hasControls = true; 
 	e.hasBorders  = true; 

 	canvas.add(e); 
 }

$( document ).ready(function() {

	var mngr = new MM.Manager(); 

	var canvas = new fabric.Canvas('map');
	canvas.add(new fabric.Circle({ radius: 50, fill: '#fff', top: 50,  left: 50, id: 'tb_largeCircle' }));
	canvas.add(new fabric.Circle({ radius: 40, fill: '#fff', top: 200, left: 55, id: 'tb_mediumCircle' }));
	canvas.add(new fabric.Circle({ radius: 30, fill: '#fff', top: 320, left: 60, id: 'tb_smallCircle' }));

	canvas.add(new fabric.Line([60, 400, 120, 500], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	canvas.add(new fabric.Line([60, 525, 120, 625], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

	canvas.item(0).hasControls = canvas.item(0).hasBorders = false;
	canvas.item(1).hasControls = canvas.item(0).hasBorders = false;
	canvas.item(2).hasControls = canvas.item(0).hasBorders = false;
	canvas.item(3).hasControls = canvas.item(0).hasBorders = false;
	canvas.item(4).hasControls = canvas.item(0).hasBorders = false;

	canvas.add(new fabric.Line([180, 0, 180, 1000], { fill: 'black', stroke: 'black', strokeWidth: 4 }));
	canvas.item(5).lockMovementX = canvas.item(5).lockMovementY = true; 
	canvas.item(5).selectable = canvas.item(5).hasControls = canvas.item(5).hasBorders = false; 

	canvas.on({

	  'mouse:down': function(e) {
	    if (e.target) {
	    	e.target.opacity = 0.5;

		    if(e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle"){
		      copyNode(canvas, e.target);  
		      e.target.id = "mapNode";  
		      mngr.addNode(e.target); 
		    }

		    else if(e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted"){
		    	copyEdge(canvas, e.target); 
		    	e.target.id = "mapEdge"; 
		      	mngr.addEdge(e.target); 
		    }

	      	canvas.renderAll();
	    }
	  },

	  'mouse:up': function(e) {
	    if (e.target) {

	      if(e.target.left < 180){
	      	canvas.remove(e.target); 
	      }
	      
	      e.target.opacity = 1;
	      canvas.renderAll();
	    }
	  },

	  'object:moved': function(e) {
	    e.target.opacity = 0.5;
	  },

	  'object:modified': function(e) {
	    e.target.opacity = 1;
	  }

	});

});
