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
	
});

function getClasses(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "add_class.php",
		data: {'function': 'getClasses'}, // Query number for obtaining all grades
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);

			
		}
	});
}

function buildDisplayPage(parsedResult){
	
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