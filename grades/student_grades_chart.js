/*           
 * Author: Joseph Cottongim                         
 * Created: February 7, 2016  
 *            
 * Javascript file 
 *          
 */  
 
$( document ).ready(function() 
{
	getGrades();
	//getGradesHardCode(); // Only used for testing
});

function getGrades(){
	// Determine if API will calculate average, or if
	// that needs to be done in this JS file
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': '3'}, // Query number for obtaining all grades
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			// TODO: Check if parseData is empty
			parseGradeData(parsedResult);
		}
	});
}

// POJO for storing the grade data necessary for a chart
function gradeChartData (cid, classnumber, gradeInfo){
	this.cid = cid;
	this.classnumber = classnumber;
	this.gradeInfo = gradeInfo;
}

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

