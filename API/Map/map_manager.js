/**
 * Learning Universe Node Manager
 * Authors: Daniel Cushing 
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

	node.id = new_id;
	node.nid = this.nid;
	node.type = type;
	node.lines = [];
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
		//this.ShowFiles();
	}
	else if(node.id === "mapNode" && node.type === "concept"){
		this.NavigateToConcept();
	}
	else{
		this.from = node;
	}
}

MManager.prototype.GetCurrentId = function(result){
	return this.crrnt.nid;
}

//Draw a node onto the canvas
MManager.prototype.DrawNode = function(top, left, radius, type, title, nodeID, fill, complete, mode){

	var imgElement;
	if(type == "concept"){
		imgElement = document.getElementById('my-image1');
	}
	else if(type == "assignment"){
		if(complete && mode == 0){
			imgElement = document.getElementById('my-image4');
		}
		else{
			imgElement = document.getElementById('my-image2');
		}
	}
	else if(type == "quiz"){
		imgElement = document.getElementById('my-image3');
	}

	var c = new fabric.Image(imgElement, {
	  left: left,
	  top: top,
	  id: "mapNode"
	});

	c.width = 463;
	c.height = 455;
	c.scale(.25);
	c.hasBorders = c.hasControls = false;
	canvas.add(c);

	c.nid = nodeID;
	c.type = type;
	c.lines = []; 

	this.LoadNodePopup(c, nodeID, type);
	this.nodes.push(c);

	if(mode == 0)
	{
		if(complete == 1)
		{
			c.fill = 'green';
			c.compl = 1;
		}
		else
		{
			c.compl = 0;
		}
		c.lockMovementX = c.lockMovementY = true;
		
		var pc = new fabric.Circle({
				top: top + radius,
				left: left - 20,
				radius: 15,
				fill: 'green',
				stroke: 'white',
				id: "partNode"
		});
		
		pc.hasControls = false;
		pc.hasBorders = false;
		pc.lockMovementX = true;
		pc.lockMovementY = true;
		
		canvas.add(pc);
		
		var pt = new fabric.Text("0", {
				fontFamily: 'arial black',
				fontSize: 12,
				left: left - 18,
				top: top + radius + 8,
				id: "partText"
		});
		
		var plen = pt.getWidth()/2;
		var pcenX = pc.getCenterPoint().x;
		pt.left = pcenX - plen;
		
		pt.hasControls = false;
		pt.hasBorders = false;
		pt.lockMovementX = true;
		pt.lockMovementY = true;
		
		pc.ptext = pt;
		
		c.pnode = pc;
		
		canvas.add(pt);
	}
	
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
			for(var j = 0; j < node.lines.length; j++)
			{
				if(node.left+2*radius > node.lines[j].x1 && node.left < node.lines[j].x1 && node.top+2*radius > node.lines[j].y1 && node.top < node.lines[j].y1)
				{
					node.lines[j].set({'x1': node.getCenterPoint().x, 'y1': node.getCenterPoint().y});
				}
				if(node.left+2*radius > node.lines[j].x2 && node.left < node.lines[j].x2 && node.top+2*radius > node.lines[j].y2 && node.top < node.lines[j].y2)
				{
					node.lines[j].set({'x2': node.getCenterPoint().x, 'y2': node.getCenterPoint().y});	
				}
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
		
		line.eid = this.eid;
		line.hasControls = line.hasBorders = false;
		line.lockMovementX = line.lockMovementY = true;
		line.perPixelTargetFind = true;

		this.from.lines.push(line);
		this.to.lines.push(line);
		
		var temp = {
			line: line,
			id: this.eid
		};

		this.eid++;
		this.edges.push(temp);
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
			fill: 'white',
			stroke: 'white',
			strokeWidth: 5,
			id: "solid"
		});
	}
	if(type === "dotted")
	{
		l = new fabric.Line([x1, y1, x2, y2], {
			fill: 'white',
			stroke: 'white',
			strokeWidth: 5,
			strokeDashArray: [5, 5],
			id: "dotted"
		});
	}
	
	l.eid = eid;
	l.hasControls = l.hasBorders = false;
	l.lockMovementX = l.lockMovementY = true;
	l.perPixelTargetFind = true;
	
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
MManager.prototype.AddNodeToCanvas = function(node){
	if(!this.lineEdit){
		if(node.left < 180 && node.id === "mapNode"){
				this.canvas.remove(node.title);
				this.canvas.remove(node); 
		}
		else if(node.left > 180 && node.id === "mapNode"){
			this.CreatePopupNode(node, this.CreatePopup(node.type), !node.title); 
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
			fill: 'white',
			fontSize: 25,
			left: node.left,
			top: node.top - 20,
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
		
		var dt = new fabric.Text("X", {
			fontFamily: 'arial black',
			fill: 'white',
			fontSize: 15,
			left: node.left,
			top: node.top + 10,
			id: "deleteNode"
		});
		
	node.deletenode = dt;
	dt.node = node;
		
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
	if (node.title){
		node.title.set({'top': node.top - 20, 'left': (node.getCenterPoint().x - node.title.getWidth()/2)});
		node.title.setCoords();
	}

	if (node.popupnode){
		var radius = node.width * node.scaleX * .5;
		node.popupnode.set({'top': node.top + radius, 'left': node.left + (2 * radius) - 10});
		node.popupnode.setCoords();
	}
	if(node.deletenode){
		node.deletenode.top = node.top;
		node.deletenode.left = node.left;
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
					result["description"], result["duedate"], result["notes"]), true);
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
			if(this.nodes[j].nid == result[i].nid)
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
				mngr.DrawNode(parseFloat(result[i]["top"]), parseFloat(result[i]["left"]), parseFloat(result[i]["radius"]), result[i]["type"], result[i]["title"], result[i]["id"], result[i]["fill"], result[i]["complete"], mode);
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
			radius: this.nodes[i].radius,
			fill: this.nodes[i].fill,
			stroke: this.nodes[i].stroke,
			strokeWidth: this.nodes[i].strokeWidth,
			id: this.nodes[i].nid,
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
		url: "../API/Map/mapsave.php",
		dataType: 'html',
		data: {map: map, edges: edges, connections: connections, level: level},
		
		success: function(result){
			swal("Saved"); 
		}
	});
	
	return false;
}

MManager.prototype.DeleteN = function(node, level){
	var nid = node.nid;
	
	var cons = [];

	for(var i = 0; i < this.nodes.length; i++)
	{
		if(this.nodes[i].nid != node.nid)
		{
			for(var j = 0; j < this.nodes[i].lines.length; j++)
			{
				for(var k = 0; k < node.lines.length; k++)
				{
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
						}
					
					}
				}
			}
		}
	}
	
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
	}
	
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
	
	$.ajax({
		async: true, 
		type: 'POST',
		url: "../API/Map/mapsave.php",
		dataType: 'html',
		data: {deleten: 1, level: level, cons: cons, dedges: dedges, dnid: nid},
		
		success: function(result){
			alert(result); 
			swal("Completed", "The node has been deleted.", "success");
		}
	});
				
	return false;
}

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
			top : top + radius, 
			left : left + (2 * radius) - 10,
			id: "popupnode"
		});
		popupnode.width = 68;
		popupnode.height = 77;
		popupnode.scale(.3);

		popupnode.title = node.title;
		
		popupnode.lockMovementX = popupnode.lockMovementY = true;

		popupnode.hasControls = false; 
		popupnode.hasBorders  = false; 
		popupnode.nid = nid;
		popupnode.type = type;
		popupnode. popup = popup; 
		node.popupnode = popupnode;
		popupnode.node = node;
		this.canvas.add(popupnode);  
		this.popupnodes.push(popupnode);
	}
}

MManager.prototype.NavigateToConcept = function(){
	var nid = this.crrnt.nid;
	
	$.ajax({
		async: true, 
		type: 'POST',
		url: "../API/Map/mapsave.php",
		dataType: 'html',
		data: {direct: nid},
		
		success: function(result){
			if(result === "1")
			{
				window.location = '../concept_builder/concept_builder.html';
			}
			if(result === "2")
			{
				window.location = '../concept_view/concept_view.html';
			}
		}
	});
	
	return false;
}

MManager.prototype.NavigateToQuiz = function(){
	var nid = this.crrnt.nid;
	var mode = this.mode;

	if(mode == 0){
		window.location = '../quiz_view/quiz_view.html'
	}
	else{
		window.location = '../quiz_builder/quiz_builder.html'
	}
	
	return false;
}


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
				mngr.CompleteNode(mngr.crrnt.nid);
				swal("Completed", "The node has been completed.", "success");
				for(var i = 0; i < mngr.nodes.length; i++){
					if(mngr.nodes[i].nid == mngr.crrnt.nid){
						mngr.nodes[i].setFill("#0d0");
						mngr.nodes[i].setStroke("#0d0");
						mngr.nodes[i].compl = 1;

						$("#dim_div").hide();
						$("#custom_container").hide();
					}
				}   
			} 
			else {     
				swal("Cancelled", "The node has not been completed.", "error");   
			} 
	});
}

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
	popup.html(node.popup.innerHtml);

	if (this.mode == 0){
		LoadDiscussion(node.nid, this.classOrConcept); // From API/Discussion/discussion.js
	}
	$("#custom_container").show();
	if(node.node.compl == 1)
	{
		//alert("h");
		$("#checkoff").hide();
	}
	else
	{
		$("#checkoff").show();
	}
	$("#dim_div").show();
}

MManager.prototype.CreatePopup = function(type){
	if (type === "concept")
		return this.CreateConceptPopup("", "", "", "");
	else if (type === "assignment")
		return this.CreateAssignmentPopup("", "", "", "");
	else if (type === "quiz")
		return this.CreateQuizPopup("", "", "", "");
}

MManager.prototype.CreatePopupWithData = function(type, title, description, due_date, notes){
	if (type === "concept")
		return this.CreateConceptPopup(title, description, due_date, notes);
	else if (type === "assignment")
		return this.CreateAssignmentPopup(title, description, due_date, notes);
	else if (type === "quiz")
		return this.CreateQuizPopup(title, description, due_date, notes);
}

MManager.prototype.UploadFile = function(){
	var formData = new FormData();
	formData.append('nid', this.crrnt.nid);
	formData.append('file', $('#filechooser')[0].files[0]);

	$.ajax({
       url : '../API/Map/upload.php',
       type : 'POST',
       data : formData,
       processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
       success : function(data) {
       }
	});
}

MManager.prototype.ShowFiles = function(){

	$.ajax({
		async: true,
		type: 'POST',
		url: "../API/Map/download.php",
		dataType: 'json',
		data: {nid: this.crrnt.nid},
		success: function(result){
			$("#lecturenotes").html($("#lecturenotes").html() + '<h3 style="margin-top:50px;">Lecture Notes</h3>');

			for(var i = 0; i < result.length; i++)
			{
				var html = `
				<div style="margin-left:60px;float:left;"><h4>` + result[0]["name"] + `</h4></div></br></br>
				`;

				$("#lecturenotes").html($("#lecturenotes").html() + html);
			}
		}
	});
	
	return false;
}

MManager.prototype.CreateConceptPopup = function(title, description, due_date, notes){ 
	var ids = [];
	var innerHtml; 

	if(title == null)
		title = "";
	if(description == null)
		description = "";
	if(due_date == null)
		due_date = "";
	if(notes == null)
		notes = "";

	innerHtml = "" + 
 	"<div>" +
		" 	 <div class=\"form-style-2\" style=\"width: 90%;\">" + 
		"    <div class=\"form-style-2-heading\" style=\"width: 110%;\">Concept Node Details</div>" + 
		"			 <form style=\"margin-left: 13%;\">";
		if (this.mode ==  1){
			innerHtml +=
		"    			<label for=\"field1\"><span>Title <span class=\"required\">*</span></span><input class=\"input-field\" id=\"title\" name=\"title\" type=\"text\" value=\""+ title +"\" placeholder=\"Title\"/></label>"+
		"				<label for=\"field2\"><span>Description <span class=\"required\">*</span></span><input class=\"input-field\" id=\"description\" name=\"description\" type=\"text\" value=\""+ description +"\" placeholder=\"Description\"/></label>"+
		"				<label for=\"field5\"><span>Notes <span class=\"\"></span></span><textarea name=\"notes\" id=\"notes\" class=\"textarea-field\">"+ notes +"</textarea></label>"+
		"				<label for=\"field2\"><span>Due Date<span class=\"\"></span></span><input class=\"input-field\" id=\"due_date\" name=\"due_date\" type=\"text\" value=\""+ due_date +"\" placeholder=\"Due date\"/></label>";
		}
		else{
			innerHtml +=
		"    			<label for=\"field1\"><span>Title <span class=\"required\">*</span></span><input readonly class=\"input-field\" id=\"title\" name=\"title\" type=\"text\" value=\""+ title +"\" placeholder=\"Title\"/></label>"+
		"				<label for=\"field2\"><span>Description <span class=\"required\">*</span></span><input readonly class=\"input-field\" id=\"description\" name=\"description\" type=\"text\" value=\""+ description +"\" placeholder=\"Description\"/></label>"+
		"				<label for=\"field5\"><span>Notes <span class=\"\"></span></span><textarea readonly name=\"notes\" id=\"notes\" class=\"textarea-field\">"+ notes +"</textarea></label>"+
		"				<label for=\"field2\"><span>Due Date<span class=\"\"></span></span><input readonly class=\"input-field\" id=\"due_date\" name=\"due_date\" type=\"text\" value=\""+ due_date +"\" placeholder=\"Due date\"/></label>";
		}

		if (this.mode ==  1){
			innerHtml +=
			"               </br>" +
			"	        	<input type=\"file\" id=\"filechooser\" onchange=\"mngr.UploadFile();\">";
		}
		
		innerHtml +=
		"               </br>";
		if (this.classOrConcept == 0){
			innerHtml +=
			"	        	<button id=\"concept_navigate\" onclick=\"mngr.NavigateToConcept();\" style=\"float:left; font-size:12pt;\" type=\"button\" class=\"btn btn-default btn-md\">" +
			"	        	Concept Page" +
			"				</button>";
		}
		innerHtml +=
		"			 </form>"+
		"	 </div>" +
		"    </div>" +
  	"</div>";

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

MManager.prototype.CreateAssignmentPopup = function(title, description, due_date, notes){ 
	var ids = [];
	var innerHtml; 

	if(title == null)
		title = "";
	if(description == null)
		description = "";
	if(due_date == null)
		due_date = "";
	if(notes == null)
		notes = "";

	innerHtml = "" + 
 	"<div class=\"row\">" +
	 	"<div class=\"col-md-2\"></div>" +
		"    <div class=\"col-md-8\">" +
		"    <div class=\"form-style-2-heading\">Assignment Node Details</div>" + 
		" 	 <div class=\"form-style-2\">" + 
		"			 <form>"+ 
		"    			<label for=\"field1\"><span>Title <span class=\"required\">*</span></span><input class=\"input-field\" id=\"title\" name=\"title\" type=\"text\" value=\""+ title +"\" placeholder=\"Title\"/></label>"+
		"				<label for=\"field2\"><span>Description <span class=\"required\">*</span></span><input class=\"input-field\" id=\"description\" name=\"description\" type=\"text\" value=\""+ description +"\" placeholder=\"Description\"/></label>"+
		"				<label for=\"field5\"><span>Notes <span class=\"\"></span></span><textarea name=\"notes\" id=\"notes\" class=\"textarea-field\">"+ notes +"</textarea></label>"+
		"				<label for=\"field2\"><span>Due Date<span class=\"\"></span></span><input class=\"input-field\" id=\"due_date\" name=\"due_date\" type=\"text\" value=\""+ due_date +"\" placeholder=\"Due date\"/></label>"+
		"	        	<button id=\"jnotebook\" style=\"float:left; font-size:12pt;\" onclick=\"mngr.NavigateToJupyterNotebook();\" type=\"button\" class=\"btn btn-default btn-md\">" +
		"	        	Jupyter Notebook Link" +
		"				</button>" +
		"               </br></br></br>";
		if (this.classOrConcept == 0){
			innerHtml +=
			"	        	<button id=\"concept_navigate\" onclick=\"mngr.NavigateToConcept();\" style=\"float:left; font-size:12pt;\" type=\"button\" class=\"btn btn-default btn-md\">" +
			"	        	Concept Page" +
			"				</button>";
		}
		innerHtml +=
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

  	var popup = {
  		ids: ids,
  		innerHtml: innerHtml
  	};

  	return popup;
}

MManager.prototype.CreateQuizPopup = function(title, description, due_date, notes){ 
	var ids = [];
	var innerHtml; 

	if(title == null)
		title = "";
	if(description == null)
		description = "";
	if(due_date == null)
		due_date = "";
	if(notes == null)
		notes = "";

	innerHtml = "" + 
 	"<div class=\"row\">" +
	 	"<div class=\"col-md-2\"></div>" +
		"    <div class=\"col-md-8\">" +
		" 	 <div class=\"form-style-2\">" + 
		"    	<div class=\"form-style-2-heading\">Quiz Node Details</div>" + 
		"			 <form>"+ 
		"    			<label for=\"field1\"><span>Title <span class=\"required\">*</span></span><input class=\"input-field\" id=\"title\" name=\"title\" type=\"text\" value=\""+ title +"\" placeholder=\"Title\"/></label>"+
		"				<label for=\"field2\"><span>Description <span class=\"required\">*</span></span><input class=\"input-field\" id=\"description\" name=\"description\" type=\"text\" value=\""+ description +"\" placeholder=\"Description\"/></label>"+
		"				<label for=\"field5\"><span>Notes <span class=\"\"></span></span><textarea name=\"notes\" id=\"notes\" class=\"textarea-field\">"+ notes +"</textarea></label>"+
		"				<label for=\"field2\"><span>Due Date<span class=\"\"></span></span><input class=\"input-field\" id=\"due_date\" name=\"due_date\" type=\"text\" value=\""+ due_date +"\" placeholder=\"Due date\"/></label>"+
		"	        	<button id=\"quiz_navigate\" onclick=\"mngr.NavigateToQuiz();\" style=\"float:left; font-size:12pt;\" type=\"button\" class=\"btn btn-default btn-md\">";
		if (this.mode ==  1){
			innerHtml +=
		"	        	Quiz Builder";
		}
		else{
			innerHtml +=
		"	        	Quiz Taker";
		}
		innerHtml +=
		"				</button>" +
		"               </br></br></br>" +
		"               </br></br></br>" +
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
 	//$("#popup").hide();
 	$("#popup").html("");
 	//$("#cancelorsave").hide();
 	$("#dim_div").hide();
 	$("#custom_container").hide();
}

/*
 * Hides the popup. 
 */
MManager.prototype.HidePopup2 = function(){
 	//$("#popup").hide();
 	//$("#checkorx").hide();
 	$("#custom_container").hide();
 	$("#dim_div").hide();
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

			this.crrnt.popup = this.CreatePopupWithData(type, title, desc, duedate, notes); // Updates the current popup with current data.
			
			var _data = {action: 'concept', classOrConcept: this.classOrConcept, nid: nid, title: title, description: desc, notes: notes, duedate: duedate};

			break;

		case "assignment":
			var title = $("#title").val();
			var desc = $("#description").val(); 
			var notes = $("#notes").val(); 
			var duedate = $("#due_date").val();

			this.crrnt.popup = this.CreatePopupWithData(type, title, desc, duedate, notes); // Updates the current popup with current data.

			var _data = {action: 'assignment', classOrConcept: this.classOrConcept, nid: nid, title: title, description: desc, notes: notes, duedate: duedate};

			break;

		case "quiz":
			var title = $("#title").val();
			var desc = $("#description").val(); 
			var notes = $("#notes").val(); 
			var duedate = $("#due_date").val();
			
			this.crrnt.popup = this.CreatePopupWithData(type, title, desc, duedate, notes); // Updates the current popup with current data.

			var _data = {action: 'quiz', classOrConcept: this.classOrConcept, nid: nid, title: title, description: desc, notes: notes, duedate: duedate};

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
	var div = new fabric.Line([180, 0, 180, 1000], { fill: 'black', stroke: 'gray', strokeWidth: 4 });
	this.canvas.add(div);
	div.lockMovementX = div.lockMovementY = true;
	div.selectable = div.hasControls = div.hasBorders = false;

	var canvas = this.canvas;

	//Upload tool
	fabric.Image.fromURL('../imports/images/upload.png', function(oImg) {
		oImg.scale(.4); 
		oImg.set({left: 190, top: 10, id: 'toolbarUpload'}); 
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
