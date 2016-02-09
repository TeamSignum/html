/*           
 * Author: Joseph Cottongim                         
 * Created: February 7, 2016  
 *            
 * Javascript file 
 *          
 */  
 
$( document ).ready(function() 
{
	//getGrades();
	getGradesHardCode(); // Only used for testing
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

			buildGoogleChart(parsedResult);
		}
	});
}

// Only used for testing
function getGradesHardCode(){
	// Setup for visualization
	var gradeData = [];
	// Push array identifiers
	gradeData.push(['Assignment', 'Low', 'Average', 'high']);
	// Push grade data 
	gradeData.push(['Assignment 1', 30, 60, 90]);
	gradeData.push(['Assignment 2', 40, 75, 98]);
	gradeData.push(['Assignment 3', 30, 60, 90]);
	gradeData.push(['Midterm 1', 30, 60, 90]);
	gradeData.push(['Assignment 4', 30, 60, 90]);
	gradeData.push(['Assignment 5', 30, 60, 90]);
	
	buildGoogleChart(gradeData);
}

function buildGoogleChart(gradeData){
	// Load the Visualization API and the chart package.
      //google.load('visualization', '1.0', {'packages':['bar']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = google.visualization.arrayToDataTable(gradeData);

        // Set chart options
        var options = {
          	
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }

}

