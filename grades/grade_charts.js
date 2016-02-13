/*           
 * Author: Joseph Cottongim                         
 * Created: February 7, 2016
 * Last Edited: February 11, 2016  
 *            
 * Javascript file for grade charts on the Learning Universe website.
 *
 * To automatically generate a chart on page load, you need to have the following 
 * in your html document:
 *
 * <input type="hidden" id="grade_chart_type" value="############" disabled>
 *
 * where "############" is the name of the type of chart that you want.  In
 * this file, the chart type is the name of the function.  You can see the list
 * of functions in the switch statement in the document.ready function.  You 
 * also need to include a section for the chart(s) to be inserted into in your html
 * document, as follows:
 *
 * <section id="gradecharts"></section>
 *
 * Functions called in document.ready are automatic.  However, any function can
 * be called directly, to allow more dynamic generation of charts.
 *          
 */  
 
$( document ).ready(function() 
{
	var gradeChartType=$('#grade_chart_type').attr('value');
	switch(gradeChartType){
		case 'studentOneGrade':
			studentOneGrade();
			break;
		case 'studentAllGradesOneClass':
			studentAllGradesOneClass();
			break;
		case 'studentAllGradesAllClasses':
			studentAllGradesAllClasses();
			break;
		
		case 'professorOneStudentOneGrade':
			professorOneStudentOneGrade();
			break;
		case 'professorOneStudentAllAssignments':
			professorOneStudentOneGrade();
			break;
		case 'professorOneStudentOneGrade':
			professorOneStudentOneGrade();
			break;
		case 'professorOneStudentOneGrade':
			professorOneStudentOneGrade();
			break;
			
		default:
			// Don't do anything
			break;
	}
	//alert (gradeChartType);
});


// #### Functions to get grade data from the database  #####
// Class id (cid) and assignment id (idassignment) must be passed to php $_POST
function studentOneGrade(cid, idassignment){
	
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': 'studentOneGrade', 
		              'cid': cid, 
		     'idassignment': idassignment},
		datatpye: "json",
		success: function(result){
			alert(result);
			var parsedResult = JSON.parse(result);
			// TODO: Check if parseData is empty
			parseGradeData(parsedResult);
		}
	});
}

// Class id (cid) must be passed to php $_POST
function studentAllGradesOneClass(cid){
	
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': 'studentAllGradesOneClass', 
		              'cid': cid},
		datatpye: "json",
		success: function(result){
			alert(result);
			var parsedResult = JSON.parse(result);
			// TODO: Check if parseData is empty
			parseGradeData(parsedResult);
		}
	});
}

// No additional information required to be passed to php $_POST
function studentAllGradesAllClasses(){
	
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': 'studentAllGradesAllClasses'},
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			// TODO: Check if parseData is empty
			parseGradeData(parsedResult);
		}
	});
}

// 
function professorOneStudentOneGrade(studentid, cid, idassignment){
	
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': 'professorOneStudentOneGrade',
				'studentid': studentid,
		              'cid': cid, 
		     'idassignment': idassignment},
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			// TODO: Check if parseData is empty
			parseGradeData(parsedResult);
		}
	});
}

// 
function professorOneStudentAllAssignments(studentid, cid){
	
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': 'professorOneStudentAllAssignments',
				'studentid': studentid,
		              'cid': cid},
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			// TODO: Check if parseData is empty
			parseGradeData(parsedResult);
		}
	});
}

// 
function professorOneClassOneAssignment(cid, idassignment){
	
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': 'professorOneClassOneAssignment',
				      'cid': cid, 
		     'idassignment': idassignment},
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			// TODO: Check if parseData is empty
			parseGradeData(parsedResult);
		}
	});
}

// 
function professorOneStudentOneGrade(studentid, cid, idassignment){
	
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': 'professorOneStudentOneGrade',
				'studentid': studentid,
		              'cid': cid, 
		     'idassignment': idassignment},
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			// TODO: Check if parseData is empty
			parseGradeData(parsedResult);
		}
	});
}



// ##### END: Functions to get grade data from the database  #####

// POJO for storing the grade data necessary for a chart
function gradeChartData (cid, classnumber, gradeInfo){
	this.cid = cid;
	this.classnumber = classnumber;
	this.gradeInfo = gradeInfo;
}

// Process Grade Data and put it into gradeChartData object(s)
function parseGradeData(gradeData){
	var currentClass = '';
	var gradeTotal = 0;
	var gradeCount = 0;
	var grade = 0;
	var gradeInfo = new Array();
	var gradeChartDataArray = [];

	for(var i = 0; i < gradeData.length; i++){
		if(currentClass !== gradeData[i].classnumber){
			// Have to put a new 'heading' in the gradeInfo array
			gradeInfo.push(['Assignment', 'Score']);
			currentClass = gradeData[i].classnumber;
			// Put the assignment and score in gradeInfo array
			gradeInfo.push([gradeData[i].title, parseFloat(gradeData[i].score)]);
			gradeTotal += parseFloat(gradeData[i].score);
			gradeCount++;
		}
		else{
			// Put the assignment and score in gradeInfo array
			gradeInfo.push([gradeData[i].title, parseFloat(gradeData[i].score)]);
			gradeTotal += parseInt(gradeData[i].score);
			gradeCount++;
		}
		
		// Need this check to make sure we dont' try to access outside the array
		if(i < gradeData.length-1){
			// A new class number is coming, calculate and build the gradeData POJO
			if(currentClass !== gradeData[i+1].classnumber){
				// Calculate the overall class grade
				grade = (gradeTotal/gradeCount).toFixed(2);
				// Build the grade gradeChartData object
				var temp = new gradeChartData('chart'+gradeData[i].cid, gradeData[i].classnumber + " - " + grade +"%",
							   gradeInfo);
				// Put the gradeChartData object in the gradeChartDataArray
				gradeChartDataArray.push(temp);

				// Reset the grade variables for the next class
				gradeTotal = 0;
				gradeCount = 0;
				//alert(gradeInfo);
				gradeInfo = new Array(); // Resets the array
				//alert(gradeInfo);
			}
		}
		else{ // This is the end of grade data
			// Calculate the overall class grade
			grade = (gradeTotal/gradeCount).toFixed(2);
			// Build the grade gradeChartData object
			var temp = new gradeChartData('chart'+gradeData[i].cid, gradeData[i].classnumber + " - " + grade+"%",
						   gradeInfo);
			// Put the gradeChartData object in the gradeChartDataArray
			gradeChartDataArray.push(temp);
		}	
	}
	setUpHtmlDivIds(gradeChartDataArray);
}

// Build a div for Google Charts to insert the chart into.  If
// There is more than one class, multiple divs are generated.
function setUpHtmlDivIds(gradeChartDataArray){
	var html='';
	for(var i=0; i<gradeChartDataArray.length; i++){
		html +='<div id="'+ gradeChartDataArray[i].cid + '"></div>';
	}
	$('#gradecharts').html(html);
	buildGoogleChart(gradeChartDataArray);
}


function buildGoogleChart(gradeChartDataArray){
	// Load the Visualization API and the chart package.
      //google.load('visualization', '1.0', {'packages':['bar']});
      google.charts.load('current', {packages: ['corechart']});
  

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);
      
      // Callback that creates and populates a data table,
      // instantiates the chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data tables.
        for(var i = 0; i < gradeChartDataArray.length; i++){
        	var data = google.visualization.arrayToDataTable(gradeChartDataArray[i].gradeInfo);
        
	        // Set chart options
	        var options = {
	        	title: gradeChartDataArray[i].classnumber,
	        	legend: 'none',
	        	
	        	bar: {
	        		groupWidth: 30
	        	},
	        	vAxis: {
    				viewWindow: {
				        min: 0,
				        max: 100
				    },
				    ticks: [0, 20, 40, 60, 80, 100] // display labels every 25
				}
 			};

	        // Instantiate and draw our chart, passing in some options.
	        var chart = new google.visualization.ColumnChart(document.getElementById(gradeChartDataArray[i].cid));
	        chart.draw(data, options);
	    }
    }
}

