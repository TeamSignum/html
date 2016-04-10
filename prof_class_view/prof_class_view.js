var canvas;
var mngr;
var etotal = 0;
var ntitle;
var drag = false;
var xpos;
var ypos;

$( document ).ready(function() {
	google.charts.load('current', {packages: ['bar']});

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
	getEnrolled();
	getPercents();
	
	canvas.hoverCursor = 'pointer';
	
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
				if (e.target.id === "mapNode" || e.target.id === "percNode") 
				{
					//mngr.HandleMapNodeSelect(e.target);
					navigate(e.target.nid);
					//showPopup();
				}
				if(e.target.id === "popupnode")
				{
					getStats(e.target.nid, e.target.title.text);
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

	$( "#xmark" ).click(function() {
		closePopup();
	});

});

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

$(document).keyup(function(e) {

  	// Esc
  	if (e.keyCode == 27){
  		closePopup();
  	}
});

function navigate(nid)
{
	$.ajax({
		type: 'POST',
		url: "prof_class_view.php",
		dataType: 'html',
		data: {direct: nid},
		//async: false,
		
		success: function(result){
			//alert(result);
			if(result === "1")
			{
				window.location = '../prof_concept_view/prof_concept_view.html';
			}
		}
	});
	
	return false;
}

function showPopup()
{
	$(window).unbind('mousewheel');
	$("#custom_container").show();
	$("#dim_div").show();
}

function closePopup()
{
	$("#custom_container").hide();
	$("#dim_div").hide();
	
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

function getEnrolled()
{
	$.ajax({
		type: 'POST',
		url: "prof_class_view.php",
		dataType: 'html',
		data: {enrolled: 1},
		async: false,
		
		success: function(result){
			etotal = parseInt(result);
			//alert(result[0].nid + " " + result[0].count);
		}
	});
	
	return false;
}

function getStats(nid, title)
{
	ntitle = title;
	
	$.ajax({
		type: 'POST',
		url: "prof_class_view.php",
		dataType: 'json',
		data: {nstats: nid},
		//async: false,
		
		success: function(result){
			//alert(result);
			buildChart(result, ntitle);
			showPopup();
		}
	});
	
	return false;
}

function buildChart(result, title)
{
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Node');
        //data.addColumn('number', 'Total students');
		data.addColumn('number', 'Completed');
		
		for(var i = 0; i < result.length-1; i++)
		{
			data.addRow([result[i].title, parseInt(result[i].ctotal)]);
		}
		
		if(result.length > 0)
		{
			$("#stat_total").text("Students fully completed " + ntitle + ": "+ result[result.length-1].ctotal + " Total students: " + etotal);
		}
		
		$("#chart_title").text(ntitle + " statistics");
		
		var options = {
			//chart:{title: 'fdg'},
			//vAxis: { textPosition: 'none' },
			//chartArea:{left:0,top:0,width:"70%",height:"70%"},
			height: 450,
			width: 600,
			bar: {groupWidth: "30%"},
			vAxis: {viewWindow: {max: etotal}}
		};
		
		var chart = new google.charts.Bar(document.getElementById('stat_chart'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
}

function getParticipants()
{
	var temp = [];
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		//alert(mngr.nodes[i].id);
		temp.push(mngr.nodes[i].nid);
	}
	$.ajax({
		type: 'POST',
		url: "prof_class_view.php",
		dataType: 'json',
		data: {pnodes: temp},
		//async: false,
		
		success: function(result){
			//alert(result);
			//alert(result[0].nid + " " + result[0].count);
			for(var i = 0; i < result.length; i++)
			{
				if(result[i].count != null)
				{
					drawParticipants(result[i].nid, result[i].count);
				}
			}
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

function getPercents()
{
	var temp = [];
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		//alert(mngr.nodes[i].id);
		temp.push(mngr.nodes[i].nid);
	}
	$.ajax({
		type: 'POST',
		url: "prof_class_view.php",
		dataType: 'json',
		data: {nperc: temp},
		//async: false,
		
		success: function(result){
			//alert(result);
			//alert(result[0].nid + " " + result[0].count);
			for(var i = 0; i < result.length; i++)
			{
				drawPercents(result[i].nid, result[i].count);
			}
		}
	});
	
	return false;
}

function drawPercents(nid, count)
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
		var p = Math.floor((parseFloat(count) / parseFloat(etotal)) * 100);
		//alert(Math.floor((parseFloat(count) / parseFloat(total)) * 100));
		perc = p + "%";
	}
	
	var t = new fabric.Text(perc, {
			fontFamily: 'arial black',
			fontSize: 20,
			left: temp.left,
			top: temp.top,
			id: "percNode"
	});
	
	t.originX = 'center';
	t.originY = 'center';
	
	t.left = temp.getCenterPoint().x;
	t.top = temp.getCenterPoint().y;
	t.setCoords();
	
	t.nid = temp.nid;
	
	//var len = t.getWidth()/2;
	//var cenX = temp.getCenterPoint().x;
	//t.left = cenX - len;
	
	//var len2 = t.getHeight()/2;
	//var cenY = temp.getCenterPoint().y;
	//t.top = cenY - len2;
	
	t.hasControls = false;
	t.hasBorders = false;
	t.lockMovementX = true;
	t.lockMovementY = true;
	
	canvas.add(t);
}