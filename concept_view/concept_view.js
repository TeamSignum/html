var canvas;
var nid; 
var checked_off;
var mngr;
var timeOut;

$( document ).ready(function() {

	canvas = new fabric.Canvas('map');
	canvas.setBackgroundImage('../imports/images/maxresdefault.jpg' , canvas.renderAll.bind(canvas), {
    });

	// Construct map manager
	mngr = new MManager(canvas, false, 1);

	//Load the learning map from the DB
	mngr.LoadMap(mngr, 2, 0);
	mngr.LoadEdges(mngr, 2, 0);
	
	getParticipants();
	
	//var timer = setInterval(function() {getParticipants()}, 10000);
	
	canvas.hoverCursor = 'pointer';
	
	//Canvas events
	canvas.on({

		'mouse:down': function(e) {
			if(e.target)
			{
				if (e.target.id === "mapNode" || e.target.id === "popupnode") 
				{
					clearTimeout(timeOut);
					setParticipant(e.target.nid);
					getParticipants();
					mngr.HandleMapNodeSelect(e.target);
				}
			}
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
		mngr.CheckOffNode();
	});

	$( "#xmark" ).click(function() {
		mngr.HidePopup();
	});

});

function setParticipant(nid)
{
	$.ajax({
		type: 'POST',
		url: "concept_view.php",
		dataType: 'html',
		data: {setp: nid},
		//async: false,
		
		success: function(result){
			//alert(result);
		}
	});
	
	return false;
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
		type: 'POST',
		url: "concept_view.php",
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
		top: temp.top + temp.radius
	});

	t.lockMovementX = t.lockMovementY = true;
	t.selectable = t.hasControls = t.hasBorders = false;

	var len = t.getWidth()/2;
	var cenX = temp.getCenterPoint().x;
	t.left = cenX - len;
	
	//canvas.add(t);
}

function HelpMessageHelper(){
	DisplayHelpMessage("concept_view");
}

function setParticipant(nid)
{
	$.ajax({
		async: true,
		type: 'POST',
		url: "concept_view.php",
		dataType: 'html',
		data: {setp: nid},
		success: function(result){
		}
	});
	
	return false;
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
		url: "concept_view.php",
		dataType: 'json',
		data: {pnodes: temp},
		
		success: function(result){
			//alert(result);
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