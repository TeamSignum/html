var canvas;
var nid; 
var checked_off;
var tempi = 0;
var tempp = 12; 
var mngr;
var etotal = 0;
var ntitle;
var crntnid2;
var showgrades = false;

$( document ).ready(function() {
	google.charts.load('current', {packages: ['bar']});

	canvas = new fabric.Canvas('map');
	canvas.setBackgroundImage('../imports/images/maxresdefault.jpg' , canvas.renderAll.bind(canvas), {
    });

	// Construct map manager
	mngr = new MManager(canvas, false, 1);

	//Load the learning map from the DB
	mngr.LoadMap(mngr, 2, 0);
	mngr.LoadEdges(mngr, 2, 0);
	
	getParticipants();
	getEnrolled();
	getPercents();
	
	//var timer = setInterval(function() {getParticipants()}, 10000);
	
	$("#quizgrades").click(
        function() {mngButton() });
	
	canvas.hoverCursor = 'pointer';
	
	//Canvas events
	canvas.on({

		'mouse:down': function(e) {
			if(e.target)
			{
				if (e.target.id === "mapNode") 
				{
					//setParticipant(e.target.nid);
					//getParticipants();
					//mngr.HandleMapNodeSelect(e.target);
				}
				if(e.target.id === "popupnode")
				{
					crntnid2 = e.target.nid;
					getStats(e.target.nid, e.target.title.text, e.target.node.type);
				}
				if((e.target.id === "mapNode" && e.target.type === "assignment") || (e.target.id === "percNode" && e.target.type === "assignment"))
				{
					navToAssign(e.target.nid);
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

	$( "#xmark" ).click(function() {
		closePopup();
	});


});

$(document).keyup(function(e) {

  	// Esc
  	if (e.keyCode == 27){
  		closePopup();
  	}
});

function mngButton()
{
	if(showgrades == false)
	{
		getQuizStats(crntnid2);
		showgrades = true;
		$("#quizgrades").text("Hide Quiz Grades");
	}
	else
	{
		$("#quizstat_chart").hide();
		showgrades = false;
		$("#quizgrades").text("Show Quiz Grades");
	}
	return false;
}

function navToAssign(nid)
{
	$.ajax({
		type: 'POST',
		url: "prof_concept_view.php",
		dataType: 'html',
		data: {directa: nid},
		async: false,
		
		success: function(result){
			if(result == 1)
			{
				window.location = '../grades/professor_grading.html';
			}
		}
	});
	
	return false;
}

function getEnrolled()
{
	$.ajax({
		type: 'POST',
		url: "prof_concept_view.php",
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

function showPopup()
{
	$("#custom_container").show();
	$("#dim_div").show();
}

function closePopup()
{
	$("#quizstat_chart").hide();
	if(showgrades == true)
	{
		showgrades = false;
		$("#quizgrades").text("Show Quiz Grades");
	}
	$("#custom_container").hide();
	$("#dim_div").hide();
}

function getStats(nid2, title, type)
{
	ntitle = title;
	
	$.ajax({
		type: 'POST',
		url: "prof_concept_view.php",
		dataType: 'json',
		data: {nstats: nid2},
		//async: false,
		
		success: function(result){
			//alert(result);
			if(type === "quiz1")
			{
				buildChart(result, title);
				getQuizStats(nid2);
			}
			else
			{
				buildChart(result, title);
				if(type === "quiz")
				{
					$("#quizgrades").show();
				}
				else
				{
					$("#quizgrades").hide();
				}
				showPopup();
			}
		}
	});
	
	return false;
}

function getQuizStats(nid2)
{
	$.ajax({
		type: 'POST',
		url: "prof_concept_view.php",
		dataType: 'json',
		data: {nquizstats: nid2},
		//async: false,
		
		success: function(result){
			//alert(result);
			buildQuizChart(result);
			//showPopup();
		}
	});
	
	return false;
}

function buildQuizChart(result)
{
	var _0to9 = 0;
	var _10to19 = 0;
	var _20to29 = 0;
	var _30to39 = 0;
	var _40to49 = 0;
	var _50to59 = 0;
	var _60to69 = 0;
	var _70to79 = 0;
	var _80to89 = 0;
	var _90to100 = 0;
	
	for(var i = 0; i < result.length; i++)
	{
		if(result[i]["grade"] >= 0 && result[i]["grade"] <= 9)
		{
			_0to9++;
		}
		if(result[i]["grade"] >= 10 && result[i]["grade"] <= 19)
		{
			_10to19++;
		}
		if(result[i]["grade"] >= 20 && result[i]["grade"] <= 29)
		{
			_20to29++;
		}
		if(result[i]["grade"] >= 30 && result[i]["grade"] <= 39)
		{
			_30to39++;
		}
		if(result[i]["grade"] >= 40 && result[i]["grade"] <= 49)
		{
			_40to49++;
		}
		if(result[i]["grade"] >= 50 && result[i]["grade"] <= 59)
		{
			_50to59++;
		}
		if(result[i]["grade"] >= 60 && result[i]["grade"] <= 69)
		{
			_60to69++;
		}
		if(result[i]["grade"] >= 70 && result[i]["grade"] <= 79)
		{
			
			_70to79++;
		}
		if(result[i]["grade"] >= 80 && result[i]["grade"] <= 89)
		{
			_80to89++;
		}
		if(result[i]["grade"] >= 90 && result[i]["grade"] <= 100)
		{
			_90to100++;
		}
	}
	
	var data = google.visualization.arrayToDataTable([
		['Grade Ranges', 'Count'],
		['0-9', _0to9],
		['10-19', _10to19],
		['20-29', _20to29],
		['30-39', _30to39],
		['40-49', _40to49],
		['50-59', _50to59],
		['60-69', _60to69],
		['70-79', _70to79],
		['80-89', _80to89],
		['90-100', _90to100]
	]);
	
	//var data = new google.visualization.DataTable();
	
	var options = {
		height: 450,
		width: 600
	}
	
	var chart = new google.charts.Bar(document.getElementById('quizstat_chart'));
	
	chart.draw(data, google.charts.Bar.convertOptions(options));
	
	$("#quizstat_chart").show();
}

function buildChart(result, title)
{
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
   // data.addColumn('number', 'Total');
	data.addColumn('number', 'Count');
		
	for(var i = 0; i < result.length-1; i++)
	{
		data.addRow([result[i].cdate, parseInt(result[i].ctotal)]);
	}
		
	if(result.length > 0)
	{
		$("#stat_total").text("Students who completed " + ntitle + ": "+ result[result.length-1].ctotal + " Total students: " + etotal);
	}
		
	$("#chart_title").text(ntitle + " date completion statistics");
		
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
		url: "prof_concept_view.php",
		dataType: 'json',
		data: {pnodes: temp},
		//async: false,
		
		success: function(result){
			//alert(result);
			//alert(result[0].nid + " " + result[0].count);
			for(var i = 0; i < result.length; i++)
			{
				drawParticipants(result[i].nid, result[i].count);
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
		url: "prof_concept_view.php",
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
			id: "percNode",
			type: temp.type
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