/*           
 * Author: Joseph Cottongim                         
 * Date: February 1, 2016                                                        
 *            
 * Javascript file for handling the interaction between                                                        
 * grades.html, grades.php, and the database for the 
 * Learning Universe website.
 *          
 */  
 
$( document ).ready(function() 
{
	// Function for toggling the grade displays (NEEDS TO BE IN DOCUMENT.READY OR IT WON'T BIND)
	$(".trigger").click(function(){
    $(this).next(".toggle").slideToggle("slow");
  });
	
	//getGrades();
	//insertGrades();
});

function getGrades(){
	"use strict";
	$.ajax({
		async: true,
		type: 'POST',
		url: "grades.php",
		datatpye: "json",
		success: function(result){
			//var parsedResult = JSON.parse(result);
			//alert(result);
		}
	});
}



function insertGrades(){
		//$('#gradeContainer').html('');
}
	
function buildDisplayPage(){
}	