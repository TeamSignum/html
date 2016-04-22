/*
 * Learning Universe
 * Professor concept view
 *
 * Professor's view of the learning map for a specified concept node.
 */

var canvas;
var nid; 
var checked_off;
var mngr;
var etotal = 0;
var ntitle;
var crntnid2;
var showgrades = false;
var drag = false;
var xpos;
var ypos;
var timeOut;

$( document ).ready(function() {
	//Load google charts
	google.charts.load('current', {packages: ['bar']});

	canvas = new fabric.Canvas('map');
	// canvas.setBackgroundImage('../imports/images/maxresdefault.jpg' , canvas.renderAll.bind(canvas), {
 //    });
	
	canvas.selection = false;

	// Construct map manager
	mngr = new MManager(canvas, false, 1);

	//Load the learning map from the DB
	mngr.LoadMap(mngr, 2, 0);
	mngr.LoadEdges(mngr, 2, 0);
	mngr.LoadConnections(2);
	
	//Load participant nodes
	//Get enroll data
	//Get node completion percentages
	getParticipants();
	getEnrolled();
	getPercents();
	
	//Button to show quiz grades
	$("#quizgrades").click(
        function() {mngButton() });
	
	canvas.hoverCursor = 'pointer';
	
	//Animate the participant nodes
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		animateNode(mngr.nodes[i], i);
	}
	
	//Zoom mousewheel event
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
				if (e.target.id === "mapNode") 
				{
					//setParticipant(e.target.nid);
					//getParticipants();
					//mngr.HandleMapNodeSelect(e.target);
				}
				//Display popup event
				if(e.target.id === "popupnode")
				{
					crntnid2 = e.target.nid;
					getStats(e.target.nid, e.target.title.text, e.target.node.type);
				}
				//Navigate to assignment grading page
				if((e.target.id === "mapNode" && e.target.type === "assignment") || (e.target.id === "percNode" && e.target.type === "assignment"))
				{
					navToAssign(e.target.nid);
				}
			}
			else
			{
				//Panning starting coords
				var mpointer = canvas.getPointer(e.e);
				xpos = mpointer.x;
				ypos = mpointer.y;
				drag = true;
			}
	    },
		
		'mouse:move': function(e){
			if(drag == true)
			{
				//Panning, change window location to new mouse coords
				var mpointer = canvas.getPointer(e.e);
				var newxpos = mpointer.x;
				var newypos = mpointer.y;
				
				//window.scrollTo(document.body.scrollLeft + (xpos - e.pageX), document.body.scrollTop + (ypos - e.pageY));
				$(window).scrollTop($(window).scrollTop() + (ypos - newypos));
				$(window).scrollLeft($(window).scrollLeft() + (xpos - newxpos));
			}
		},
		
		'mouse:up': function(e){
			//Set panning off
			drag = false;
		},
	
		'mouse:over': function(e){
			//Old highlighting events
			if(e.target.id === "mapNode" || e.target.id === "cmapNode")
			{
				//e.target.setStroke('yellow');
				//canvas.renderAll();
			}
		},
	
		'mouse:out': function(e){
			//Old highlighting events
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

	//Close popup
	$( "#xmark" ).click(function() {
		closePopup();
	});


});

//Sets up the animation loop for a participant node
function animateNode(n, ind){
	//Speed of animation
	var duration = 10000;
	
	//Orbital rotation angles
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
				
				//Radius of the orbit
				var radius = 100;
				radius = radius * mngr.canvasScale;
				
				//Get center points to orbit around
				var cx = n.getCenterPoint().x;
				var cy = n.getCenterPoint().y;
				
				//Calculate the position of the orbit
				var x = cx + radius * Math.cos(angle);
				var y = cy + radius * Math.sin(angle);
				
				//Update the positions of the participant node
				n.pnode.originX = 'center';
				n.pnode.originY = 'center';
				
				n.pnode.set({left: x, top: y}).setCoords();
				
				n.pnode.ptext.originX = 'center';
				n.pnode.ptext.originY = 'center';
				
				n.pnode.ptext.top = y + 2;
				n.pnode.ptext.left = x;
				
				//After updating each participant node render their new positions
				if(ind == mngr.nodes.length-1)
				{
					canvas.renderAll();
				}
			},
			onComplete: animate
		});
	})();
}

//Esc key bind
$(document).keyup(function(e) {

  	// Esc
  	if (e.keyCode == 27){
  		closePopup();
  	}
});

//Button handles displaying the quiz grades chart
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
		$("#quizstat_chart_title").hide();
		showgrades = false;
		$("#quizgrades").text("Show Quiz Grades");
	}
	return false;
}

//Navigates to specified node's concept page
//AJAX used to insert into session node's nid to load correct concept page
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

//Get number of students enrolled in class
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

//Display popup
function showPopup()
{
	//Unbind zoom functionality while in popup
	$(window).unbind('mousewheel');
	$("#custom_container").show();
	$("#dim_div").show();
}

//Close popup
function closePopup()
{
	$("#quizstat_chart").hide();
	$("#quizstat_chart_title").hide();
	if(showgrades == true)
	{
		showgrades = false;
		$("#quizgrades").text("Show Quiz Grades");
	}
	$("#custom_container").hide();
	$("#dim_div").hide();
	
	//Rebind zoom functionality after exiting popup
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

//Get class completion stats for a specific node
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

//Get the quiz grade stats
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
		}
	});
	
	return false;
}

//Build google chart for quiz grades
function buildQuizChart(result)
{
	//Set up the quiz grade ranges
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
	
	//Increment the grade range based on each student's quiz grade
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
	
	//Set up chart columns
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
	
	//Set chart options
	var options = {
		height: 450,
		width: 600
	}
	
	//Append graph to the page
	var chart = new google.charts.Bar(document.getElementById('quizstat_chart'));
	
	chart.draw(data, google.charts.Bar.convertOptions(options));
	
	$("#quizstat_chart").show();
	$("#quizstat_chart_title").show();
}

//Build google chart for completion stats
function buildChart(result, title)
{
	//Set up graph columns
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
   // data.addColumn('number', 'Total');
	data.addColumn('number', 'Count');
	
	//Insert row data	
	for(var i = 0; i < result.length-1; i++)
	{
		data.addRow([result[i].cdate, parseInt(result[i].ctotal)]);
	}
	
	//Update graph info and title
	if(result.length > 0)
	{
		$("#stat_total").text("Students who completed " + ntitle + ": "+ result[result.length-1].ctotal + " Total students: " + etotal);
	}
		
	$("#chart_title").text(ntitle + " date completion statistics");
		
	//Set graph options
	var options = {
		//chart:{title: 'fdg'},
		//vAxis: { textPosition: 'none' },
		//chartArea:{left:0,top:0,width:"70%",height:"70%"},
		height: 450,
		width: 600,
		bar: {groupWidth: '30%'},
		vAxis: {viewWindow: {max: etotal, min: 0}}
	};
	
	//Append graph to the page
	var chart = new google.charts.Bar(document.getElementById('stat_chart'));
	
    chart.draw(data, google.charts.Bar.convertOptions(options));
}

//Get the number of participants for each node from the database(current number of students working on a node)
function getParticipants()
{
	//Get the ids for each node
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
			//Foreach node update the participant number
			for(var i = 0; i < result.length; i++)
			{
				if(result[i].count != null)
				{
					drawParticipants(result[i].nid, result[i].count);
				}
			}
			canvas.renderAll();
			//Set timeout to update participants every 15 secs
			timeOut = setTimeout(function(){
				getParticipants();
			}, 15000);
		}
	});
	
	return false;
}

//Update the number in the participant node
function drawParticipants(nid, count)
{
	//Find the correct node from the nid
	var temp;
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		if(mngr.nodes[i].nid == nid)
		{
			temp = mngr.nodes[i];
		}
	}
	
	//Update the new number
	temp.pnode.ptext.setText(count);
}

//Get the completion percentages for each node
function getPercents()
{
	//Get the ids for each node
	var temp = [];
	for(var i = 0; i < mngr.nodes.length; i++)
	{
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
			for(var i = 0; i < result.length; i++)
			{
				drawPercents(result[i].nid, result[i].count);
			}
		}
	});
	
	return false;
}

//Draw the completion percentages in the center of the node
function drawPercents(nid, count)
{
	//Find the correct node from the nid
	var temp;
	for(var i = 0; i < mngr.nodes.length; i++)
	{
		if(mngr.nodes[i].nid == nid)
		{
			temp = mngr.nodes[i];
		}
	}
	
	var perc = "0%";
	
	//Calculate the percentage
	if(count != 0)
	{
		var p = Math.floor((parseFloat(count) / parseFloat(etotal)) * 100);
		//alert(Math.floor((parseFloat(count) / parseFloat(total)) * 100));
		perc = p + "%";
	}
	
	//Add text for the percentage
	var t = new fabric.Text(perc, {
			fontFamily: 'arial black',
			fontSize: 20,
			left: temp.left,
			top: temp.top,
			id: "percNode",
			type: temp.type
	});
	
	//Place the percent in the center of the node
	t.originX = 'center';
	t.originY = 'center';
	
	t.left = temp.getCenterPoint().x;
	t.top = temp.getCenterPoint().y;
	t.setCoords();
	
	t.nid = temp.nid;
	
	//Set the text's controls
	t.hasControls = false;
	t.hasBorders = false;
	t.lockMovementX = true;
	t.lockMovementY = true;
	t.evented = false;
	
	canvas.add(t);
}