/**
 * Learning Universe Node Manager
 * Authors: Daniel Cushing and Dustin Reitstetter
 * Date: 11/21/15 
 */ 

/*
 * Map Manager Constructor  
 */ 
var MManager = function(_canvas, builder, classOrConcept){
 	this.canvas   = _canvas;
 	this.nodes 	  = []; 
 	this.popupnodes = []; 
 	this.nid      = 1;
 	this.eid      = 1;
 	this.locked   = true;

 	this.edges 	  = []; 
 	this.lineEdit = false;

 	this.from; 
 	this.to;
 	this.solid = false;

 	this.crrnt;

 	this.result_nodes; 
 	this.result_edges;

 	this.mode = 0;
 	this.classOrConcept = classOrConcept;
 	this.popuped;
	
	this.canvasScale = 1;

 	if(builder){
 		this.mode = 1;
 		this.locked = false;
 		this.AddToolbar(); // Add the toolbar when you initialize the map manager
 	}
 }

/* ---------------------------------------- Map Node Functions ---------------------------------------- */

/* 
 * Copies a node from toolbar to canvas
 */
MManager.prototype.CopyNode = function(node, new_id, type){
	var top = node.top;
	var left = node.left; 
	var id = node.id;

	var imgElement; 
	if (type == "concept"){
		imgElement = document.getElementById('my-image1');
	}
	else if (type == "assignment"){
		imgElement = document.getElementById('my-image2');
	}
	else if (type == "quiz"){
		imgElement = document.getElementById('my-image3');
	}
	var c = new fabric.Image(imgElement, {
	  left: left,
	  top: top,
	  id: id 
	});
	c.scale(node.scaleX);
	c.hasBorders = c.hasControls = false;
	c.title;
	this.canvas.add(c);

	// set the id, nid, type, lines, lines2
	node.id = new_id;
	node.nid = this.nid;
	node.type = type;
	node.lines = [];
	node.lines2 = [];
	node.perPixelTargetFind = true;

	this.nodes.push(node);
	this.nid++;
}

/* 
 * Handles the selection of a map node.
 * TODO: Some of this is hardcoded and needs to change
 */
MManager.prototype.HandleMapNodeSelect = function (node){
	this.crrnt = node;

	if(node.id === "popupnode"){
		this.ShowPopup(node, $("#popup")); 
		this.popuped = true;
		this.ShowFiles();
	}
	if(node.id === "mapNode" && node.type === "concept" && this.classOrConcept == 0 && this.mode == 0){
		this.NavigateToConcept();
	}
	if(node.id === "mapNode" && this.mode == 1){
		this.from = node;
	}
}

// Gets the nid of the currnt node.
MManager.prototype.GetCurrentId = function(result){
	return this.crrnt.nid;
}

//Draw a node onto the canvas
MManager.prototype.DrawNode = function(top, left, radius, type, title, nodeID, fill, complete, availabledate, mode){

	// Different ndoes will use different images.
	var imgElement;
	if(type == "concept"){
		if(complete && mode == 0){
			imgElement = document.getElementById('my-image4');
		}
		else{
			imgElement = document.getElementById('my-image1');
		}
	}
	else if(type == "assignment"){
		if(complete && mode == 0){
			imgElement = document.getElementById('my-image5');
		}
		else{
			imgElement = document.getElementById('my-image2');
		}
	}
	else if(type == "quiz"){
		if(complete && mode == 0){
			imgElement = document.getElementById('my-image6');
		}
		else{
			imgElement = document.getElementById('my-image3');
		}
	}

	var c = new fabric.Image(imgElement, {
	  left: left,
	  top: top,
	  id: "mapNode"
	});

	// Used to determine if node should be active
	c.available = true;

	var today = new Date();

	if(availabledate!=null && mode == 0)
	{
		// Split timestamp into [ Y, M, D]
		var t = availabledate.split(/[- :]/);
		// Apply each element to the Date function
		var jsavailabledate = new Date(t[0], t[1]-1, t[2]);
		
		if(today < jsavailabledate){
			var filter = new fabric.Image.filters.Tint({
			  	color: '#3513B0',
			  	opacity: 0.5
			});
			c.filters.push(filter);
      		c.applyFilters();
      		c.available = false;
      		c.evented = false;
     	}
  	}

  	// Set a fixed width and height to force these images to always load.
	c.width = 463;
	c.height = 455;
	// Scale the image down because its to big.
	c.scale(.25);
	c.hasBorders = c.hasControls = false;
	canvas.add(c);

	c.nid = nodeID;
	c.type = type;
	c.lines = [];
	c.lines2 = [];

	this.LoadNodePopup(c, nodeID, type);
	this.nodes.push(c);

	if(mode == 0)
	{
		if(complete == 1)
		{
			c.compl = 1;
		}
		else
		{
			c.compl = 0;
		}
		c.lockMovementX = c.lockMovementY = true;

		var imgElement = document.getElementById('my-image-moon');
		var pc = new fabric.Image(imgElement, {
			top : top + 20, 
			left : left - 20,
			id: "partnode"
		});
		// pc.width = 80;
		// pc.height = 80;
		pc.scale(.25);

		// var pc = new fabric.Circle({
		// 		top: top + 20,
		// 		left: left - 20,
		// 		radius: 15,
		// 		fill: 'green',
		// 		stroke: 'white',
		// 		strokeWidth: 3, 
		// 		id: "partNode"
		// });
		
		pc.hasControls = false;
		pc.hasBorders = false;
		pc.lockMovementX = true;
		pc.lockMovementY = true;
		pc.selectable = false;
		
		canvas.add(pc);
		
		var pt = new fabric.Text("0", {
				fontFamily: 'arial black',
				fontSize: 12,
				left: left - 18,
				top: top + 20 + 10,
				id: "partText"
		});
		
		var plen = pt.getWidth()/2;
		var pcenX = pc.getCenterPoint().x;
		pt.left = pcenX - plen;
		
		pt.hasControls = false;
		pt.hasBorders = false;
		pt.lockMovementX = true;
		pt.lockMovementY = true;
		pt.selectable = false;
		
		pc.ptext = pt;
		
		c.pnode = pc;
		
		canvas.add(pt);
	}
	
	// If int he builder add an X for deleting ndoes.
	if(mode == 1)
	{
		var dt = new fabric.Text("X", {
			fontFamily: 'arial black',
			fill: 'white',
			fontSize: 15,
			left: left,
			top: top + 10,
			id: "deleteNode"
		});
		
		c.deletenode = dt;
		dt.node = c;
		
		dt.hasControls = false;
		dt.hasBorders = false;
		dt.lockMovementX = true;
		dt.lockMovementY = true;
		
		canvas.add(dt);
	}
	
	//Draw the title text
	var t = new fabric.Text(title, {
		fontFamily: 'arial black',
		fill: 'white',
		fontSize: 25,
		left: left,
		top: top - 20,
		id: "nodeText"
	});
	
	c.title = t;
	var len = t.getWidth()/2;
	var cenX = c.getCenterPoint().x;
	t.left = cenX - len;
	t.hasControls = false;
	t.hasBorders = false;
	t.lockMovementX = true;
	t.lockMovementY = true;
	t.selectable = false;
			
	mngr.canvas.add(t);
}

/* ---------------------------------------- Map Edge Functions ---------------------------------------- */

/* 
 * Puts the map into line editor mode.
 */ 
MManager.prototype.LineEditor = function(edge, solid){
	this.lineEdit = !this.lineEdit;
	this.solid = solid;

	for(var i = 0; i < this.nodes.length; i++)
	{
		if (this.lineEdit){
			edge.opacity = .5;
			this.nodes[i].lockMovementX = true;
			this.nodes[i].lockMovementY = true;
			this.nodes[i].selectable = false;
		}
		else {
			edge.opacity = 1;
			this.nodes[i].lockMovementX = false;
			this.nodes[i].lockMovementY = false;
			this.nodes[i].selectable = true;
		}
	}
}

/* 
 * Moves all the edges linked to a node when the node moves.
 */ 
MManager.prototype.MoveEdges = function (node){
	var radius = node.width * node.scaleX * .5;
	if(node){
		if(node.lines.length != 0)
		{
			//Foreach line connected to the node update its edge coords
			for(var j = 0; j < node.lines.length; j++)
			{
				//Old line movement code
				if(node.left+2*radius > node.lines[j].x1 && node.left < node.lines[j].x1 && node.top+2*radius > node.lines[j].y1 && node.top < node.lines[j].y1)
				{
					//node.lines[j].set({'x1': node.getCenterPoint().x, 'y1': node.getCenterPoint().y});
				}
				if(node.left+2*radius > node.lines[j].x2 && node.left < node.lines[j].x2 && node.top+2*radius > node.lines[j].y2 && node.top < node.lines[j].y2)
				{
					//node.lines[j].set({'x2': node.getCenterPoint().x, 'y2': node.getCenterPoint().y});	
				}
				//If x1,y1 side of line set the lines new x1,y1
				if(node.lines2[j] == 1)
				{
					node.lines[j].set({'x1': node.getCenterPoint().x, 'y1': node.getCenterPoint().y});
					node.lines[j].setCoords();
				}
				//If x2,y2 side of line set lines new x2,y2
				if(node.lines2[j] == 2)
				{
					node.lines[j].set({'x2': node.getCenterPoint().x, 'y2': node.title.top-5});
					node.lines[j].setCoords();
				}
				//Recalculate the angle for the triangle for directed arrows
				var x1 = node.lines[j].x1;
				var y1 = node.lines[j].y1;
				var x2 = node.lines[j].x2;
				var y2 = node.lines[j].y2;
					
				var dx = x2 - x1;
				var dy = y2 - y1;

				var angle = Math.atan2(dy, dx);
					
				angle *= 180 / Math.PI;
				angle += 90;
					
				node.lines[j].trian.angle = angle;
				node.lines[j].trian.top = y2;
				node.lines[j].trian.left = x2;
			}
		}
	}
}

/* 
 * Draws an edge between two nodes.
 */ 
MManager.prototype.DrawEdgeBetweenNodes = function(node){
	if(this.lineEdit && node.id === "mapNode"){

		this.to = node;

		var line;
		//Draw line
		if(this.solid === true)
		{
			line = new fabric.Line([this.from.getCenterPoint().x, this.from.getCenterPoint().y, this.to.getCenterPoint().x, this.to.getCenterPoint().y], {
				fill: 'white',
				stroke: 'white',
				strokeWidth: 5,
				selectable: false,
				id: "solid"
			});
		}
		else
		{
			line = new fabric.Line([this.from.getCenterPoint().x, this.from.getCenterPoint().y, this.to.getCenterPoint().x, this.to.getCenterPoint().y], {
				fill: 'white',
				stroke: 'white',
				strokeWidth: 5,
				strokeDashArray: [5, 5],
				selectable: false,
				id: "dotted"
			});
		}

		//Draw the triangle
		var triangle = new fabric.Triangle({
  			width: 20,
  			height: 30, 
  			fill: 'white', 
  			left: this.to.getCenterPoint().x, 
  			top: this.to.top
		});
		
		//Set line controls
		line.eid = this.eid;
		line.hasControls = line.hasBorders = false;
		line.lockMovementX = line.lockMovementY = true;
		line.perPixelTargetFind = true;
		line.arrow = triangle;

		//Add line to each node connected to the line
		this.from.lines.push(line);
		this.from.lines2.push(1);
		this.to.lines.push(line);
		this.to.lines2.push(2);
		
		//Add line to map manager
		var temp = {
			line: line,
			id: this.eid
		};

		this.eid++;
		this.edges.push(temp);
		this.canvas.add(line);
		this.canvas.add(triangle);
		this.canvas.sendToBack(line);
	}
}

/* 
 * Draws an edge given parameters.
 */ 
MManager.prototype.DrawEdge = function(eid, x1, y1, x2, y2, type, mode){
	var l;
	//Draw line
	if(type === "solid")
	{
		l = new fabric.Line([x1, y1, x2, y2], {
			fill: 'white',
			stroke: 'white',
			strokeWidth: 3,
			id: "solid"
		});
	}
	// Draw dotted line.
	if(type === "dotted")
	{
		l = new fabric.Line([x1, y1, x2, y2], {
			fill: 'white',
			stroke: 'white',
			strokeWidth: 3,
			strokeDashArray: [5, 5],
			id: "dotted"
		});
	}
	
	//Set line controls
	l.eid = eid;
	l.hasControls = l.hasBorders = false;
	l.lockMovementX = l.lockMovementY = true;
	l.perPixelTargetFind = true;
	l.selectable = false;
	
	//Add line to map manager
	var temp = {
		line: l,
		id: eid
	};
	
	//Calculate angle for triangle
	var headLength = 15;
					
	var dx = x2 - x1;
	var dy = y2 - y1;

	var angle = Math.atan2(dy, dx);
					
	angle *= 180 / Math.PI;
	angle += 90;
	
	//Draw triangle
	var triangle = new fabric.Triangle({
		angle: angle,
		fill: 'white',
		top: y2,
		left: x2,
		height: headLength,
		width: headLength,
		id: "arrowhead",
		originX: 'center',
		originY: 'center',
		selectable: false
	});
	
	//Set triangle controls
	triangle.hasBorders = false;
	triangle.hasControls = false;
	triangle.lockMovementX = true;
	triangle.lockMovementY = true;
	
	l.trian = triangle;
		
	this.edges.push(temp);
	canvas.add(l);
	canvas.sendToBack(l);
	canvas.add(triangle);
}


/* ---------------------------------------- Map Text Functions ---------------------------------------- */

/* 
 * Checks the bounds of a node and adds the text.
 */
MManager.prototype.AddNodeToCanvas = function(node){
	if(!this.lineEdit){
		// Check bounds on node and remove it if it goes out of bounds.
		if(node.left < (180*this.canvasScale) && node.id === "mapNode"){
				this.canvas.remove(node.title);
				this.canvas.remove(node); 
		}
		// If in bounds add it and add the text and pop up node.
		else if(node.left > (180*this.canvasScale) && node.id === "mapNode"){
			this.CreatePopupNode(node, this.CreatePopup(node.type), !node.title); 
			this.GenText(node);
		}
	}
}

/* 
 * Adds the text to the node.
 */
MManager.prototype.GenText = function(node){
	//Generate title for node
	if(!node.title){
		var title = new fabric.IText('Name', {
			fontFamily: 'arial black',
			fill: 'white',
			fontSize: 25,
			left: node.left,
			top: node.top - 20,
			id: "nodeText"
		});
		
		//Set scale
		title.scaleX = title.scaleX * this.canvasScale;
		title.scaleY = title.scaleY * this.canvasScale;
		title.top = node.top - (20 * this.canvasScale);
	
		title.node = node;

		//Center title over node
		var len = title.getWidth()/2;
		var cenX = node.getCenterPoint().x;
		title.left = cenX - len;
		title.setCoords();
		
		title.hasControls = false;
		title.lockMovementX = true;
		title.lockMovementY = true;
		//title.selectable = false;
		
		node.title = title;
		
		this.canvas.add(title);
		
		//Add delete button for node
		var dt = new fabric.Text("X", {
			fontFamily: 'arial black',
			fill: 'white',
			fontSize: 15,
			left: node.left,
			top: node.top + 10,
			id: "deleteNode"
		});
		
		//Scale delete button
		dt.scaleX = dt.scaleX * this.canvasScale;
		dt.scaleY = dt.scaleY * this.canvasScale;
		dt.top = node.top + (10 * this.canvasScale);
		dt.setCoords();
		
		node.deletenode = dt;
		dt.node = node;
		
		//Set controls
		dt.hasControls = false;
		dt.hasBorders = false;
		dt.lockMovementX = true;
		dt.lockMovementY = true;
		
		this.canvas.add(dt);
	}
}

/* 
 * Moves the node title when a node moves
 */
MManager.prototype.MoveNode = function (node){
	if(node)
	{
		node.setCoords();
	}
	// Move the node title
	if (node.title){
		node.title.set({'top': node.top - (20*this.canvasScale), 'left': (node.getCenterPoint().x - node.title.getWidth()/2)});
		node.title.setCoords();
	}
	// Move the pop up ndoe.
	if (node.popupnode){
		var radius = node.width * node.scaleX * .5;
		node.popupnode.set({'top': node.top + 10, 'left': node.left + (2 * radius) - 10});
		node.popupnode.setCoords();
	}

	if(node.deletenode){
		node.deletenode.top = node.top + 10;
		node.deletenode.left = node.left;
		node.deletenode.setCoords();
	}
}

/* ---------------------------------------- Map Misc. Functions ---------------------------------------- */

/* 
 * Locks the canvas by locking all the movement of the nodes. 
 */
MManager.prototype.LockCanvas = function(){
	this.locked = !this.locked;

	for(var i = 0; i < this.nodes.length; i++)
	{
		if (this.locked){
			this.nodes[i].lockMovementX = true;
			this.nodes[i].lockMovementY = true;
		}
		else {
			this.nodes[i].lockMovementX = false;
			this.nodes[i].lockMovementY = false;
		}
	}
}

/*
 * Handles the lock or upload button press
 */ 
MManager.prototype.LockOrUpload = function(button, level){
	// If the save button is clicked than save the map.
	if(button.id === "toolbarUpload"){
		this.SaveMap(level);
	}
	// No longer in use
	else if (button.id === "toolbarLock"){
		if (button.opacity == 1){
			button.opacity = .5;
		}
		else{
			button.opacity = 1;
		}
		this.LockCanvas();
	}
}

/* ---------------------------------------- Map Save/Load Functions ---------------------------------------- */

//Get the pop-up info for a specified node
MManager.prototype.LoadNodePopup = function(node, id, type){

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Map/load_node_popup.php",
		data: {nid: id, type: type, classOrConcept: this.classOrConcept}, 
		dataType: "json", 
		success: function(result){
			mngr.CreatePopupNode(node, 
				mngr.CreatePopupWithData(type, result["title"], 
					result["description"], result["duedate"], result["availabledate"], result["notes"]), true);
		}
	}); 

	return false; 
}

//Set node's line connections
MManager.prototype.updateCon = function(result)
{
	//Loop through the lines
	for(var i = 0; i < result.length; i++)
	{
		//Loop through the nodes
		for(var j = 0; j < this.nodes.length; j++)
		{
			//If the line is connected to the node, add line to the node
			if(this.nodes[j].nid == result[i].nid)
			{
				for(var k = 0; k < this.edges.length; k++)  
				{
					if(this.edges[k].id == result[i].eid)
					{
						this.nodes[j].lines.push(this.edges[k].line);
						this.nodes[j].lines2.push(result[i].side);
					}
				}
			}
		}
	}
}

//Gets the line/node connections from the database
MManager.prototype.LoadConnections = function(level){
	//alert("h");
	$.ajax({
		async: false,
		type: 'POST',
		url: "../API/Map/loadmap.php",
		dataType: 'json',
		data: {map: 3, level: level},
		
		success: function(result){
			mngr.updateCon(result);
			
		},
		error: function(result){
			alert("e" + result);
			alert(JSON.stringify(result));
		}
		
	});
	
	return false;
}

//Get all the edges from the DB and draw them on the canvas
MManager.prototype.LoadEdges = function(mngr, level, mode){

	$.ajax({
		async: false,
		type: 'POST',
		url: "../API/Map/loadmap.php",
		dataType: 'json',
		data: {map: 2, level: level},
		
		success: function(result){
			//alert(result);
			for(var i = 0; i < result.length; i++)
			{
				mngr.DrawEdge(result[i]["eid"], parseFloat(result[i]["x1"]), parseFloat(result[i]["y1"]), parseFloat(result[i]["x2"]), parseFloat(result[i]["y2"]), result[i]["type"], mode);
			}
		}
	});
	
	return false;
}

//Get all the nodes from the DB and draw them on the canvas
MManager.prototype.LoadMap = function(mngr, level, mode){

	$.ajax({
		async: false,
		type: 'POST',
		url: "../API/Map/loadmap.php",
		dataType: 'json',
		data: {map: 1, level: level},
		
		success: function(result){
			for(var i = 0; i < result.length; i++)
			{
				mngr.DrawNode(parseFloat(result[i]["top"]), parseFloat(result[i]["left"]), parseFloat(result[i]["radius"]), result[i]["type"], result[i]["title"], result[i]["id"], result[i]["fill"], result[i]["complete"], result[i]["availabledate"], mode);
			}
		}
	});
	
	return false;
}

/*
 * Loads the last node and edge id from the database.
 */
MManager.prototype.LoadIds = function(level) {
	$.ajax({
		type: 'POST',
		url: "../API/Map/mapsave.php",
		dataType: 'json',
		data: {id: 1, level: level},
		
		success: function(result){
			//alert(result);
			//alert(result["mnid"] + " " + result["meid"]);
			if(result["mnid"] != null)
			{
				mngr.nid = parseInt(result["mnid"]) + 1;
				//mngr.eid = parseInt(result["meid"]) + 1;
			}
			if(result["meid"] != null)
			{
				mngr.eid = parseInt(result["meid"]) + 1;
			}
		}
	});
	
	return false;
};

/* 
 * Saves the map to the db.
 */ 
MManager.prototype.SaveMap = function(level){
	var map = [];
	var edges = [];
	//Grab all the node info
	for(var i = 0; i < this.nodes.length; i++)
	{
		var t = this.nodes[i].title.getText();
		var temp = {
			top: this.nodes[i].top,
			left: this.nodes[i].left,
			//radius: this.nodes[i].radius,
			//fill: this.nodes[i].fill,
			//stroke: this.nodes[i].stroke,
			//strokeWidth: this.nodes[i].strokeWidth,
			id: this.nodes[i].nid,
			type: this.nodes[i].type,
			title: t
			//availabledate: this.nodes[i].availabledate
		};
		map.push(temp);
	}
	
	//Grab all the edge info
	for(var i = 0; i < this.edges.length; i++)
	{
		var temp = {
			x1: this.edges[i].line.x1,
			y1: this.edges[i].line.y1,
			x2: this.edges[i].line.x2,
			y2: this.edges[i].line.y2,
			fill: this.edges[i].line.fill,
			stroke: this.edges[i].line.stroke,
			strokeWidth: this.edges[i].line.strokeWidth,
			type: this.edges[i].line.id,
			id: this.edges[i].id
		};
		edges.push(temp);
	}
	
	//Grab all the node/line connection info
	var connections = [];
	for(var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];
		var nid = n.nid;
		if(n.lines.length != 0)
		{
			var con = [];
			for(var j = 0; j < n.lines.length; j++)
			{
				var eid = n.lines[j].eid;
				var side = n.lines2[j];
				var t = {
					eid: eid,
					side: side
				}
				con.push(t);
				//con.push(eid);
			}
			var temp = {
				nid: nid,
				con: con
			};
			connections.push(temp);
		}
	}
	
	$.ajax({
		async: true, 
		type: 'POST',
		url: "../API/Map/mapsave.php",
		dataType: 'html',
		data: {map: map, edges: edges, connections: connections, level: level},
		
		success: function(result){
			//alert(result);
			swal("Saved"); 
		}
	});
	
	return false;
}

//Delete a node from the learning map
MManager.prototype.DeleteN = function(node, level){
	var nid = node.nid;
	
	var cons = [];

	for(var i = 0; i < this.nodes.length; i++)
	{
		if(this.nodes[i].nid != node.nid)
		{
			//Loop through all of the node's lines
			for(var j = 0; j < this.nodes[i].lines.length; j++)
			{
				for(var k = 0; k < node.lines.length; k++)
				{
					//Loop through all other node's lines
					//If they match add a connection that needs to be deleted
					if(this.nodes[i].lines[j].eid == node.lines[k].eid)
					{
						var temp = {
							nid: this.nodes[i].nid,
							eid: this.nodes[i].lines[j].eid
						};
						cons.push(temp);
						var index = this.nodes[i].lines.indexOf(this.nodes[i].lines[j]);
						if(index > -1)
						{
							this.nodes[i].lines.splice(index, 1);
							this.nodes[i].lines2.splice(index, 1);
						}
						break;
			
					}
				}
			}
		}
	}
	
	//Remove the lines from the map manager
	var dedges = [];
	for(var i = 0; i < node.lines.length; i++)
	{
		var temp = {
			nid: nid,
			eid: node.lines[i].eid
		};
		cons.push(temp);
		
		dedges.push(node.lines[i].eid);
		canvas.remove(node.lines[i]);
		canvas.remove(node.lines[i].trian);
	}
	
	//Remove the node
	var index2 = this.nodes.indexOf(node);
	if(index2 > -1)
	{
		this.nodes.splice(index2, 1);
	}
	
	canvas.remove(node.title);
	//also need to remove db popup info
	canvas.remove(node.popupnode);
	canvas.remove(node.deletenode);
	canvas.remove(node);
	
	//Remove the deleted node/line data from the database
	$.ajax({
		async: true, 
		type: 'POST',
		url: "../API/Map/mapsave.php",
		dataType: 'html',
		data: {deleten: 1, level: level, cons: cons, dedges: dedges, dnid: nid},
		
		success: function(result){
			swal("Completed", "The node has been deleted.", "success");
		}
	});
				
	return false;
}

//Delete node prompt
MManager.prototype.DeleteNode = function(node, level){
	swal({
		title: "Are you sure you want to delete this node?",
		text: "Clicking yes will delete all contents connected to this node.",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Yes",   
		cancelButtonText: "No",   
		closeOnConfirm: false,   
		closeOnCancel: false },
		function(isConfirm){
			if(isConfirm){
				
				mngr.DeleteN(node, level);
				
				//$("#dim_div").hide();
				//$("#custom_container").hide();
			}
			else{
				swal("Cancelled", "The node has not been deleted.", "error");
			}
		});
}
/* ---------------------------------------- Popup Functions ---------------------------------------- */

// Create a pop up node and position it next to node.
MManager.prototype.CreatePopupNode = function(node, popup, docreate){
	if (docreate){
		var nid = node.nid;
		var type = node.type;
		var popup = popup;

		var radius = node.width * node.scaleX * .5; 
		var top = node.top;
		var left = node.left; 

		var imgElement = document.getElementById('my-image-page');
		var popupnode = new fabric.Image(imgElement, {
			top : top + 10,
			left : left + (2 * radius) - 10,
			id: "popupnode"
		});

		// Set fixed height and width to force image to display. Fabric.js bug if this is not set.
		popupnode.height = 96;
		popupnode.width = 96;
		popupnode.scale(.30);
		
		// Scale include canvas scale for zooming
		popupnode.scaleX = popupnode.scaleX * this.canvasScale;
		popupnode.scaleY = popupnode.scaleY * this.canvasScale;

		// Set the title
		popupnode.title = node.title;
		
		// Lock movement of pop up node always
		popupnode.lockMovementX = popupnode.lockMovementY = true;

		popupnode.hasControls = false; 
		popupnode.hasBorders  = false; 
		if(!node.available && this.mode == 0){
			popupnode.evented = false;
		}
		// Set pop up node variables
		popupnode.nid = nid;
		popupnode.type = type;
		popupnode.popup = popup; 
		node.popupnode = popupnode;
		popupnode.node = node;
		this.canvas.add(popupnode);  
		this.popupnodes.push(popupnode);
	}
}

//Navigates to the node's concept page
MManager.prototype.NavigateToConcept = function(){
	var nid = this.crrnt.nid;
	
	$.ajax({
		async: true, 
		type: 'POST',
		url: "../API/Map/mapsave.php",
		dataType: 'html',
		data: {direct: nid},
		
		success: function(result){
			//Navigate the professor to the builder
			if(result === "1")
			{
				window.location = '../concept_builder/concept_builder.html';
			}
			//Navigate the student to the view
			if(result === "2")
			{
				window.location = '../concept_view/concept_view.html';
			}
		}
	});
	
	return false;
}

//Navigate to the quiz
MManager.prototype.NavigateToQuiz = function(){
	var nid = this.crrnt.nid;
	var mode = this.mode;
	
	$.ajax({
		async: true, 
		type: 'POST',
		url: "../API/Map/mapsave.php",
		dataType: 'html',
		data: {directq: nid},
		
		success: function(result){
			//Navigate the professor to the builder
			if(result === "1")
			{
				window.location = '../quiz_builder/quiz_builder.html'
			}
			//Navigate the student to the view
			if(result === "2")
			{
				window.location = '../quiz_view/quiz_view.html'
			}
		}
	});
	
	return false;
}

// Navigates to the jupyter notebook homepage.
MManager.prototype.NavigateToJupyterNotebook = function(){
	window.location.href = "http://jupyter.org/";
}

//Check off the node as completed
MManager.prototype.CheckOffNode = function(){
	swal({   
		title: "Are you sure?",   
		text: "Clicking yes will check off this node.",   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Yes",   
		cancelButtonText: "No",   
		closeOnConfirm: false,   
		closeOnCancel: false }, 
		function(isConfirm){   
			if (isConfirm) {
				swal("Completed", "The node has been completed.", "success");
				//Set the node as completed
				mngr.CompleteNode(mngr.crrnt.nid);
				mngr.crrnt.node.compl = 1;
				
				//Change the node img to the completed img
				var imgEle;
				if(mngr.crrnt.node.type === "concept")
				{
					imgEle = document.getElementById('my-image4');
					
					mngr.crrnt.node.setElement(imgEle);
				}
				
				$("#dim_div").hide();
				$("#custom_container").hide();
			} 
			else {     
				swal("Cancelled", "The node has not been completed.", "error");   
			} 
	});
}

//Set the node as completed in the database
MManager.prototype.CompleteNode = function(nid2){
	$.ajax({
		async: true, 
		type: 'POST',
		url: "../API/Map/mapsave.php",
		dataType: 'html',
		data: {complete: 1, nid2: nid2},
		
		success: function(result){
			//alert(result);
		}
	});
	
	return false;
}

/*
 * Shows the popup. 
 * @param popup - jquery tag e.g $("#popup")
 * @param node  - node that was selected e.g e.target
 */ 
MManager.prototype.ShowPopup = function(node, popup){
	$(window).unbind('mousewheel');

	// Set the popup html.
	popup.html(node.popup.innerHtml);

	if (this.mode == 0){
		LoadDiscussion(node.nid, this.classOrConcept); // From API/Discussion/discussion.js
		
		if(node.node.type === "quiz")
		{
			if(node.node.compl == 1)
			{
				$("#quiz_navigate").hide();
				$("#quizcompl").show();
			}
			else
			{
				$("#quiz_navigate").show();
				$("#quizcompl").hide();
			}
		}
	}
	else
	{
		if(node.node.type === "quiz")
		{
			$("#quizcompl").hide();
		}
	}
	
	$("#custom_container").show();
	if(node.node.compl == 1)
	{
		//alert("h");
		$("#checkoff").hide();
	}
	else
	{
		if(node.node.type === "concept")
		{
			$("#checkoff").show();
		}
		else
		{
			$("#checkoff").hide();
		}
	}
	// Dim the background
	$("#dim_div").show();
}

// Creates a popup with no data.
MManager.prototype.CreatePopup = function(type){
	if (type === "concept")
		return this.CreateConceptPopup("", "", "", "", "");
	else if (type === "assignment")
		return this.CreateAssignmentPopup("", "", "", "", "");
	else if (type === "quiz")
		return this.CreateQuizPopup("", "", "", "", "");
}

// Creates a popup with data.
MManager.prototype.CreatePopupWithData = function(type, title, description, due_date, available_date, notes){
	if (type === "concept")
		return this.CreateConceptPopup(title, description, due_date, available_date, notes);
	else if (type === "assignment")
		return this.CreateAssignmentPopup(title, description, due_date, available_date, notes);
	else if (type === "quiz")
		return this.CreateQuizPopup(title, description, due_date, available_date, notes);
}

// Upload a file to the database. From file picker event.
MManager.prototype.UploadFile = function(){
	var formData = new FormData();
	formData.append('nid', this.crrnt.nid);
	formData.append('level', this.classOrConcept);
	formData.append('file', $('#filechooser')[0].files[0]);

	$.ajax({
       url : '../API/Map/upload.php',
       type : 'POST',
       data : formData,
       processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
       success : function(data) {
       		// Show the files if the upload was a success.
       		mngr.ShowFiles();
       }
	});
}

// Uploads and assignment to the database. 
MManager.prototype.UploadAssignment = function(){
	var formData = new FormData();
	formData.append('nid2', this.crrnt.nid);
	formData.append('file', $('#filechooser2')[0].files[0]);

	$.ajax({
       url : '../API/Map/uploadassignment.php',
       type : 'POST',
       data : formData,
       processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
       success : function(data) {
			mngr.CompleteNode(mngr.crrnt.nid);
			mngr.crrnt.node.compl = 1;
			
			var imgEle;
			if(mngr.crrnt.node.type === "assignment")
			{
				imgEle = document.getElementById('my-image5');
					
				mngr.crrnt.node.setElement(imgEle);
			}
			swal("Submitted"); 
       }
	});
}

// Get the lecture note filenames from that database and show them in the lecture notes list.
MManager.prototype.ShowFiles = function(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "../API/Map/lecturenotes.php",
		dataType: 'json',
		data: {nid: this.crrnt.nid, level: this.classOrConcept},
		success: function(result){

			if(result.length > 0){
				if(mngr.crrnt.node.type === "assignment"){
					$("#lecturenotes").html('<hr><h4 style="margin-top:20px;margin-bottom:15px;text-align:left;">Assignment Files</h4>');
				}
				else{
					$("#lecturenotes").html('<hr><h4 style="margin-top:20px;margin-bottom:15px;text-align:left;">Lecture Notes</h4>');
				}
			}

			for(var i = 0; i < result.length; i++)
			{
				var path = result[i]["path"];
				var innerHtml = $("#lecturenotes").html();
				innerHtml += `<div style="margin-bottom:10px;"><i class="material-icons" style="cursor:pointer;" onclick="mngr.downloadfile('`+path+`')">get_app</i>&nbsp;&nbsp;`
				innerHtml += result[i]["name"] + "</div>";

				$("#lecturenotes").html(innerHtml);
			}
		}
	});
	
	return false;
}

// Downloads a file @ filepath
MManager.prototype.downloadfile = function(filepath) {
	window.location="../API/Map/download.php?filename=" + filepath;
}

// Concept node popup
MManager.prototype.CreateConceptPopup = function(title, description, due_date, available_date, notes){ 
	var ids = [];
	var innerHtml; 

	if(title == null)
		title = "";
	if(description == null)
		description = "";
	if(due_date == null){
		due_date = "";
	}
	else{
		// Split timestamp from DB and format for datepicker (yyyy-mm-dd)
		var ddsplit = due_date.split(/[- :]/);
		due_date = ''+ddsplit[0]+'-'+ddsplit[1]+'-'+ddsplit[2];
	}
	if(available_date == null){
		available_date = "";
	}
	else{
		// Split timestamp from DB and format for datepicker (yyyy-mm-dd)
		var adsplit = available_date.split(/[- :]/);
		available_date = ''+adsplit[0]+'-'+adsplit[1]+'-'+adsplit[2];
	}
	if(notes == null)
		notes = "";


	// Configure the innerHTMl of the popup div.
	innerHtml = `
 	<div> 
		<div class="form-style-2" style="width: 90%;">`;

	// If Class/Concept view.
	if (this.mode == 0){
		innerHtml += `<div class="form-style-2-heading" style="width: 110%;">` + title + `</div>
		<div class="popup-div">
		<h4><b>Due Date:</b> ` + due_date + `</h4>
		</br>
		<h4><b>Description</b></h4>
		<p>` + description + `</p>
		</br>
		<h4><b>Notes</b></h4>
		<p>` + notes + `</p>
		</br>
		<div id="lecturenotes" style="text-align:left;font-size:16px;"></div>
		<hr>
		</br>
		`;

		if (this.classOrConcept == 0){
			innerHtml += `
			<button id="concept_navigate" onclick="mngr.NavigateToConcept();" style="float:left; font-size:12pt; margin-top:10px;" type="button" class="btn btn-default btn-md">
			Concept Page
			</button>
			`;
		}

		innerHtml += `
		</div>
		</div>
		</div>
  		</div>
  		`;
	}
	// Otherwise Class/Concept builder.
	else{
		innerHtml += `<div class="form-style-2-heading" style="width: 110%;">Concept Node Details</div>
		<form style="margin-left: 13%;">
		<label for="field1"><span>Title <span class="required">*</span></span><input class="input-field" id="title" name="title" type="text" value="`+ title +`"placeholder="Title"/></label>
		<label for="field2"><span>Description <span class="required">*</span></span><input class="input-field" id="description" name="description" type="text" value="`+ description +`" placeholder="Description"/></label>
		<label for="field5"><span>Notes <span class=""></span></span><textarea name="notes" id="notes" class="textarea-field">`+ notes +`</textarea></label>
		<label for="field2"><span>Due Date<span class=""></span></span><input class="input-field" id="due_date" name="due_date" type="date" value="`+ due_date +`" placeholder="Due date"/></label>
		<label for="field2"><span>Available Date<span class=""></span></span><input class="input-field" id="available_date" name="available_date" type="date" value="`+ available_date +`" placeholder="Available date"/></label>
		</br>`;
		if (this.classOrConcept == 1){
			innerHtml += `<input type="file" id="filechooser" onchange="mngr.UploadFile();">`;
		}
		innerHtml += `<div id="lecturenotes" style="text-align:left;font-size:16px;"></div>
		<hr>
		</br>
		`;

		if (this.classOrConcept == 0){
			innerHtml += `
			<button id="concept_navigate" onclick="mngr.NavigateToConcept();" style="float:left; font-size:12pt; margin-top:10px;" type="button" class="btn btn-default btn-md">
			Concept Page
			</button>
			`;
		}

		innerHtml += `
		</form>
		</div>
		</div>
  		</div>
  		`;
	}

  	ids.push("title");
  	ids.push("description");
  	ids.push("due_date");
  	ids.push("available_date");
  	ids.push("lecture_notes");

  	var popup = {
  		ids: ids,
  		innerHtml: innerHtml
  	};

  	// Return the popup object.
  	return popup;
}

// Sets the popup innerHTML for an assignment pop up.
MManager.prototype.CreateAssignmentPopup = function(title, description, due_date, available_date, notes){ 

	var ids = [];
	var innerHtml; 

	if(title == null)
		title = "";
	if(description == null)
		description = "";
	if(due_date == null){
		due_date = "";
	}
	else{
		// Split timestamp from DB and format for datepicker (yyyy-mm-dd)
		var ddsplit = due_date.split(/[- :]/);
		due_date = ''+ddsplit[0]+'-'+ddsplit[1]+'-'+ddsplit[2];
	}
	if(available_date == null){
		available_date = "";
	}
	else{
		// Split timestamp from DB and format for datepicker (yyyy-mm-dd)
		var adsplit = available_date.split(/[- :]/);
		available_date = ''+adsplit[0]+'-'+adsplit[1]+'-'+adsplit[2];
	}
	if(notes == null)
		notes = "";


	// Configure html
	innerHtml = `
 	<div> 
		<div class="form-style-2" style="width: 90%;">`;

	// If concept view.
	if (this.mode == 0){
		innerHtml += `<div class="form-style-2-heading" style="width: 110%;">` + title + `</div>
		<div class="popup-div">
		<h4><b>Due Date:</b> ` + due_date + `</h4>
		</br>
		<h4><b>Description</b></h4>
		<p>` + description + `</p>
		</br>
		<h4><b>Notes</b></h4>
		<p>` + notes + `</p>
		</br>
		<div id="lecturenotes" style="text-align:left;font-size:16px;"></div>
		<hr>
		</br>
		<label for="field1">Submit Assignment<label>
		<input type="file" id="filechooser2" onchange="mngr.UploadAssignment();">
		<div id="assgnmentsubmission" style="text-align:left;font-size:16px;"></div>
		<hr>
		</br>
		`;

		// Add concept page button if on concept view.
		if (this.classOrConcept == 0){
			innerHtml += `
			<button id="concept_navigate" onclick="mngr.NavigateToConcept();" style="float:left; font-size:12pt; margin-top:10px;" type="button" class="btn btn-default btn-md">
			Concept Page
			</button>
			`;
		}

		innerHtml += `
		</div>
		</div>
		</div>
  		</div>
  		`;
	}
	// else concept builder.
	else{
		innerHtml += `
		<div class="form-style-2-heading" style="width: 110%;">Assignment Node Details</div>
		<form style="margin-left: 13%;">
		<label for="field1"><span>Title <span class="required">*</span></span><input class="input-field" id="title" name="title" type="text" value="`+ title +`"placeholder="Title"/></label>
		<label for="field2"><span>Description <span class="required">*</span></span><input class="input-field" id="description" name="description" type="text" value="`+ description +`" placeholder="Description"/></label>
		<label for="field5"><span>Notes <span class=""></span></span><textarea name="notes" id="notes" class="textarea-field">`+ notes +`</textarea></label>
		<label for="field2"><span>Due Date<span class=""></span></span><input class="input-field" id="due_date" name="due_date" type="date" value="`+ due_date +`" placeholder="Due date"/></label>
		<label for="field2"><span>Available Date<span class=""></span></span><input class="input-field" id="available_date" name="available_date" type="date" value="`+ available_date +`" placeholder="Available date"/></label>
		</br>
		<input type="file" id="filechooser" onchange="mngr.UploadFile();">
		<div id="lecturenotes" style="text-align:left;font-size:16px;"></div>
		<hr>
		</br>
		`;

		if (this.classOrConcept == 0){
			innerHtml += `
			<button id="concept_navigate" onclick="mngr.NavigateToConcept();" style="float:left; font-size:12pt; margin-top:10px;" type="button" class="btn btn-default btn-md">
			Concept Page
			</button>
			`;
		}

		innerHtml += `
		</form>
		</div>
		</div>
  		</div>
  		`;
	}

  	ids.push("title");
  	ids.push("description");
  	ids.push("due_date");
  	ids.push("available_date");
  	ids.push("lecture_notes");

  	var popup = {
  		ids: ids,
  		innerHtml: innerHtml
  	};

  	return popup;
}

// Returns a quiz pop up object. 
MManager.prototype.CreateQuizPopup = function(title, description, due_date, available_date, notes){ 
	var ids = [];
	var innerHtml; 

	if(title == null)
		title = "";
	if(description == null)
		description = "";
	if(due_date == null){
		due_date = "";
	}
	else{
		// Split timestamp from DB and format for datepicker (yyyy-mm-dd)
		var ddsplit = due_date.split(/[- :]/);
		due_date = ''+ddsplit[0]+'-'+ddsplit[1]+'-'+ddsplit[2];
	}
	if(available_date == null){
		available_date = "";
	}
	else{
		// Split timestamp from DB and format for datepicker (yyyy-mm-dd)
		var adsplit = available_date.split(/[- :]/);
		available_date = ''+adsplit[0]+'-'+adsplit[1]+'-'+adsplit[2];
	}
	if(notes == null)
		notes = "";

	// Configure the quiz html.
	innerHtml = `
 	<div> 
		<div class="form-style-2" style="width: 90%;">`;

	if (this.mode == 0){
		innerHtml += `<div class="form-style-2-heading" style="width: 110%;">` + title + `</div>
		<div class="popup-div">
		<h4><b>Due Date:</b> ` + due_date + `</h4>
		</br>
		<h4><b>Description</b></h4>
		<p>` + description + `</p>
		</br>
		<h4><b>Notes</b></h4>
		<p>` + notes + `</p>
		</br>
		<button id="quiz_navigate" onclick="mngr.NavigateToQuiz();" style="float:left; font-size:12pt;" type="button" class="btn btn-default btn-md">
		Take Quiz
		</button>
		</br>
		<div id="quizcompl">You have already completed this quiz.</div>
		</br></br>
		<div id="lecturenotes" style="text-align:left;font-size:16px;"></div>
		<hr>
		</br>
		`;

		if (this.classOrConcept == 0){
			innerHtml += `
			<button id="concept_navigate" onclick="mngr.NavigateToConcept();" style="float:left; font-size:12pt; margin-top:10px;" type="button" class="btn btn-default btn-md">
			Concept Page
			</button>
			`;
		}

		innerHtml += `
		</div>
		</div>
		</div>
  		</div>
  		`;
	}
	else{
		innerHtml += `<div class="form-style-2-heading" style="width: 110%;">Quiz Node Details</div>
		<form style="margin-left: 13%;">
		<label for="field1"><span>Title <span class="required">*</span></span><input class="input-field" id="title" name="title" type="text" value="`+ title +`"placeholder="Title"/></label>
		<label for="field2"><span>Description <span class="required">*</span></span><input class="input-field" id="description" name="description" type="text" value="`+ description +`" placeholder="Description"/></label>
		<label for="field5"><span>Notes <span class=""></span></span><textarea name="notes" id="notes" class="textarea-field">`+ notes +`</textarea></label>
		<label for="field2"><span>Due Date<span class=""></span></span><input class="input-field" id="due_date" name="due_date" type="date" value="`+ due_date +`" placeholder="Due date"/></label>
		<label for="field2"><span>Available Date<span class=""></span></span><input class="input-field" id="available_date" name="available_date" type="date" value="`+ available_date +`" placeholder="Available date"/></label>
		</br>
		<button id="quiz_navigate" onclick="mngr.NavigateToQuiz();" style="float:left; font-size:12pt;" type="button" class="btn btn-default btn-md">
		Build Quiz
		</button>
		</br></br></br></br>
		<input type="file" id="filechooser" onchange="mngr.UploadFile();">
		<div id="lecturenotes" style="text-align:left;font-size:16px;"></div>
		<hr>
		</br>
		`;

		if (this.classOrConcept == 0){
			innerHtml += `
			<button id="concept_navigate" onclick="mngr.NavigateToConcept();" style="float:left; font-size:12pt; margin-top:10px;" type="button" class="btn btn-default btn-md">
			Concept Page
			</button>
			`;
		}

		innerHtml += `
		</form>
		</div>
		</div>
  		</div>
  		`;
	}

  	ids.push("title");
  	ids.push("description");
  	ids.push("due_date");
  	ids.push("available_date");
  	ids.push("lecture_notes");

  	var popup = {
  		ids: ids,
  		innerHtml: innerHtml
  	};

  	return popup;
}

//Zooms the map in
MManager.prototype.zoomIn = function(){
	//Zoom strength
	sf = 1.04;

	if(this.canvasScale < 1.41)
	{
		//Scale the canvas
		this.canvasScale = this.canvasScale * sf;
	
		var objs = this.canvas.getObjects();
	
		this.canvas.setHeight(this.canvas.getHeight() * sf);
		this.canvas.setWidth(this.canvas.getWidth() * sf);
	
		//Scale all of the objects
		for(var i = 0; i < objs.length; i++)
		{
			if(objs[i].id != "solid" && objs[i].id != "dotted" && objs[i].id != "arrowhead")
			{
				var scaleX = objs[i].scaleX;
				var scaleY = objs[i].scaleY;
				var left = objs[i].left;
				var top = objs[i].top;
		
				var tscaleX = scaleX * sf;
				var tscaleY = scaleY * sf;
				var tleft = left * sf;
				var ttop = top * sf;
		
				objs[i].scaleX = tscaleX;
				objs[i].scaleY = tscaleY;
				objs[i].left = tleft;
				objs[i].top = ttop;
			
				objs[i].setCoords();
			}
		}
		//Update the positions of the edges
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.MoveEdges(this.nodes[i]);
		}
		this.canvas.renderAll();
	}
}

//Zooms the map out
MManager.prototype.zoomOut = function()
{
	//Zoom strength
	sf = 1.04;
	
	if(this.canvasScale > 0.66)
	{
		//Scale the canvas
		this.canvasScale = this.canvasScale / sf;
		
		var objs = this.canvas.getObjects();
		
		this.canvas.setHeight(this.canvas.getHeight() * (1/sf));
		this.canvas.setWidth(this.canvas.getWidth() * (1/sf));
	
		//Scale all of the objects
		for(var i = 0; i < objs.length; i++)
		{
			if(objs[i].id != "solid" && objs[i].id != "dotted" && objs[i].id != "arrowhead")
			{
				var scaleX = objs[i].scaleX;
				var scaleY = objs[i].scaleY;
				var left = objs[i].left;
				var top = objs[i].top;
		
				var tscaleX = scaleX * (1/sf);
				var tscaleY = scaleY * (1/sf);
				var tleft = left * (1/sf);
				var ttop = top * (1/sf);
		
				objs[i].scaleX = tscaleX;
				objs[i].scaleY = tscaleY;
				objs[i].left = tleft;
				objs[i].top = ttop;
		
				objs[i].setCoords();
			}
		}
		//Update the positions of the edges
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.MoveEdges(this.nodes[i]);
		}
		this.canvas.renderAll();
	}
}

/*
 * Hides the popup. 
 */
MManager.prototype.HidePopup = function(){
 	$("#popup").html("");
 	$("#dim_div").hide();
 	$("#custom_container").hide();
 	this.popuped = false;
	
	$(window).on('mousewheel', function(e){
		e.preventDefault();
		e.stopPropagation();
		if(e.originalEvent.wheelDelta / 120 > 0) 
		{
			mngr.zoomIn();
		} 
		else 
		{
			mngr.zoomOut();
		}
	});
}

/* 
 * Saves the popup to the db. 
 */
MManager.prototype.SavePopup = function(){

	var nid = this.crrnt.nid;
	var type = this.crrnt.type;

	switch(type){
		case "concept": 
			var title = $("#title").val();
			var desc = $("#description").val(); 
			var notes = $("#notes").val(); 
			var duedate = $("#due_date").val(); 
			var availabledate = $("#available_date").val();
			
			this.crrnt.popup = this.CreatePopupWithData(type, title, desc, duedate, availabledate, notes); // Updates the current popup with current data.
			
			var _data = {action: 'concept', classOrConcept: this.classOrConcept, nid: nid, title: title, description: desc, notes: notes, duedate: duedate, availabledate: availabledate};

			break;

		case "assignment":
			var title = $("#title").val();
			var desc = $("#description").val(); 
			var notes = $("#notes").val(); 
			var duedate = $("#due_date").val();
			var available = $("#available_date").val();

			this.crrnt.popup = this.CreatePopupWithData(type, title, desc, duedate, availabledate, notes); // Updates the current popup with current data.

			var _data = {action: 'assignment', classOrConcept: this.classOrConcept, nid: nid, title: title, description: desc, notes: notes, duedate: duedate, availabledate: availabledate};

			break;

		case "quiz":
			var title = $("#title").val();
			var desc = $("#description").val(); 
			var notes = $("#notes").val(); 
			var duedate = $("#due_date").val();
			var available = $("#available_date").val();
			
			this.crrnt.popup = this.CreatePopupWithData(type, title, desc, duedate, availabledate, notes); // Updates the current popup with current data.

			var _data = {action: 'quiz', classOrConcept: this.classOrConcept, nid: nid, title: title, description: desc, notes: notes, duedate: duedate, availabledate: availabledate};

			break;
	}

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Map/save_node_popup.php",
		data: _data, 
		success: function(result){
			$("#custom_container").hide();
			$("#popup").html("");
			$("#canvas").show(); 
 			$("#dim_div").hide();
		}
	}); 

	return false; 
}

/* ---------------------------------------- Toolbar Functions ---------------------------------------- */

/*
 * Adds a toolbar to the canvas. Draws a vertical line at position 180 and draws the lock tool + upload tool.
 */ 
MManager.prototype.AddToolbar = function(){
	// Vertical divider
	var div = new fabric.Line([180, 0, 180, 1600], { fill: 'black', stroke: 'gray', strokeWidth: 4 });
	this.canvas.add(div);
	div.lockMovementX = div.lockMovementY = true;
	div.selectable = div.hasControls = div.hasBorders = false;

	var canvas = this.canvas;
	
	var savet = new fabric.Text("Save", {
		fontFamily: 'arial black',
		fontSize: 17,
		fill: 'white',
		top: 20,
		left: 75
	});
	savet.hasControls = false;
	savet.hasBorders = false;
	savet.lockMovementX = true;
	savet.lockMovementY = true;
	savet.selectable = false;
	canvas.add(savet);

	//Upload tool
	fabric.Image.fromURL('../imports/images/upload.png', function(oImg) {
		oImg.scale(.1); 
		oImg.set({left: 80, top: 45, id: 'toolbarUpload'}); 
		oImg.lockMovementX = oImg.lockMovementY = true; 
		oImg.hasControls = oImg.hasBorders = false; 
		oImg.selectable = true;
		canvas.add(oImg); 
	}); 

	// // Navigation Back
	// var nav1 = new fabric.Line([200, 75, 215, 90], { fill: 'black', stroke: 'white', strokeWidth: 6 });
	// var nav2 = new fabric.Line([200, 79, 215, 64], { fill: 'black', stroke: 'white', strokeWidth: 6 });
	// var navgroup = new fabric.Group([nav1, nav2], {
	// 	id: "navleft"
	// });
	// navgroup.lockMovementX = navgroup.lockMovementY = true;
	// navgroup.hasControls = navgroup.hasBorders = false;
	// this.canvas.add(navgroup);
}

/*
 * Adds a node to the toolbar.
 */ 
MManager.prototype.AddToolbarNode = function(_node){
	this.canvas.add(_node);
	_node.hasControls = _node.hasBorders = false;
}

/*
 * Adds an edge to the toolbar.
 */ 
MManager.prototype.AddToolbarEdge = function(_edge){
	this.canvas.add(_edge);
	_edge.hasControls = _edge.hasBorders = false;
	_edge.lockMovementX = _edge.lockMovementY = true;
	_edge.selectable = true;
}

/****************************** KEY BINDINGS ************************************/ 
$(document).keyup(function(e) {
	// Enter
  	if (e.keyCode == 13){
  		//mngr.SaveMap();
	} 

  	// Esc
  	if (e.keyCode == 27){
  		if(mngr.popuped){
  			mngr.HidePopup();
  		}
  	}
});