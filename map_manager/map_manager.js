/**
 * Learning Universe Node Manager
 * Authors: Daniel Cushing 
 * Date: 11/21/15 
 */ 

/*
 * Map Manager Constructor  
 */ 
var MManager = function(_canvas, builder){
 	this.canvas   = _canvas;
 	this.nodes 	  = []; 
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

 	if(builder){
 		this.locked = false;
 		this.AddToolbar(); // Add the toolbar when you initialize the map manager
 	}
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
	node.nid = this.nid;

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

MManager.prototype.ConstructMap = function(result){

}

//Draw a node onto the canvas
MManager.prototype.DrawNode = function(top, left, radius, type, title, nodeID, mode){
	//Draw the concept node
	var c = new fabric.Circle({
			top: top,
			left: left,
			radius: radius,
			fill: '#fff',
			stroke: 'white',
			strokeWidth: 5,
			id: "mapNode"
	});

	c.nid = nodeID;
			
	c.hasControls = false;
	c.hasBorders = false;
	//c.lockMovementX = true;
	//c.lockMovementY = true;
	
	if(mode == 0)
	{
		c.lockMovementX = true;
		c.lockMovementY = true;
	}
	
	canvas.add(c);
	
	//Draw participant nodes
	if(tempi < 3)
	{
		drawParticipantNodes(c, tempp);
		tempp = tempp - 4;
	}

	var temp = {
		node: c,
		id: nodeID,
		lines: [], 
		type: type, 
		popup: ""
	}

	this.LoadNodePopup(nodeID, type, this.nodes.length);

	this.nodes.push(temp); 

	//Draw the title text
	var t = new fabric.Text(title, {
			fontFamily: 'arial black',
			fontSize: 25,
			left: left,
			top: top - 35,
			id: "nodeText"
	});
	
	//test
	c.title = t;
			
	var len = t.getWidth()/2;
	var cenX = c.getCenterPoint().x;
	t.left = cenX - len;
				
	t.hasControls = false;
	t.hasBorders = false;
	t.lockMovementX = true;
	t.lockMovementY = true;
			
	canvas.add(t);
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
			//alert(current_node.node.left+2*current_node.node.radius + " " + current_node.lines[j].x2);
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
MManager.prototype.DrawEdgeBetweenNodes = function(node){
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
		
		//test
		line.eid = this.eid;

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

/* 
 * Draws an edge given parameters.
 */ 
MManager.prototype.DrawEdge = function(eid, x1, y1, x2, y2, type, mode){
	var l;
	if(type === "solid")
	{
		l = new fabric.Line([x1, y1, x2, y2], {
			fill: 'black',
			stroke: 'black',
			strokeWidth: 5,
			id: "solid"
			});
	}
	if(type === "dotted")
	{
		l = new fabric.Line([x1, y1, x2, y2], {
			fill: 'black',
			stroke: 'black',
			strokeWidth: 5,
			strokeDashArray: [5, 5],
			id: "dotted"
			});
	}
	
	l.eid = eid;
	
	l.hasControls = false;
	l.hasBorders = false;
	//l.lockMovementX = true;
	//l.lockMovementY = true;
	
	if(mode == 0)
	{
		l.lockMovementX = true;
		l.lockMovementY = true;
	}
	
	var temp = {
			line: l,
			id: eid
		};
		
	this.edges.push(temp);
	
	canvas.add(l);
	canvas.sendToBack(l);
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
MManager.prototype.LockOrUpload = function(button, level){
	if(button.id === "toolbarUpload"){
		this.SaveMap(level);
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

//Get the pop-up info for a specified node
MManager.prototype.LoadNodePopup = function(id, type, index){

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../map_manager/load_node_popup.php",
		data: {nid: id, type: type}, 
		dataType: "json", 
		success: function(result){
			mngr.nodes[index].popup = mngr.CreatePopupWithData(type, result["title"], result["description"], result["duedate"], result["notes"]);
			//mngr.FillPopup(result["title"], result["description"], result["duedate"], result["notes"]); 
		}
	}); 

	return false; 
}

MManager.prototype.updateCon = function(result)
{
	for(var i = 0; i < result.length; i++)
	{
		for(var j = 0; j < this.nodes.length; j++)
		{
			if(this.nodes[j].id == result[i].nid)
			{
				for(var k = 0; k < this.edges.length; k++)
				{
					if(this.edges[k].id == result[i].eid)
					{
						this.nodes[j].lines.push(this.edges[k].line);
					}
				}
			}
		}
	}
}

MManager.prototype.LoadConnections = function(level){
	//alert("h");
	$.ajax({
		async: false,
		type: 'POST',
		url: "../map_manager/loadmap.php",
		dataType: 'json',
		data: {map: 3, level: level},
		
		success: function(result){
			//alert(result.length);
			//alert(result[0].nid);
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
		url: "../map_manager/loadmap.php",
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
		url: "../map_manager/loadmap.php",
		dataType: 'json',
		data: {map: 1, level: level},
		
		success: function(result){
			for(var i = 0; i < result.length; i++)
			{
				mngr.DrawNode(parseFloat(result[i]["top"]), parseFloat(result[i]["left"]), parseFloat(result[i]["radius"]), result[i]["type"], result[i]["title"], result[i]["id"], mode);
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
		url: "../map_manager/mapsave.php",
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
		var t = this.nodes[i].node.title.getText();
		var temp = {
			top: this.nodes[i].node.top,
			left: this.nodes[i].node.left,
			radius: this.nodes[i].node.radius,
			fill: this.nodes[i].node.fill,
			stroke: this.nodes[i].node.stroke,
			strokeWidth: this.nodes[i].node.strokeWidth,
			id: this.nodes[i].id,
			type: this.nodes[i].type,
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
	
	var connections = [];
	for(var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];
		var nid = n.id;
		if(n.lines.length != 0)
		{
			var con = [];
			for(var j = 0; j < n.lines.length; j++)
			{
				var eid = n.lines[j].eid;
				con.push(eid);
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
		url: "../map_manager/mapsave.php",
		dataType: 'html',
		data: {map: map, edges: edges, connections: connections, level: level},
		
		success: function(result){
			alert(result);
			swal("Saved"); 
		}
	});
	
	return false;
}
/* ---------------------------------------- Popup Functions ---------------------------------------- */


MManager.prototype.NavigateToConcept = function(){
	var nid = this.crrnt.nid;
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
				for(var i = 0; i < mngr.nodes.length; i++){
					if(mngr.nodes[i].id == mngr.nid){
						mngr.nodes[i].node.setFill("#0d0");
						mngr.nodes[i].node.setStroke("#0d0");
						mngr.nodes[i].node.id = "cmapNode";
						$("#popup").hide(); 
					}
				}   
			} 
			else {     
				swal("Cancelled", "The node has not been completed.", "error");   
			} 
	});
}

/* 
 * 
 */
MManager.prototype.FillPopup = function(title, description, duedate, notes){
	$("#popup").show(); 
	$("#title").html(title); 
	$("#description").html(description); 
	$("#duedate").html("Due date: " + duedate); 
	$("#notes").html(notes); 
}

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
	$("#dim_div").show();
}

MManager.prototype.CreatePopup = function(type){
	if (type === "concept")
		return this.CreateConceptPopup("", "", "", "");
	else if (type === "assignment")
		return this.CreateAssignmentPopup();
	else if (type === "quiz")
		return this.CreateQuizPopup();
}

MManager.prototype.CreatePopupWithData = function(type, title, description, due_date, notes){
	if (type === "concept")
		return this.CreateConceptPopup(title, description, due_date, notes);
	else if (type === "assignment")
		return this.CreateAssignmentPopup();
	else if (type === "quiz")
		return this.CreateQuizPopup();
}


MManager.prototype.CreateConceptPopup = function(title, description, due_date, notes){ 
	var ids = [];
	var innerHtml; 

	innerHtml = "" + 
 	"<div class=\"row\">" +
	 	"<div class=\"col-md-2\"></div>" +
		"    <div class=\"col-md-8\">" +
		" 	 <div class=\"form-style-2\">" + 
		"    	<div class=\"form-style-2-heading\">Concept Node Details</div>" + 
		"			 <form>"+ 
		"    			<label for=\"field1\"><span>Title <span class=\"required\">*</span></span><input class=\"input-field\" id=\"title\" name=\"title\" type=\"text\" value=\""+ title +"\" placeholder=\"Title\"/></label>"+
		"				<label for=\"field2\"><span>Description <span class=\"required\">*</span></span><input class=\"input-field\" id=\"description\" name=\"description\" type=\"text\" value=\""+ description +"\" placeholder=\"Description\"/></label>"+
		"				<label for=\"field5\"><span>Notes <span class=\"\"></span></span><textarea name=\"notes\" id=\"notes\" class=\"textarea-field\" value=\""+ notes +"\"></textarea></label>"+
		"				<label for=\"field2\"><span>Due Date<span class=\"\"></span></span><input class=\"input-field\" id=\"due_date\" name=\"due_date\" type=\"text\" value=\""+ due_date +"\" placeholder=\"Due date\"/></label>"+
		"	        	<button id=\"lecture_notes\" style=\"float:left; font-size:12pt;\" type=\"button\" class=\"btn btn-default btn-md\">" +
		"	        	Lecture Notes" +
		"				</button>" +
		"	        	<button id=\"concept_navigate\" onclick=\"mngr.NavigateToConcept();\" style=\"float:left; font-size:12pt;\" type=\"button\" class=\"btn btn-default btn-md\">" +
		"	        	Concept Page" +
		"				</button>" +
		"			 </form>"+
		"		</div>"+
		"    </div>" +
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
 	$("#dim_div").hide();
}

/*
 * Hides the popup. 
 */
MManager.prototype.HidePopup2 = function(){
 	$("#popup").hide();
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
			var notes = $("#notes").val(); 
			var duedate = $("#due_date").val(); 
			
			var _data = {action: 'concept', nid: nid, title: title, description: desc, notes: notes, duedate: duedate};

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
		oImg.scale(.4); 
		oImg.set({left: 40, top: 720, id: 'toolbarLock'}); 
		oImg.lockMovementX = oImg.lockMovementY = true; 
		oImg.hasControls = oImg.hasBorders = false; 
		oImg.selectable = false;
		canvas.add(oImg); 
	}); 

	//Upload tool
	fabric.Image.fromURL('../imports/images/upload.png', function(oImg) {
		oImg.scale(.4); 
		oImg.set({left: 100, top: 724, id: 'toolbarUpload'}); 
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
