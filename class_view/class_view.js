var canvas;
var nid; 
var checked_off;
var mngr;
var timeOut;
var drag = false;
var xpos;
var ypos;

$( document ).ready(function() {

	canvas = new fabric.Canvas('map');
    canvas.setBackgroundImage('../imports/images/maxresdefault.jpg' , canvas.renderAll.bind(canvas), {
    });
	
	canvas.selection = false;

	// Construct map manager
	mngr = new MManager(canvas, false, 0);

	//Load the learning map from the DB
	mngr.LoadMap(mngr, 1, 0);
	mngr.LoadEdges(mngr, 1, 0);
	mngr.LoadConnections(1);
	
	getParticipants();
	getPercents();
	
	canvas.hoverCursor = 'pointer';
	
	//drawOrbitals();
	
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		animateNode(mngr.nodes[i], i);
	}
	
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
			if(e.target)
			{
				if (e.target.id === "mapNode" || e.target.id === "popupnode") 
				{
					mngr.HandleMapNodeSelect(e.target);
				}
				if(e.target.id === "percNode")
				{
					mngr.HandleMapNodeSelect(e.target.node);
				}
			}
			else
			{
				var mpointer = canvas.getPointer(e.e);
				xpos = mpointer.x;
				ypos = mpointer.y;
				drag = true;
			}
	    },
		
		'mouse:move': function(e){
			if(drag == true)
			{
				var mpointer = canvas.getPointer(e.e);
				var newxpos = mpointer.x;
				var newypos = mpointer.y;
				
				//window.scrollTo(document.body.scrollLeft + (xpos - e.pageX), document.body.scrollTop + (ypos - e.pageY));
				$(window).scrollTop($(window).scrollTop() + (ypos - newypos));
				$(window).scrollLeft($(window).scrollLeft() + (xpos - newxpos));
			}
		},
		
		'mouse:up': function(e){
			drag = false;
		},
	
		'mouse:over': function(e){
			if(e.target.id === "mapNode" || e.target.id === "cmapNode")
			{
				//e.target.setStroke('yellow');
				//canvas.renderAll();
			}
		},
	
		'mouse:out': function(e){
			if(e.target.id === "mapNode")
			{
				//e.target.setStroke('white');
			}
			if(e.target.id === "cmapNode")
			{
				//e.target.setStroke("#0d0");
			}
			//canvas.renderAll();
		}
	});

	$( "#checkoff" ).click(function() {
		//mngr.CheckOffNode();
	});

	$( "#xmark" ).click(function() {
		mngr.HidePopup();
	});

});

function HelpMessageHelper(){
	DisplayHelpMessage("class_view");
}

function drawOrbitals()
{
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		var o = new fabric.Circle({
			radius: 100,
			top: mngr.nodes[i].top,
			left: mngr.nodes[i].left,
			fill: '',
			stroke: 'white',
			hasBorders: false,
			hasControls: false,
			lockMovementX: true,
			lockMovementY: true,
			selectable: false
		});
		
		var width = o.getWidth()/2;
		var centerx = mngr.nodes[i].getCenterPoint().x;
		o.left = centerx - width;
	
		var height = o.getHeight()/2;
		var centery = mngr.nodes[i].getCenterPoint().y
		o.top = centery - height;
		
		canvas.add(o);
		canvas.sendToBack(o);
	}
}

function animateNode(n, ind){
	var duration = 10000;
	
	var startAngle = fabric.util.getRandomInt(-180, 0);
	var endAngle = startAngle + 359;
	
	(function animate() {
		fabric.util.animate({
			startValue: startAngle,
			endValue: endAngle,
			duration: duration,
			
			easing: function(t, b, c, d) { return c*t/d + b; },
			
			onChange: function(angle) {
				angle = fabric.util.degreesToRadians(angle);
				
				var radius = 100;
				radius = radius * mngr.canvasScale;
				
				var cx = n.getCenterPoint().x;
				var cy = n.getCenterPoint().y;
				
				var x = cx + radius * Math.cos(angle);
				var y = cy + radius * Math.sin(angle);
				
				n.pnode.originX = 'center';
				n.pnode.originY = 'center';
				
				n.pnode.set({left: x, top: y}).setCoords();
				
				n.pnode.ptext.originX = 'center';
				n.pnode.ptext.originY = 'center';
				
				n.pnode.ptext.top = y + 2;
				n.pnode.ptext.left = x;
				
				
				if(ind == mngr.nodes.length-1)
				{
					canvas.renderAll();
				}
			},
			onComplete: animate
		});
	})();
}

function getPercents()
{
	var temp = [];
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		temp.push(mngr.nodes[i].nid);
	}
	$.ajax({
		async: true,
		type: 'GET',
		url: "class_view.php",
		dataType: 'json',
		data: {userperc: temp},
		success: function(result){
			for(var i = 0; i < result.length; i++)
			{
				if(result[i].count != null)
				{
					drawPercents(result[i].nid, result[i].count, result[i].total);
				}
			}
		}
	});
	
	return false;
}

function drawPercents(nid, count, total)
{
	var temp;
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		if(mngr.nodes[i].nid == nid)
		{
			temp = mngr.nodes[i];
		}
	}
	
	var perc = "0%";
	
	if(count != 0)
	{
		var p = Math.floor((parseFloat(count) / parseFloat(total)) * 100);
		perc = p + "%";
	}
	
	var t = new fabric.Text(perc, {
		fontFamily: 'arial black',
		fontSize: 20,
		left: temp.left,
		top: temp.top,
		id: "percNode"
	});
	
	t.node = temp;
	
	t.lockMovementX = t.lockMovementY = true;
	t.hasControls = t.hasBorders = false;

	var len = t.getWidth()/2;
	var cenX = temp.getCenterPoint().x;
	t.left = cenX - len;
	
	var len2 = t.getHeight()/2;
	var cenY = temp.getCenterPoint().y;
	t.top = cenY - len2;
	
	canvas.add(t);
}

function getParticipants()
{
	var temp = [];
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		temp.push(mngr.nodes[i].nid);
	}
	$.ajax({
		async: true,
		type: 'GET',
		url: "class_view.php",
		dataType: 'json',
		data: {pnodes: temp},
		
		success: function(result){
			for(var i = 0; i < result.length; i++)
			{
				if(result[i].count != null)
				{
					drawParticipants(result[i].nid, result[i].count);
				}
			}
			canvas.renderAll();
			timeOut = setTimeout(function(){
				getParticipants();
			}, 15000);
		}
	});
	
	return false;
}

function drawParticipants(nid, count)
{
	var temp;
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		if(mngr.nodes[i].nid == nid)
		{
			temp = mngr.nodes[i];
		}
	}
	
	temp.pnode.ptext.setText(count);
}