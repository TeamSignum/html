/*           
 * Author: Joseph Cottongim                         
 * Created: February 1, 2016  
 *            
 * Javascript file for handling the interaction between                                                        
 * grades.html, grades.php to build the grade view.
 *          
 */  
 
$( document ).ready(function() 
{
	getSessionInfo();
	
});

function getSessionInfo(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "../navbar/phpInfoGetter.php",
		data: {'GETINFO': 'SESSION'}, // Query number for obtaining all grades
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			
			getGrades(parsedResult);
		}
	});
}

function getGrades(parsedResult){
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		data: {'gradeQuery': 'studentAllGradesOneClass',
				  'classid': parsedResult.classid},
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			
			buildDisplayPage(parsedResult);
		}
	});
}

function buildDisplayPage(parsedResult){
	var currentClass = '';
	var html = '';
	var gradeTotal = 0;
	var gradeCount = 0;
	var grade = 0;
	
	for(var i = 0; i < parsedResult.length; i++){
		if(currentClass !== parsedResult[i].classnumber){
			currentClass = parsedResult[i].classnumber;
			// Build the trigger header for the class
			html +='<div class = "trigger"><span class="textPadding">+ ' + currentClass + ' - PLACEHOLDER%</span></div><div class = "toggle">';
			// Insert the grade into the toggle panel
			html += '<div class = "assignment"><span class="textPadding">' + parsedResult[i].title + ' - ' + parsedResult[i].score + '%</span></div>';
			gradeTotal += parseInt(parsedResult[i].score);
			gradeCount++;
		}
		else
		{
			// Insert the remaining grades into the toggle panel
			html += '<div class = "assignment"><span class="textPadding">' + parsedResult[i].title + ' - ' + parsedResult[i].score + '%</span></div>';
			gradeTotal += parseInt(parsedResult[i].score);
			gradeCount++;
		}
		
		if(i < parsedResult.length-1){
			if(currentClass !== parsedResult[i+1].classnumber){
				html +='</div>';
				// Calculate the overall class grade
				grade = (gradeTotal/gradeCount).toFixed(2);
				// Insert the grade into the html string
				html = html.replace("PLACEHOLDER", grade);
				// Reset the grade variables for the next class
				gradeTotal = 0;
				gradeCount = 0;
			}
		}
		else{
			html +='</div>';
			// Calculate the overall class grade
			grade = (gradeTotal/gradeCount).toFixed(2);
			// Insert the grade into the html string
			html = html.replace("PLACEHOLDER", grade);
		}
	}
	
	insertGrades(html);
}	

function insertGrades(html){
		$('#grades').html(html);
		bindHtmlElements();
}

function bindHtmlElements(){
	// Function for toggling the grade displays
	$(".trigger").click(function(){
    $(this).next(".toggle").slideToggle("medium");
  });
}
	