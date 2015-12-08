/**
 * Learning Universe Class Builder
 * Authors: Daniel Cushing and Dustin Reitstetter
 * Date: 11/21/15 
 */ 

 var canvas_lock = false;
 var nodes = [];
 var mapLines = [];
 var nodeID;
 var edgeID;
 var bnodes = [];

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
   
   n.title;
 
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

	loadIDs();

	var mngr = new MM.Manager();

	var lineEditor = false;
	var solid = false;
	var dotted = false;
	var from;
	var to;

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

	fabric.Image.fromURL('../imports/images/lock.png', function(oImg) {
		oImg.scale(.2); 
		oImg.set({left: 30, top: 740, id: 'toolbarLock'}); 
		oImg.lockMovementX = oImg.lockMovementY = true; 
		oImg.hasControls = oImg.hasBorders = false; 
		canvas.add(oImg); 
	}); 

	fabric.Image.fromURL('../imports/images/upload.png', function(oImg) {
		oImg.scale(.1); 
		oImg.set({left: 110, top: 740, id: 'toolbarUpload'}); 
		oImg.lockMovementX = oImg.lockMovementY = true; 
		oImg.hasControls = oImg.hasBorders = false; 
		canvas.add(oImg); 
	}); 

	canvas.on({

	  'mouse:down': function(e) {
	    if (e.target) {
			if(e.target.id === "toolbarUpload")
			{
				saveMap();
			}

	    	if(canvas_lock)
	    		showPopup(); 

	    	if(lineEditor === false)
			{
				e.target.opacity = 0.5;
			}

			if(e.target.id === "toolbarUpload"){
				saveMap(); 
			}

		    if(e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle"){
		      copyNode(canvas, e.target);  
		      e.target.id = "mapNodet";  
		      mngr.addNode(e.target);
				  nodes.push(e.target);
				  var liness = [];
				  var temp = {
						node: e.target,
						id: nodeID,
						lines: liness
				  };
				  nodeID++;
			  	bnodes.push(temp);
		    }
				else if(e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
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
				else if(e.target.id === "mapNode")
				{
					from = e.target;
				}
				else if(e.target.id === "toolbarLock"){
					lockCanvas(); 
				}


	      canvas.renderAll();
	    }
	  },

	  'mouse:up': function(e) {
	    if (e.target) {
	      if(lineEditor === false)
		  {
			if(e.target.left < 180 && e.target.id != "tb_lineSolid" 
				&& e.target.id != "tb_lineDotted" && e.target.id != "toolbarLock" 
				&& e.target.id != "toolbarUpload"){
					canvas.remove(e.target.title);
					canvas.remove(e.target); 
			}
			e.target.opacity = 1;
			if(e.target.left > 180 && e.target.id === "mapNodet")
			{
				e.target.id = "mapNode";
				
				var title = new fabric.IText('Name', {
					fontFamily: 'arial black',
					fontSize: 25,
					left: e.target.left,
					top: e.target.top - 30,
					id: "nodeText"
					});
					
				title.node = e.target;
					
				var len = title.getWidth()/2;
				var cenX = e.target.getCenterPoint().x;
				title.left = cenX - len;
				
				title.hasControls = false;
				title.lockMovementX = true;
				title.lockMovementY = true;
				
				e.target.title = title;
				
				canvas.add(title);
				
			}
			canvas.renderAll();
		  }
		  if(lineEditor === true)
		  {
			  if(e.target.id === "mapNode")
				{
					to = e.target;
					var line;
					if(dotted === true)
					{
						line = new fabric.Line([from.getCenterPoint().x, from.getCenterPoint().y, to.getCenterPoint().x, to.getCenterPoint().y], {
							fill: 'black',
							stroke: 'black',
							strokeWidth: 5,
							strokeDashArray: [5, 5],
							selectable: false,
							id: "dotted"
						});
					}
					if(solid === true)
					{
						line = new fabric.Line([from.getCenterPoint().x, from.getCenterPoint().y, to.getCenterPoint().x, to.getCenterPoint().y], {
							fill: 'black',
							stroke: 'black',
							strokeWidth: 5,
							selectable: false,
							id: "solid"
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
					var temp = {
						line: line,
						id: edgeID
						};
					edgeID++;
					mapLines.push(temp);
					from.line = line;
					canvas.add(to);
					canvas.add(from);
					canvas.add(line);
					canvas.sendToBack(line);
					canvas.renderAll();
				}
				//mapLines.push(line);
				//from.line = line;
				//e.target.line.push(line);
				//canvas.add(to);
				//canvas.add(from);
				//canvas.add(line);
				//canvas.sendToBack(line);
				//canvas.renderAll();
				//saveMap();
			}
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
			e.target.left = e.target.node.getCenterPoint().x - e.target.getWidth()/2;
			//alert("test");
		}
	  },
	  
	  'mouse:over': function(e){
		if(e.target.id === "mapNode")
			{
				e.target.setStroke('yellow');
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
		  if(e.target.id === "mapNode")
		  {
			e.target.title.set({'top': e.target.top - 30, 'left': (e.target.getCenterPoint().x - e.target.title.getWidth()/2)});
			e.target.title.setCoords();
			
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
				canvas.renderAll();
			}
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
		//$("#canvas").hide(); 
		$("#popup").show(); 

		$.ajax({
			async: false, 
			type: 'POST',
			url: "load_node.php", 
			dataType: "json",
			success: function(result){
			}
		}); 
	}
}

function savePopup(){
	var title = $("#title").val();
	var desc = $("#description").val(); 

	var _data = 'title=' + title + '&description=' + desc; 

	$.ajax({
		async: false, 
		type: 'POST', 
		url: "class_builder.php",
		data: _data, 
		success: function(result){
			$("#popup").hide(); 
			$("#canvas").show(); 
		}
	}); 

	return false; 
}

function saveMap(){
	var map = [];
	var edges = [];
	for(var i = 0; i < bnodes.length; i++)
	{
		var t = bnodes[i].node.title.getText();
		var temp = {
			top: bnodes[i].node.top,
			left: bnodes[i].node.left,
			radius: bnodes[i].node.radius,
			fill: bnodes[i].node.fill,
			stroke: bnodes[i].node.stroke,
			strokeWidth: bnodes[i].node.strokeWidth,
			id: bnodes[i].id,
			type: bnodes[i].node.id,
			title: t
		};
		map.push(temp);
		//alert(bnodes[i].node.title.getText());
	}
	
	for(var i = 0; i < mapLines.length; i++)
	{
		var temp = {
			x1: mapLines[i].line.x1,
			y1: mapLines[i].line.y1,
			x2: mapLines[i].line.x2,
			y2: mapLines[i].line.y2,
			fill: mapLines[i].line.fill,
			stroke: mapLines[i].line.stroke,
			strokeWidth: mapLines[i].line.strokeWidth,
			type: mapLines[i].line.id,
			id: mapLines[i].id
		};
		edges.push(temp);
	}
	
	$.ajax({
		type: 'POST',
		url: "mapsave.php",
		dataType: 'html',
		data: {map: map, edges: edges},
		
		success: function(result){
			alert("Saved");
		}
	});
	
	return false;
}

function loadIDs()
{
	$.ajax({
		type: 'POST',
		url: "mapsave.php",
		dataType: 'json',
		data: {id: 1},
		
		success: function(result){
			nodeID = parseInt(result["mnid"]);
			edgeID = parseInt(result["meid"]);
			nodeID++;
			edgeID++;
			//alert(nodeID);
			//alert(edgeID);
		}
	});
	
	return false;
}
