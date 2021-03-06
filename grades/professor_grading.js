/*           
 * Author: LearningUniverse - Joseph Cottongim                        
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

	// Attach click functions once html has rendered.
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

// ESC key closes the grading popup
$(document).keyup(function(e) {
  	// Esc
  	if (e.keyCode == 27){
  		$("#custom_container").hide();
  		$("#dim_div").hide();
  	}
});

// Retrieves grade information from the database
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

// Submit grade to the database and update UI components
function submitGrade(){
	// Get form data
	var formData = $('#grade-form').serializeArray();
	// Add the gradeQuery
	formData.push({name:'gradeQuery', value:'submitGrade'});
	formData.push({name:'userid', value: currentStudent.userid});
	// Save the form info to update the display via jquery
	var tempGraderComments = $('#grader-comments').val();
	var tempGrade = $('#grade').val();
	
	$.ajax({
		async: true,
		type: 'POST',
		url: "professor_grading.php",
		data: formData,
		success: function(result){
			//alert(result);

			if(result=='Success'){
				// Update the row
				$('#'+currentStudent.userid+' td').eq(3).children("button").removeClass('ungraded');
				$('#'+currentStudent.userid+' td').eq(3).children("button").addClass('graded');
				$('#'+currentStudent.userid+' td').eq(3).children("button").html("EDIT");
				$('#'+currentStudent.userid+' td').eq(2).html(tempGrade);
				// Update the student gradeData object
				currentStudent.graderComments = tempGraderComments;
				currentStudent.grade = tempGrade;

				// Close the popup
				$("#custom_container").hide();
				$("#popup").html("");
				$("#canvas").show(); 
				$("#dim_div").hide();
			}
			else{
				alert("Grade was not submitted.  Please try again.");
			}
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

// Builds the grading table and gradeData POJOs
function buildAssignmentGradingPage(parsedResult){
	var html;

	// Build table header
	html=`	<thead>
			<tr>
				<th>First Name</th>
				<th>Last Name</th>
				<th>Grade</th>
				<th>Edit</th>
			</tr>
			</thead>
		`;
	// DataTable tag
	html+=`<tbody>`;
	// Build the gradeData POJOs then create the html
	for(var i = 0; i < parsedResult.length; i++){
		var userid = parsedResult[i].idusers;
		var firstName = parsedResult[i].firstname;
		var lastName = parsedResult[i].lastname;
		var cid = parsedResult[i].cid;
		var nid = parsedResult[i].nid;
		var nid2 = parsedResult[i].nid2;
		var tdate = parsedResult[i].tdate;

		var file;
		if(parsedResult[i].file==null){
			file = "No Submission";
		}
		else{
			file = parsedResult[i].file;
		}

		var grade;
		if(parsedResult[i].grade==null){
			grade = 0;
		}
		else{
			grade = parseFloat(parsedResult[i].grade);
		}
		var studentComments;
		if(parsedResult[i].student_comments != null){
			studentComments = parsedResult[i].student_comments;
		}
		else{
			studentComments = 'N/A';
		}

		var graderComments;
		if(parsedResult[i].grader_comments != null){
			graderComments = parsedResult[i].grader_comments;
		}
		else{
			graderComments = "";
		}
		
		var tempGradeData = new gradeData(userid, firstName, lastName, cid, nid, nid2, tdate, file, grade, studentComments, graderComments);
		gradeDataArray[userid] = tempGradeData;

		html+=`<tr id="`+userid+`">`;
		
		html+=`<td>`+firstName+`</td>`;
		html+=`<td>`+lastName+`</td>`;
		
		if(grade==0){
			html+=`<td>`+grade+`</td>`;
			html+=`<td><button type="button" class='ungraded'onclick="createGradeForm(`+userid+`)">GRADE</td>`;
		}
		else{
			html+=`<td>`+grade+`</td>`;
			html+=`<td><button type="button" class='graded'onclick="createGradeForm(`+userid+`)">EDIT</td>`;
		}
		
		html+=`</tr>`;
	}

	html+=`</tbody>`;
	
	insertTable(html);
}	

// Puts the gradeTable html into the appropriate div
function insertTable(html){
	$('#assignments').html(html);
	initDataTable();
}

// DataTables initialization
function initDataTable(){
	$('#assignments').DataTable( 
		{
			"order": [[ 1, 'asc' ]]
		}
	);
}

// Generates and shows the popup for grading
function createGradeForm(userid){
	// Get the gradeData object for the userid selected
	currentStudent = gradeDataArray[userid];
		
	// Build the popup
	var innerHtml;

	var assignmentSubmission;
	if(currentStudent.file == "No Submission"){
		assignmentSubmission = `<input class="input-field" value="No Assignment Submitted" disabled>`;
	}
	else{
		assignmentSubmission = `<object id="assignment-submission" data="`+currentStudent.file+`" type="application/pdf" width="70%" height="500px">
								 `+currentStudent.file+`
								 </object>`;
	}

	// Popup details
	innerHtml = `
	<div>
		<div class="form-style-2" style="width: 90%;">
			<div class="form-style-2-heading" style="width: 110%;">Assignment: Assignment 1 &nbsp&nbsp&nbsp&nbsp 
			Student: `+currentStudent.firstName+` `+currentStudent.lastName+`</div>
			<label for="assignment-submission" style="margin-left: 13%;">
				<span>Assignment Submission</span>
				`+assignmentSubmission+`
			</label>
			<label for="student-comments" style="margin-left: 13%;">
				<span>Student Comments</span>
				<textarea name="student-comments" id="student-comments" class="textarea-field" readonly>`+currentStudent.studentComments+`</textarea>
			</label>

			<form style="margin-left: 13%;" id="grade-form">
				<label for="grader-comments">
					<span>Grader Comments</span>
					<textarea name="grader-comments" id="grader-comments" class="textarea-field" type="text">`+currentStudent.graderComments+`</textarea>
				</label>
				<label for="grade">
					<span>Grade</span>
					<input class="input-field" id="grade" name="grade" type="number" value="`+currentStudent.grade+`" required>
				</label>
			</form>
		</div>
	</div>
	`;

	// Show the popup
	$('#popup').html(innerHtml);
	$('#dim_div').show();
	$('#custom_container').show();
}
	