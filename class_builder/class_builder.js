/**
 * Learning Universe Class Builder
 * Authors: Daniel Cushing and Dustin Reitstetter
 * Date: 11/21/15 
 */ 

 var canvas_lock = false; 

 function copyNode(canvas, node){
	 var radius = node.radius; 
 	 var fill = node.fill; 
 	 var top = node.top;
 	 var left = node.left; 
 	 var id = node.id;
	 var stroke = node.stroke;
	 var strokeWidth = node.strokeWidth;

 	 var n = new fabric.Circle({
 	 	radius: radius, 
 	 	fill : fill, 
 	 	top : top, 
 	 	left : left,
		stroke: stroke,
		strokeWidth: strokeWidth,		
 	 	id: id
 	 }); 

     n.hasControls = false; 
     n.hasBorders  = false; 
	 
	 //n.line;
	 //var lines = []
	 //n.line = lines;

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

	var lineEditor = false;
	var solid = false;
	var dotted = false;
	var from;
	var to;
	var nodes = [];
	var bnodes = [];

	var canvas = new fabric.Canvas('map');
	canvas.add(new fabric.Circle({ radius: 50, fill: '#fff', top: 50,  left: 50, stoke: 'white', strokeWidth: 5, id: 'tb_largeCircle' }));
	canvas.add(new fabric.Circle({ radius: 40, fill: '#fff', top: 200, left: 55, stoke: 'white', strokeWidth: 5, id: 'tb_mediumCircle' }));
	canvas.add(new fabric.Circle({ radius: 30, fill: '#fff', top: 320, left: 60, stoke: 'white', strokeWidth: 5, id: 'tb_smallCircle' }));

	canvas.add(new fabric.Line([60, 400, 120, 500], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	canvas.add(new fabric.Line([60, 525, 120, 625], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

	canvas.item(0).hasControls = canvas.item(0).hasBorders = false;
	canvas.item(1).hasControls = canvas.item(1).hasBorders = false;
	canvas.item(2).hasControls = canvas.item(2).hasBorders = false;
	canvas.item(3).hasControls = canvas.item(3).hasBorders = false;
	canvas.item(4).hasControls = canvas.item(4).hasBorders = false;

	canvas.add(new fabric.Line([180, 0, 180, 1000], { fill: 'black', stroke: 'black', strokeWidth: 4 }));
	canvas.item(5).lockMovementX = canvas.item(5).lockMovementY = true; 
	canvas.item(5).selectable = canvas.item(5).hasControls = canvas.item(5).hasBorders = false;

	canvas.item(3).lockMovementX = canvas.item(3).lockMovementY = true; 
	canvas.item(3).selectable = canvas.item(3).hasControls = canvas.item(3).hasBorders = false;

	canvas.item(4).lockMovementX = canvas.item(4).lockMovementY = true; 
	canvas.item(4).selectable = canvas.item(4).hasControls = canvas.item(4).hasBorders = false; 	

	canvas.on({

	  'mouse:down': function(e) {
	    if (e.target) {

	    	if(canvas_lock)
	    		showPopup(); 

	    	if(lineEditor === false)
			{
				e.target.opacity = 0.5;
			}

		    if(e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle"){
		      copyNode(canvas, e.target);  
		      e.target.id = "mapNode";  
		      mngr.addNode(e.target);
			  nodes.push(e.target);
			  var liness = [];
			  var temp = {
				node: e.target,
				lines: liness
			  };
			  bnodes.push(temp);
			  //alert(e.target.top);
			  //alert(temp.node.top);
		    }

		    //else if(e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted"){
		    //	copyEdge(canvas, e.target); 
		    //	e.target.id = "mapEdge"; 
		    //  	mngr.addEdge(e.target); 
		    //}
			
			if(e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
			{
				lineEditor = !lineEditor;
				if(e.target.id === "tb_lineSolid")
				{
					solid = !solid;
				}
				if(e.target.id === "tb_lineDotted")
				{
					dotted = !dotted;
				}
				if(lineEditor === true)
				{
					for(var i = 0; i < nodes.length; i++)
					{
						nodes[i].lockMovementX = true;
						nodes[i].lockMovementY = true;
						nodes[i].selectable = false;
					}
				}
				if(lineEditor === false)
				{
					for(var i = 0; i < nodes.length; i++)
					{
						nodes[i].lockMovementX = false;
						nodes[i].lockMovementY = false;
						nodes[i].selectable = true;
					}
				}
			}
			if(e.target.id === "mapNode")
			{
				from = e.target;
			}

	      	canvas.renderAll();
	    }
	  },

	  'mouse:up': function(e) {
	    if (e.target) {

	      if(lineEditor === false)
		  {
			if(e.target.left < 180 && e.target.id != "tb_lineSolid" && e.target.id != "tb_lineDotted"){
				canvas.remove(e.target); 
			}
			e.target.opacity = 1;
			canvas.renderAll();
		  }
		  if(lineEditor === true)
		  {
			  if(e.target.id === "mapNode")
				{
				to = e.target;
				//alert(from.x + " " + from.y + " " + to.x + " " + to.y);
				var line;
				if(dotted === true)
				{
					line = new fabric.Line([from.getCenterPoint().x, from.getCenterPoint().y, to.getCenterPoint().x, to.getCenterPoint().y], {
					fill: 'black',
					stroke: 'black',
					strokeWidth: 5,
					strokeDashArray: [5, 5],
					selectable: false
				});
				}
				if(solid === true)
				{
				line = new fabric.Line([from.getCenterPoint().x, from.getCenterPoint().y, to.getCenterPoint().x, to.getCenterPoint().y], {
					fill: 'black',
					stroke: 'black',
					strokeWidth: 5,
					selectable: false
				});
				}
				for(var i = 0; i < bnodes.length; i++)
				{
					if(bnodes[i].node.top === from.top && bnodes[i].node.left === from.left)
					{
						bnodes[i].lines.push(line);
					}
					if(bnodes[i].node.top === e.target.top && bnodes[i].node.left === e.target.left)
					{
						bnodes[i].lines.push(line);
					}
					
				}
				from.line = line;
				//e.target.line.push(line);
				canvas.add(to);
				canvas.add(from);
				canvas.add(line);
				canvas.sendToBack(line);
				canvas.renderAll();
			}
		  }
	    }
	  },

	  'object:moved': function(e) {
	    e.target.opacity = 0.5;
	  },

	  'object:modified': function(e) {
	    e.target.opacity = 1;
	  },
	  
	  'mouse:over': function(e){
		if(e.target.id === "mapNode")
		{
			e.target.setStroke('green');
			canvas.renderAll();
		}
	  },
	
	  'mouse:out': function(e){
		if(e.target.id === "mapNode")
		{
			e.target.setStroke('white');
			canvas.renderAll();
		}
	  },
	
	  'object:selected' : function(e){
	  },
	  
	  'object:moving' : function(e) {
		  var p;
		  for(var i = 0; i < bnodes.length; i++)
				{
					if(bnodes[i].node.top === e.target.top && bnodes[i].node.left === e.target.left)
					{
						p = bnodes[i];
					}
				}
		  if(p.lines.length != 0)
		  {
		  for(var j = 0; j < p.lines.length; j++)
		  {
		  if(p.node.left+2*p.node.radius > p.lines[j].x1 && p.node.left < p.lines[j].x1 && p.node.top+2*p.node.radius > p.lines[j].y1 && p.node.top < p.lines[j].y1)
		  {
			p.lines[j].set({'x1': p.node.getCenterPoint().x, 'y1': p.node.getCenterPoint().y});
		  }
		  if(p.node.left+2*p.node.radius > p.lines[j].x2 && p.node.left < p.lines[j].x2 && p.node.top+2*p.node.radius > p.lines[j].y2 && p.node.top < p.lines[j].y2)
		  {
			p.lines[j].set({'x2': p.node.getCenterPoint().x, 'y2': p.node.getCenterPoint().y});	
		  }
		  }
		  //p.line.set({'x1': p.getCenterPoint().x, 'y1': p.getCenterPoint().y});
		  //p.line.set({'x1': p.left, 'y1': p.top });
		  canvas.renderAll();
		  }
	  }

	});

});

function lockCanvas(){
	if(canvas_lock)
		canvas_lock = false; 
	else
		canvas_lock = true; 
}

function showPopup(){
	if(canvas_lock){
		$("#canvas").hide(); 
		$("#popup").show(); 
	}
}

function savePopup(){
	var title = $("#title").val();
	var desc = $("#description").val(); 

	var _data = 'title=' + title + '&description=' + desc; 

	$.ajax({
		async: false, 
		type: "POST", 
		url: "class_builder.php",
		data: _data, 
		success: function(result){
			$("#popup").hide(); 
			$("#canvas").show(); 
		}
	}); 
}
