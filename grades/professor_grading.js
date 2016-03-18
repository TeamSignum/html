/*           
 * Author: LearningUniverse                         
 * Created: February 1, 2016  
 *            
 * Javascript file for handling the interaction between                                                        
 * grades.html, grades.php to build the grade view.
 *          
 */ 

$( document ).ready(function() 
{
	getAssignments();
	
});

function getAssignments(parsedResult){
	$.ajax({
		async: true,
		type: 'POST',
		url: "professor_grading.php",
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			buildAssignmentGradingPage(parsedResult);
		}
	});
}

function buildAssignmentGradingPage(parsedResult){
	var html = '';

	// Build table header
	html+='<thead>';
	html+='<tr>';
	html+='<th>First Name</th>';
	html+='<th>Last Name</th>';
	html+='<th>Assignment Submission</th>';
	html+='<th>Turn In Date</th>';
	html+='<th>Grade</th>';
	html+='<th>Edit</th>';
	html+='</tr>';
	html+='</thead>';
	// DataTable tag
	html+='<tbody>';
	// Build the rows
	for(var i = 0; i < parsedResult.length; i++){
		html+='<tr>';
		html+='<td>'+parsedResult[i].firstname+'</td>';
		html+='<td>'+parsedResult[i].lastname+'</td>';
		
		if(parsedResult[i].file==null){
			html+='<td>No Submission</td>';
			html+='<td>N/A</td>';
		}
		else{
			html+='<td>Link to File</td>';
			html+='<td>'+parsedResult[i].tdate+'</td>';
		}

		if(parsedResult[i].grade==null){
			html+='<td>--</td>';
			html+='<td><button type="button">GRADE</td>';
		}
		else{
			html+='<td>'+parsedResult[i].grade+'</td>';
			html+='<td><button type="button">EDIT GRADE</td>';
		}
		
		html+='</tr>';
	}

	html+='</tbody>';
	
	insertTable(html);
}	

function insertTable(html){
		$('#assignments').html(html);
		initDataTable();
}

function initDataTable(){
	$('#assignments').DataTable( 
		{
			"order": [[ 1, 'asc' ]]
		}
	);
}
	