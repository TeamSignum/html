var canvas;
var mngr;
var tempi = 0;
var tempp = 12;
var etotal = 0;
var ntitle;

$( document ).ready(function() {
	google.charts.load('current', {packages: ['bar']});

	canvas = new fabric.Canvas('map', {backgroundColor: "#99ffff"});

	// Construct map manager
	mngr = new MManager(canvas, false, 0);

	//Load the learning map from the DB
	mngr.LoadMap(mngr, 1, 0);
	mngr.LoadEdges(mngr, 1, 0);
	
	getParticipants();
	getEnrolled();
	getPercents();
	
	//Canvas events
	canvas.on({

		'mouse:down': function(e) {
			if(e.target)
			{
				if (e.target.id === "mapNode") 
				{
					//mngr.HandleMapNodeSelect(e.target);
					getStats(e.target.nid, e.target.title.text);
					//showPopup();
				}
			}
	    },
	
		'mouse:over': function(e){
			if(e.target.id === "mapNode" || e.target.id === "cmapNode")
			{
				e.target.setStroke('yellow');
				canvas.renderAll();
			}
		},
	
		'mouse:out': function(e){
			if(e.target.id === "mapNode")
			{
				e.target.setStroke('white');
			}
			if(e.target.id === "cmapNode")
			{
				e.target.setStroke("#0d0");
			}
			canvas.renderAll();
		}
	});

	$( "#checkoff" ).click(function() {
		//mngr.CheckOffNode();
	});

	$( "#p_Cancel" ).click(function() {
		//mngr.HidePopup2();
		closePopup();
	});

});

function showPopup()
{
	$("#custom_container").show();
	$("#dim_div").show();
}

function closePopup()
{
	$("#custom_container").hide();
	$("#dim_div").hide();
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
			//drawChart(result);
			buildChart(result, ntitle);
			showPopup();
			//alert(result[0].nid + " " + result[0].count);
		}
	});
	
	return false;
}

function buildChart(result, title)
{
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Node');
        data.addColumn('number', 'Total students');
		data.addColumn('number', 'Completed');
		
		for(var i = 0; i < result.length-1; i++)
		{
			data.addRow([result[i].title, etotal, parseInt(result[i].ctotal)]);
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
			width: 600
		};
		
		var chart = new google.charts.Bar(document.getElementById('stat_chart'));

        chart.draw(data, options);
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
			top: temp.top + temp.radius - 10
	});
	
	var len = t.getWidth()/2;
	var cenX = temp.getCenterPoint().x;
	t.left = cenX - len;
	
	t.hasControls = false;
	t.hasBorders = false;
	t.lockMovementX = true;
	t.lockMovementY = true;
	
	canvas.add(t);
}