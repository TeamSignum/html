/**
 * Learning Universe Node Manager
 * Authors: Daniel Cushing 
 * Date: 11/21/15 
 */ 

/*
 * Map Manager Constructor  
 */ 
var MManager = function(_canvas){
 	this.canvas   = _canvas;
 	this.nodes 	  = []; 
 	this.nid      = 1;
 	this.eid      = 1;
 	this.locked   = false;

 	this.edges 	  = []; 
 	this.lineEdit = false;

 	this.from; 
 	this.to;
 	this.solid = false;
 	this.crrnt; 

 	this.AddToolbar(); // Add the toolbar when you initialize the map manager
 }

/* ---------------------------------------- Map Node Functions ---------------------------------------- */

/*
 * Returns the node at index
 */
MManager.prototype.GetNode = function(index){
	return nodes[index]; 
}

/* 
 * Copies a node from toolbar to canvas
 */
MManager.prototype.CopyNode = function(node, new_id, type){
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
	this.canvas.add(n);  

	node.id = new_id;

	var popup = this.CreatePopup(type);

	var my_node = { 
		node: node,
		id: this.nid,
		lines: [],
		type: type,
		popup: popup
	};

	this.nodes.push(my_node);
	this.nid++;
}

/* 
 * Handles the selection of a map node.
 * TODO: Some of this is hardcoded and needs to change
 */
MManager.prototype.HandleMapNodeSelect = function (node){
	if(this.locked){
		this.ShowPopup(node, $("#popup")); 
	}
	else{
		this.from = node;
	}
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
			this.nodes[i].node.lockMovementX = true;
			this.nodes[i].node.lockMovementY = true;
			this.nodes[i].node.selectable = false;
		}
		else {
			edge.opacity = 1;
			this.nodes[i].node.lockMovementX = false;
			this.nodes[i].node.lockMovementY = false;
			this.nodes[i].node.selectable = true;
		}
	}
}

/* 
 * Copies an edge from toolbar to map
 */ 
MManager.prototype.CopyEdge = function(edge, new_id){
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

	this.canvas.add(e); 
}

/* 
 * Moves all the edges linked to a node when the node moves.
 */ 
MManager.prototype.MoveEdges = function (node){
	var current_node;

	for(var i = 0; i < this.nodes.length; i++)
	{
		if(this.nodes[i].node.top === node.top && this.nodes[i].node.left === node.left)
		{
			current_node = this.nodes[i];
		}
	}

	if(current_node.lines.length != 0)
	{
		for(var j = 0; j < current_node.lines.length; j++)
		{
			if(current_node.node.left+2*current_node.node.radius > current_node.lines[j].x1 && current_node.node.left < current_node.lines[j].x1 && current_node.node.top+2*current_node.node.radius > current_node.lines[j].y1 && current_node.node.top < current_node.lines[j].y1)
			{
				current_node.lines[j].set({'x1': current_node.node.getCenterPoint().x, 'y1': current_node.node.getCenterPoint().y});
			}
			if(current_node.node.left+2*current_node.node.radius > current_node.lines[j].x2 && current_node.node.left < current_node.lines[j].x2 && current_node.node.top+2*current_node.node.radius > current_node.lines[j].y2 && current_node.node.top < current_node.lines[j].y2)
			{
				current_node.lines[j].set({'x2': current_node.node.getCenterPoint().x, 'y2': current_node.node.getCenterPoint().y});	
			}
		}
	}
}

/* 
 * Draws an edge between two nodes.
 */ 
MManager.prototype.DrawEdge = function(node){
	if(this.lineEdit && node.id === "mapNode"){

		this.to = node;

		var line;
		if(this.solid === true)
		{
			line = new fabric.Line([this.from.getCenterPoint().x, this.from.getCenterPoint().y, this.to.getCenterPoint().x, this.to.getCenterPoint().y], {
				fill: 'black',
				stroke: 'black',
				strokeWidth: 5,
				selectable: false,
				id: "solid"
			});
		}
		else
		{
			line = new fabric.Line([this.from.getCenterPoint().x, this.from.getCenterPoint().y, this.to.getCenterPoint().x, this.to.getCenterPoint().y], {
				fill: 'black',
				stroke: 'black',
				strokeWidth: 5,
				strokeDashArray: [5, 5],
				selectable: false,
				id: "dotted"
			});
		}

		for(var i = 0; i < this.nodes.length; i++)
		{
			if(this.nodes[i].node.top === this.from.top && this.nodes[i].node.left === this.from.left)
			{
				this.nodes[i].lines.push(line);
			}
			if(this.nodes[i].node.top === node.top && this.nodes[i].node.left === node.left)
			{
				this.nodes[i].lines.push(line);
			}
		}
		var temp = {
			line: line,
			id: this.eid
		};

		this.eid++;
		this.edges.push(temp);
		this.from.line = line;
		this.canvas.add(this.to);
		this.canvas.add(this.from);
		this.canvas.add(line);
		this.canvas.sendToBack(line);
	}
}

/* ---------------------------------------- Map Text Functions ---------------------------------------- */

/* 
 * Checks the bounds of a node and adds the text.
 */
MManager.prototype.CheckBoundsAndAddText = function(node){
	if(!this.lineEdit){
		if(node.left < 180 && node.id === "mapNode"){
				this.canvas.remove(node.title);
				this.canvas.remove(node); 
		}
		else if(node.left > 180 && node.id === "mapNode"){
			this.GenText(node);
		}
	}
}

/* 
 * Adds the text to the node.
 */
MManager.prototype.GenText = function(node){
	if(!node.title){
		var title = new fabric.IText('Name', {
			fontFamily: 'arial black',
			fontSize: 25,
			left: node.left,
			top: node.top - 30,
			id: "nodeText"
		});
	
		title.node = node;

		var len = title.getWidth()/2;
		var cenX = node.getCenterPoint().x;
		title.left = cenX - len;
		
		title.hasControls = false;
		title.lockMovementX = true;
		title.lockMovementY = true;
		
		node.title = title;
		
		this.canvas.add(title);
	}
}

/* 
 * Moves the node title when a node moves
 */
MManager.prototype.MoveNodeTitle = function (node){
	if (node.title){
		node.title.set({'top': node.top - 30, 'left': (node.getCenterPoint().x - node.title.getWidth()/2)});
		node.title.setCoords();
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
MManager.prototype.LockOrUpload = function(button){
	if(button.id === "toolbarUpload"){
		this.SaveMap();
	}
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

/*
 * Loads the last node and edge id from the database.
 */
MManager.prototype.LoadIds = function() {
	$.ajax({
		type: 'POST',
		url: "../map_manager/mapsave.php",
		dataType: 'json',
		data: {id: 1},
		
		success: function(result){
			if(result["mnid"] != null)
			{
				this.nid = parseInt(result["mnid"]) + 1;
				this.eid = parseInt(result["meid"]) + 1;
			}
		}
	});
	
	return false;
};

/* 
 * Saves the map to the db.
 */ 
MManager.prototype.SaveMap = function(){
	var map = [];
	var edges = [];
	//Grab all the node info
	for(var i = 0; i < this.nodes.length; i++)
	{
		var t = this.nodes[i].node.title.getText();
		var temp = {
			top: this.nodes[i].node.top,
			left: this.nodes[i].node.left,
			radius: this.nodes[i].node.radius,
			fill: this.nodes[i].node.fill,
			stroke: this.nodes[i].node.stroke,
			strokeWidth: this.nodes[i].node.strokeWidth,
			id: this.nodes[i].id,
			type: this.nodes[i].node.id,
			title: t
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
	
	$.ajax({
		async: true, 
		type: 'POST',
		url: "../map_manager/mapsave.php",
		dataType: 'html',
		data: {map: map, edges: edges},
		
		success: function(result){
			swal("Saved"); 
		}
	});
	
	return false;
}
/* ---------------------------------------- Popup Functions ---------------------------------------- */

/*
 * Shows the popup. 
 * @param popup - jquery tag e.g $("#popup")
 * @param node  - node that was selected e.g e.target
 */ 
MManager.prototype.ShowPopup = function(node, popup){
	this.crrnt = node;

	for(var i = 0; i < this.nodes.length; i++){
		if(this.nodes[i].node.top == this.crrnt.top && this.nodes[i].node.left == this.crrnt.left){
			popup.html(this.nodes[i].popup.innerHtml); 
		}
	}

	popup.show();
	$("#cancelorsave").show();
}

MManager.prototype.CreatePopup = function(type){
	if (type === "concept")
		return this.CreateConceptPopup();
	else if (type === "assignment")
		return this.CreateAssignmentPopup();
	else if (type === "quiz")
		return this.CreateQuizPopup();
}

MManager.prototype.CreateConceptPopup = function(){ 
	var ids = [];
	var innerHtml; 

	innerHtml = "" + 
 	"<div class=\"row\">" +
	 	"<div class=\"col-md-2\"></div>" +
		"    <div class=\"col-md-8\">" +
		"      	<h3 style=\"font-weight: bold;\">Please fill out concept node details</h3>" +
		"      	<form>" +
		"	      	<br/>" +
		"	        <input class=\"form-control\" id=\"title\" name=\"title\" type=\"text\" value=\"\" placeholder=\"Title\">" +
		"	        <br/>" +
		"	        <input class=\"form-control\" id=\"description\" name=\"description\" type=\"text\" value=\"\" placeholder=\"Description\">" +
		"	        <br/>" +
		"	        <input class=\"form-control\" id=\"due_date\" name=\"due_date\" type=\"text\" value=\"\" placeholder=\"Due date (optional)\">" +
		"" +
		"	        <br/>" +
		"	        <button id=\"lecture_notes\" style=\"float:left; font-size:12pt;\" type=\"button\" class=\"btn btn-default btn-md\">" +
		"	        Download Lecture Notes" +
		"			</button>" +
		"" +
		"      	</form>" +
		"    </div>" +
	 	"<div class=\"col-md-2\"></div>" +
  	"</div> " +
  	"";

  	ids.push("title");
  	ids.push("description");
  	ids.push("due_date");
  	ids.push("lecture_notes");

  	var popup = {
  		ids: ids,
  		innerHtml: innerHtml
  	};

  	return popup;
}

MManager.prototype.CreateAssignmentPopup = function(){ 
	var ids = [];
	var innerHtml; 

	innerHtml = "" + 
 	"<div class=\"row\">" +
	 	"<div class=\"col-md-2\"></div>" +
		"    <div class=\"col-md-8\">" +
		"      	<h3 style=\"font-weight: bold;\">Please fill out assignment details</h3>" +
		"      	<form>" +
		"	      	<br/>" +
		"	        <input class=\"form-control\" id=\"title\" name=\"title\" type=\"text\" value=\"\" placeholder=\"Title\">" +
		"	        <br/>" +
		"	        <input class=\"form-control\" id=\"description\" name=\"description\" type=\"text\" value=\"\" placeholder=\"Description\">" +
		"	        <br/>" +
		"	        <input class=\"form-control\" id=\"due_date\" name=\"due_date\" type=\"text\" value=\"\" placeholder=\"Due date (optional)\">" +
		"" +
		"	        <br/>" +
		"	        <button id=\"j_notebook\" style=\"float:left; font-size:12pt;\" type=\"button\" class=\"btn btn-default btn-md\">" +
		"	        Jupyter Notebook" +
		"			</button>" +
		"" +
		"      	</form>" +
		"    </div>" +
	 	"<div class=\"col-md-2\"></div>" +
  	"</div> " +
  	"";

  	ids.push("title");
  	ids.push("description");
  	ids.push("due_date");
  	ids.push("j_notebook");

  	var popup = {
  		ids: ids,
  		innerHtml: innerHtml
  	};

  	return popup;
}

MManager.prototype.CreateQuizPopup = function(){ 
	var ids = [];
	var innerHtml; 

	innerHtml = "" + 
 	"<div class=\"row\">" +
	 	"<div class=\"col-md-2\"></div>" +
		"    <div class=\"col-md-8\">" +
		"      	<h3 style=\"font-weight: bold;\">Please fill out quiz details</h3>" +
		"      	<form>" +
		"	      	<br/>" +
		"	        <input class=\"form-control\" id=\"title\" name=\"title\" type=\"text\" value=\"\" placeholder=\"Title\">" +
		"	        <br/>" +
		"	        <input class=\"form-control\" id=\"description\" name=\"description\" type=\"text\" value=\"\" placeholder=\"Description\">" +
		"	        <br/>" +
		"	        <input class=\"form-control\" id=\"due_date\" name=\"due_date\" type=\"text\" value=\"\" placeholder=\"Due date (optional)\">" +
		"" +
		"	        <br/>" +
		"	        <button id=\"take_quiz\" style=\"float:left; font-size:12pt;\" type=\"button\" class=\"btn btn-default btn-md\">" +
		"	        Take Quiz" +
		"			</button>" +
		"" +
		"      	</form>" +
		"    </div>" +
	 	"<div class=\"col-md-2\"></div>" +
  	"</div> " +
  	"";

  	ids.push("title");
  	ids.push("description");
  	ids.push("due_date");
  	ids.push("take_quiz");

  	var popup = {
  		ids: ids,
  		innerHtml: innerHtml
  	};

  	return popup;
}

/*
 * Hides the popup. 
 */
MManager.prototype.HidePopup = function(){
 	$("#popup").hide();
 	$("#popup").html("");
 	$("#cancelorsave").hide();
}

/* 
 * Saves the popup to the db. 
 */
MManager.prototype.SavePopup = function(){

	var nid; 
	var type; 

	// Get the nid
	for(var i = 0; i < this.nodes.length; i++){
		if(this.nodes[i].node.top == this.crrnt.top && this.nodes[i].node.left == this.crrnt.left){
			nid = this.nodes[i].id; 
			type = this.nodes[i].type;
		}
	}

	switch(type){
		case "concept": 
			var title = $("#title").val();
			var desc = $("#description").val(); 
			var duedate = $("#due_date").val(); 
			
			var _data = {action: 'concept', nid: nid, title: title, description: desc, duedate: duedate};

			break;

		case "assignment":
			var title = $("#title").val();
			var desc = $("#description").val(); 
			var duedate = $("#due_date").val(); 

			var _data = {action: 'assignment', nid: nid, title: title, description: desc, duedate: duedate};

			break;

		case "quiz":
			var title = $("#title").val();
			var desc = $("#description").val(); 
			var duedate = $("#due_date").val(); 

			var _data = {action: 'quiz', nid: nid, title: title, description: desc, duedate: duedate};

			break;
	}

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../map_manager/save_node_popup.php",
		data: _data, 
		success: function(result){
			$("#popup").hide(); 
			$("#cancelorsave").hide(); 
			$("#popup").html("");
			$("#canvas").show(); 
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
	var div = new fabric.Line([180, 0, 180, 1000], { fill: 'black', stroke: 'black', strokeWidth: 4 });
	this.canvas.add(div);
	div.lockMovementX = div.lockMovementY = true;
	div.selectable = div.hasControls = div.hasBorders = false;

	var canvas = this.canvas;

	//Lock tool
	fabric.Image.fromURL('../imports/images/lock.png', function(oImg) {
		oImg.scale(.2); 
		oImg.set({left: 30, top: 740, id: 'toolbarLock'}); 
		oImg.lockMovementX = oImg.lockMovementY = true; 
		oImg.hasControls = oImg.hasBorders = false; 
		oImg.selectable = false;
		canvas.add(oImg); 
	}); 

	//Upload tool
	fabric.Image.fromURL('../imports/images/upload.png', function(oImg) {
		oImg.scale(.1); 
		oImg.set({left: 110, top: 740, id: 'toolbarUpload'}); 
		oImg.lockMovementX = oImg.lockMovementY = true; 
		oImg.hasControls = oImg.hasBorders = false; 
		oImg.selectable = false;
		canvas.add(oImg); 
	}); 
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
	_edge.selectable = false;
}
