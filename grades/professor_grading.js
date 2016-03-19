/*           
 * Author: LearningUniverse                         
 * Created: February 1, 2016  
 *            
 * Javascript file for handling the interaction between                                                        
 * grades.html, grades.php to build the grade view.
 *          
 */ 

// Array for storing gradeDate POJO's
var gradeDataArray = [];
// Global to hold the gradeData object for the student being graded
var currentStudent;

$( document ).ready(function() 
{

	$( "#p_Save" ).click(function() {
		submitGrade()
	});

	$( "#p_Cancel" ).click(function() {
		$("#custom_container").hide();
		$("#popup").html("");
		$("#canvas").show(); 
		$("#dim_div").hide();
	});

	getAssignments();
	
});

function getAssignments(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "professor_grading.php",
		data: {'gradeQuery': 'getAssignments'},
		datatpye: "json",
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			buildAssignmentGradingPage(parsedResult);
		}
	});
}

function submitGrade(){
	// Get form data
	var formData = $('#grade-form').serializeArray();
	// Add the gradeQuery
	formData.push({name:'gradeQuery', value:'submitGrade'});
	//alert(formData);

	$.ajax({
		async: true,
		type: 'POST',
		url: "professor_grading.php",
		data: formData,
		success: function(result){
			alert(result);
			$("#custom_container").hide();
			$("#popup").html("");
			$("#canvas").show(); 
			$("#dim_div").hide();
		}
	});
}

// POJO for storing the grade information to access in other functions without 
// the need to make another database call
function gradeData(userid, firstName, lastName, cid, nid, nid2, tdate, file, grade, studentComments, graderComments)
{
	this.userid = userid;
	this.firstName = firstName;
	this.lastName = lastName;
	this.cid = cid;
	this.nid = nid;
	this.nid2 = nid2;
	this.tdate = tdate;
	this.file = file;
	this.grade = grade;
	this.studentComments = studentComments;
	this.graderComments = graderComments;
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
	// Build the gradeData POJOs then create the html
	for(var i = 0; i < parsedResult.length; i++){
		var userid = parsedResult[i].idusers;
		var firstName = parsedResult[i].firstname;
		var lastName = parsedResult[i].lastname;
		var cid = parsedResult[i].cid;
		var nid = parsedResult[i].nid;
		var nid2 = parsedResult[i].nid2;
		var tdate = parsedResult[i].tdate;
		var file = parsedResult[i].file;
		var grade = parsedResult[i].grade;
		var studentComments;
		if(parsedResult[i].student_comments != null){
			studentComments = parsedResult[i].student_comments;
		}
		else{
			studentComments = 'N/A';
		}

		var graderComments = parsedResult[i].grader_comments;

		var tempGradeData = new gradeData(userid, firstName, lastName, cid, nid, nid2, tdate, file, grade, studentComments, graderComments);
		gradeDataArray[userid] = tempGradeData;

		// Check to set row color to show graded vs ungraded
		if(grade==null){
			html+='<tr id="'+userid+'" class="ungraded">';
		}
		else{
			html+='<tr id="'+userid+'" class="graded">';
		}
		
		html+='<td>'+firstName+'</td>';
		html+='<td>'+lastName+'</td>';
		
		if(file==null){
			html+='<td>No Submission</td>';
			html+='<td>N/A</td>';
		}
		else{
			html+='<td>Link to File</td>';
			html+='<td>'+tdate+'</td>';
		}

		if(grade==null){
			html+='<td>--</td>';
			html+='<td><button type="button" onclick="createGradeForm('+userid+')">GRADE</td>';
		}
		else{
			html+='<td>'+grade+'</td>';
			html+='<td><button type="button" onclick="createGradeForm('+userid+')">EDIT GRADE</td>';
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

function createGradeForm(userid){
	// Get the gradeData object for the userid selected
	currentStudent = gradeDataArray[userid];
	
	// Build the popup
	var innerHtml;

	// Popup details
	innerHtml = `
	<div>
		<div class="form-style-2" style="width: 90%;">
			<div class="form-style-2-heading" style="width: 110%;">Grading for student: `+currentStudent.firstName+`</div>
				
			<label for="assignment-submission">
				<span>Assignment Submission</span>
				<object id="assignment-submission" data="testPDF.pdf#page=1&zoom=75" type="application/pdf" width="100%" height="500px">
			 	 	<p>Alternative text - include a link <a href="myfile.pdf">to the PDF!</a></p>
				</object>
			</label>
			<label for="student-comments">
				<span>Student Comments</span></span>
				<textarea name="student-comments" id="student-comments" class="textarea-field" readonly>`+currentStudent.studentComments+`</textarea>
			</label>

			<form style="margin-left: 13%;" id="grade-form">
				<label for="grader-comments">
					<span>Grader Comments</span>
					<input class="textarea-field" id="grader-comments" name="grader-comments" type="text">
				</label>
				<label for="grade">
					<span>Grade</span>
					<input class="input-field" id="grade" name="grade" type="text" required>
				</label>
			</form>
		</div>
	</div>
	`;

	$('#popup').html(innerHtml);
	$('#dim_div').show();
	$('#custom_container').show();

	// setTimeout(function(){
 //  		$('#dim_div').hide();
 //  		$('#custom_container').hide();
	// }, 5000); 
	// if($('#'+userid+'').attr('class').includes('ungraded'))
	// {
	// 	$('#'+userid+'').removeClass('ungraded');
	// 	$('#'+userid+'').addClass('graded');
	// }
}
	