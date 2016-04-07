/*
 * Learning Universe Class Builder
 * Authors: Daniel Cushing and Dustin Reitstetter
 * Date: 1/17/16 
 */ 

var mngr;
var canvas;
var isDown = false;
var cline;
var fromn;
var timeOut;
var drag = false;
var xpos;
var ypos;

$( document ).ready(function() {

	var mapNodeId = "mapNode";

	// Create canvas
	canvas = new fabric.Canvas('map');

    canvas.setBackgroundImage('../imports/images/maxresdefault.jpg' , canvas.renderAll.bind(canvas), {
    });

    canvas.selection = false;

	// Construct map manager
	mngr = new MManager(canvas, true, 0);
	mngr.LoadIds(1);
	mngr.LoadMap(mngr, 1, 1);
	mngr.LoadEdges(mngr, 1, 1);
	mngr.LoadConnections(1);

	// We manually add Nodes and Edges to toolbar because it will be different for each view. But the dividing line and the lock and upload icon 
	// should stay the same (added on when we create map manager).
	
	var ctext = new fabric.Text("Concept Nodes", {
		fontFamily: 'arial black',
		fontSize: 17,
		fill: 'white',
		top: 110,
		left: 25
	});
	ctext.hasControls = false;
	ctext.hasBorders = false;
	ctext.lockMovementX = true;
	ctext.lockMovementY = true;
	ctext.selectable = false;
	canvas.add(ctext);

	var imgElement = document.getElementById('my-image1');
	var c = new fabric.Image(imgElement, {
	  left: 45,
	  top: 135,
	  id: "tb_largeCircle"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.25);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	c = new fabric.Image(imgElement, {
	  left: 55,
	  top: 265,
	  id: "tb_mediumCircle"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.20);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);

	c = new fabric.Image(imgElement, {
	  left: 65,
	  top: 380,
	  id: "tb_smallCircle"
	});
	c.width = 463;
	c.height = 455;
	c.scale(.15);
	c.hasControls = c.hasBorders = false;
	canvas.add(c);
	
	var ltext = new fabric.Text("Line Editors", {
		fontFamily: 'arial black',
		fontSize: 17,
		fill: 'white',
		top: 470,
		left: 40
	});
	ltext.hasControls = false;
	ltext.hasBorders = false;
	ltext.lockMovementX = true;
	ltext.lockMovementY = true;
	ltext.selectable = false;
	canvas.add(ltext);

	mngr.AddToolbarEdge(new fabric.Line([60, 500, 120, 600], { fill: 'red', stroke: 'red', strokeWidth: 3, id: 'tb_lineSolid' }));
	mngr.AddToolbarEdge(new fabric.Line([60, 625, 120, 725], { fill: 'red', stroke: 'red', strokeWidth: 3, strokeDashArray: [5, 5], id: 'tb_lineDotted' }));

	canvas.hoverCursor = 'pointer';
	
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

	//Canvas events
	canvas.on({
	  'mouse:down': function(e) {
	    if (e.target) {

	    	mngr.LockOrUpload(e.target, 1); 

	    	if(mngr.lineEdit == false && (e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle" ))
	    	{
				if(e.target.id === "tb_largeCircle")
					$("#tb_largeCirclett").hide();
					
				if(e.target.id === "tb_mediumCircle")
					$("#tb_mediumCirclett").hide();
					
				if(e.target.id === "tb_smallCircle")
					$("#tb_smallCirclett").hide();
					
		    	mngr.CopyNode(e.target, mapNodeId, "concept");
		    }
			else if(e.target.id === "tb_lineSolid")
			{
				mngr.LineEditor(e.target, true);
				if(mngr.lineEdit == true)
				{
					e.target.opacity = .5;
					var cobjs = canvas.getObjects();
					for(var i = 0; i < cobjs.length; i++)
					{
						if(cobjs[i].id)
						{
							if(cobjs[i].id === "tb_largeCircle" || cobjs[i].id === "tb_mediumCircle" || cobjs[i].id === "tb_smallCircle")
							{
								cobjs[i].lockMovementX = true;
								cobjs[i].lockMovementY = true;
							}
						}
					}
				}
				else
				{
					e.target.opacity = 1;
					var cobjs = canvas.getObjects();
					for(var i = 0; i < cobjs.length; i++)
					{
						if(cobjs[i].id)
						{
							if(cobjs[i].id === "tb_largeCircle" || cobjs[i].id === "tb_mediumCircle" || cobjs[i].id === "tb_smallCircle")
							{
								cobjs[i].lockMovementX = false;
								cobjs[i].lockMovementY = false;
							}
						}
					}
				}
				
			}
			else if(e.target.id === "tb_lineDotted"){
				mngr.LineEditor(e.target, false);
				if(mngr.lineEdit == true)
				{
					e.target.opacity = .5;
					var cobjs = canvas.getObjects();
					for(var i = 0; i < cobjs.length; i++)
					{
						if(cobjs[i].id)
						{
							if(cobjs[i].id === "tb_largeCircle" || cobjs[i].id === "tb_mediumCircle" || cobjs[i].id === "tb_smallCircle")
							{
								cobjs[i].lockMovementX = true;
								cobjs[i].lockMovementY = true;
							}
						}
					}
				}
				else
				{
					e.target.opacity = 1;
					var cobjs = canvas.getObjects();
					for(var i = 0; i < cobjs.length; i++)
					{
						if(cobjs[i].id)
						{
							if(cobjs[i].id === "tb_largeCircle" || cobjs[i].id === "tb_mediumCircle" || cobjs[i].id === "tb_smallCircle")
							{
								cobjs[i].lockMovementX = false;
								cobjs[i].lockMovementY = false;
							}
						}
					}
				}
			}
			else if(mngr.lineEdit == false && (e.target.id === mapNodeId || e.target.id === "popupnode"))
			{
				mngr.HandleMapNodeSelect(e.target);
			}
			else if(e.target.id === "deleteNode")
			{
				mngr.DeleteNode(e.target.node, 1);
			}
			else if(mngr.lineEdit == true)
			{
				if(e.target.id === "mapNode")
				{
					fromn = e.target;
					isDown = true;
					var x = e.target.getCenterPoint().x;
					var y = e.target.getCenterPoint().y;
					var points = [x, y, x, y];
					if(mngr.solid == true)
					{
						cline = new fabric.Line(points, {
							fill: 'white',
							stroke: 'white',
							strokeWidth: 3,
							selectable: false,
							id: "solid"
						});
					}
					else
					{
						cline = new fabric.Line(points, {
							fill: 'white',
							stroke: 'white',
							strokeWidth: 3,
							strokeDashArray: [5, 5],
							selectable: false,
							id: "dotted"
						});
					}
					
					var headLength = 15;
					
					var x1 = x;
					var y1 = y;
					var x2 = x;
					var y2 = y;
					
					var dx = x2 - x1;
					var dy = y2 - y1;

					var angle = Math.atan2(dy, dx);
					
					angle *= 180 / Math.PI;
					angle += 90;
					
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
					
					cline.trian = triangle;
					
					canvas.add(cline);
					canvas.add(triangle);
				}
			}

	      	canvas.renderAll();
	    }
		else
		{
			var mpointer = canvas.getPointer(e.e);
			xpos = mpointer.x;
			ypos = mpointer.y;
			drag = true;
		}
	  },
	  
	  'mouse:move': function(e) {
		if(drag == true)
		{
			var mpointer = canvas.getPointer(e.e);
			var newxpos = mpointer.x;
			var newypos = mpointer.y;
				
			//window.scrollTo(document.body.scrollLeft + (xpos - e.pageX), document.body.scrollTop + (ypos - e.pageY));
			$(window).scrollTop($(window).scrollTop() + (ypos - newypos));
			$(window).scrollLeft($(window).scrollLeft() + (xpos - newxpos));
		}

		if(isDown == false)
		{
			return;
		}
		else
		{
			if(e.target)
			{
				var temp;
				if(e.target.id === "mapNode")
				{
					temp = e.target;
				}
				if(e.target.id === "nodeText")
				{
					temp = e.target.node;
				}
				if(e.target.id === "popupnode")
				{
					temp = e.target.node;
				}
				if(e.target.id === "deleteNode")
				{
					temp = e.target.node;
				}
				var x = temp.getCenterPoint().x;
				//var y = temp.getCenterPoint().y;
				var y = temp.title.top;
				cline.set({ x2: x, y2: y });
				
				var x1 = cline.x1;
				var y1 = cline.y1;
				var x2 = x;
				var y2 = y;
					
				var dx = x2 - x1;
				var dy = y2 - y1;

				var angle = Math.atan2(dy, dx);
					
				angle *= 180 / Math.PI;
				angle += 90;
				
				cline.trian.angle = angle;
				cline.trian.top = y2;
				cline.trian.left = x2;
			}
			else
			{
				var pointer = canvas.getPointer(e.target);
				cline.set({ x2: pointer.x, y2: pointer.y });
				
				var x1 = cline.x1;
				var y1 = cline.y1;
				var x2 = pointer.x;
				var y2 = pointer.y;
					
				var dx = x2 - x1;
				var dy = y2 - y1;

				var angle = Math.atan2(dy, dx);
					
				angle *= 180 / Math.PI;
				angle += 90;
				
				cline.trian.angle = angle;
				cline.trian.top = y2;
				cline.trian.left = x2;
			}
			canvas.renderAll();
		}
	  },

	  'mouse:up': function(e) {
	  	drag = false;
		
		if(isDown)
		{
			if(e.target)
			{
				var temp;
				if(e.target.id === "mapNode")
				{
					temp = e.target;
				}
				if(e.target.id === "nodeText")
				{
					temp = e.target.node;
				}
				if(e.target.id === "popupnode")
				{
					temp = e.target.node;
				}
				if(e.target.id === "deleteNode")
				{
					temp = e.target.node;
				}
				
				if(temp.nid != fromn.nid)
				{
					cline.eid = mngr.eid;
					cline.hasControls = cline.hasBorders = false;
					cline.lockMovementX = cline.lockMovementY = true;
					cline.perPixelTargetFind = true;
					
					cline.trian.hasControls = false;
					cline.trian.hasBorders = false;
					cline.trian.lockMovementX = true;
					cline.trian.lockMovementY = true;
				
					fromn.lines.push(cline);
					fromn.lines2.push(1);
					temp.lines.push(cline);
					temp.lines2.push(2);
				
					var linetemp = {
						line: cline,
						id: mngr.eid
					};
				
					mngr.eid++;
					mngr.edges.push(linetemp);
					canvas.sendToBack(cline);

				}
			}
			else
			{
				canvas.remove(cline);
				canvas.remove(cline.trian);
				
			}
			isDown = false;
		}
	  	if (e.target) {
	  		if (e.target.id === "mapNode" && mngr.lineEdit == false){
				mngr.AddNodeToCanvas(e.target);
	  		}
			//mngr.DrawEdgeBetweenNodes(e.target);
			canvas.renderAll();
		}
	  },

	  'object:moved': function(e) {
	    //e.target.opacity = 0.5;
	  },

	  'object:modified': function(e) {
	   	//e.target.opacity = 1;
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
			//e.target.scale(.26);
			//e.target.setCoords();
			//canvas.renderAll();
		}
		if(e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle" || e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
		{
			timeOut = setTimeout(function(){
				showTooltip(e.target.id, e.target.top, e.target.left);
			}, 1000);
			//showTooltip(e.target.id, e.target.top, e.target.left);
		}
	  },
	
	  'mouse:out': function(e){
		if(e.target.id === mapNodeId)
		{
			//e.target.scale(.25);
			//e.target.setCoords();
			//canvas.renderAll();
		}
		if(e.target.id === "tb_largeCircle" || e.target.id === "tb_mediumCircle" || e.target.id === "tb_smallCircle" || e.target.id === "tb_lineSolid" || e.target.id === "tb_lineDotted")
		{
			clearTimeout(timeOut);
			hideTootltip(e.target.id);
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

function HelpMessageHelper(){
	DisplayHelpMessage("class_builder");
}

function showTooltip(type, top, left)
{
	var ttid = type + "tt";
	$("#" + ttid).show();
    $("#" + ttid).css({"position": "absolute", "top": top, "left": left, "background-color": "white", "width": "250px"});
}

function hideTootltip(type)
{
	var ttid = type + "tt";
	$("#" + ttid).hide();
}