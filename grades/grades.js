/*           
 * Author: LearningUniverse                         
 * Created: February 1, 2016  
 *            
 * Javascript file for handling the interaction between                                                        
 * grades.html, grades.php to build the grade view.
 *          
 */  

var userid ='';
 
$( document ).ready(function() 
{
	getSessionInfo();	
});

function getSessionInfo(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "../navbar/phpInfoGetter.php",
		data: {'GETINFO': 'SESSION'},
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			userid=parsedResult.userid;
			getGrades(parsedResult);
		}
	});
}

function getGrades(parsedResult){
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': 'studentClassGradeStats',
				  'cid': parsedResult.classid},
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			
			buildDisplayPage(parsedResult);
		}
	});
}

// POJO for storing the grade data necessary for a chart
function gradeChartData (divId, assignmentId, gradeInfo){
	this.divId = divId;
	this.assignmentId = assignmentId;
	this.gradeInfo = gradeInfo;
}

function buildDisplayPage(parsedResult){
	var currentAssignment = '';
	var html = '';
	var gradeTotal = 0;
	var gradeCount = 0;
	var gradeLow = 100;
	var gradeHigh = 0;
	var gradeAverage = 0;
	var studentGrade = 0;
	var divCount = 0;
	// Array for gradeChartData POJOs
	var gradeInfo = new Array();
	var gradeChartDataArray = [];

	for(var i = 0; i < parsedResult.length; i++){
		if(currentAssignment !== parsedResult[i].title){
			gradeInfo.push(['Assignment', 'Score']); // This is the header information for the Google Chart
			currentAssignment = parsedResult[i].title;
			// Build the trigger header for the assignment
			html +='<div class = "class-header"><span class="textPadding"> + ' + currentAssignment + ' - PLACEHOLDER%</span></div>';
			html +='<div id = "chart'+divCount+'" class = "toggle"></div>';
		}

		// Calculate the the stats for the assignment
		var tempGrade = parseInt(parsedResult[i].score)
		gradeTotal += tempGrade;
		gradeCount++;
		if(tempGrade > gradeHigh)
			gradeHigh=tempGrade;
		if(tempGrade < gradeLow)
			gradeLow = tempGrade;
		//alert(parsedResult[i].idusers + ' ' + userid);
		if(parsedResult[i].idusers == userid)
			studentGrade = tempGrade;
		
		// Check to see if there are anymore grades
		if(i < parsedResult.length-1){
			// Check if the next grade belongs to the current assignment
			if(currentAssignment !== parsedResult[i+1].title){
				gradeAverage = (gradeTotal/gradeCount).toFixed(2);
				// Insert the grade into the html string
				html = html.replace("PLACEHOLDER", studentGrade);

				// Create the data array for the gradeChartData object
				gradeInfo.push(["Low", gradeLow]);
				gradeInfo.push(["Average", gradeAverage]);
				gradeInfo.push(["High", gradeHigh]);
				// Create the gradeChartData object
				var temp = new gradeChartData('chart'+divCount, currentAssignment, gradeInfo);
				gradeChartDataArray.push(temp);

				// Increment divCount
				divCount++;

				// Reset the grade variables for the next class
				var gradeTotal = 0;
				var gradeCount = 0;
				var gradeLow = 100;
				var gradeHigh = 0;
				var gradeAverage = 0;
				var studentGrade = 0;
				var gradeInfo = new Array();
			}
		}
		else{
			// No more grade information
			gradeAverage = (gradeTotal/gradeCount).toFixed(2);
			// Insert the grade into the html string
			html = html.replace("PLACEHOLDER", studentGrade);

			// Create the data array for the gradeChartData object
			gradeInfo.push(["Low", gradeLow]);
			gradeInfo.push(["Average", gradeAverage]);
			gradeInfo.push(["High", gradeHigh]);
			// Create the gradeChartData object
			var temp = new gradeChartData('chart'+divCount, currentAssignment, gradeInfo);
			gradeChartDataArray.push(temp);
			//alert(temp.gradeInfo);
		}
	}
	
	insertGrades(html);
	buildGoogleChart(gradeChartDataArray);

}	

function insertGrades(html){
		$('#grades').html(html);
		bindHtmlElements();
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
	        	title: gradeChartDataArray[i].assignmentId,
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
	        var chart = new google.visualization.ColumnChart(document.getElementById(gradeChartDataArray[i].divId));
	        chart.draw(data, options);
	    }
    }
}

function bindHtmlElements(){
	// Hide all the grade chart panels
	$('.toggle').hide();
	// Function for toggling the grade displays
	$(".class-header").click(function(){
		// Get all headers, and toggle close when another opens
    	$(this).next(".toggle").slideToggle("medium");
 	 });
}
	