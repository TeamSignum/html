/*           
 * Author: LearningUniverse - Joseph Cottongim, Edited by Namgi Yoon                      
 * Created: February 1, 2016  
 *            
 * Javascript file for handling the interaction between                                                        
 * grades.html, grades.php to build the grade view.
 *          
 */ 

// Variables and properties
var _email;
var _firstName;
var _lastName;
var _description;
var _userid;
var _profileimage;


$( document ).ready(function() 
{
	getProfileData();

	// Prevent default action of forms submitting
	$('#pf-form').submit(function(e){
		//alert("0");
    	e.preventDefault();
    	ProfileChange();
    	//window.location = "../student/student_main.html";
    });

	
	//emailDefaultView();
	//userIdDefaultView();
	//nameDefaultView();
	//pictureDefaultView();

	
});

// Queries the database and stores profile information in javascript variables
function getProfileData(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "getProfile.php",
		datatpye: "json",
		success: function(result){
			//alert(result);
			// Parse query results into variables
			var parsedResult = JSON.parse(result);
			_userid = parsedResult[0].uid;
			_email = parsedResult[0].email;
			_firstName = parsedResult[0].firstname;
			_lastName = parsedResult[0].lastname;

			if(parsedResult[0].profilepic === null){
				_profileimage = "../profile_images/default.jpg";
			}
			else{
				_profileimage=parsedResult[0].profilepic;
				//alert(_profileimage);
			}

			// Place actual variables into the html fields
			$('#email').val(_email);
			$('#userid').val(_userid);
			$('#firstname').val(_firstName);
			$('#lastname').val(_lastName);
			$('#profileimage').attr('src', _profileimage);
			
			// Code to setup a listener on the image to allow previews
			$('#imageToUpload').change(function(event){
				var tmppath = URL.createObjectURL(event.target.files[0]);
				$('#profileimage').attr('src', tmppath);
			});
		}
	});
}

// Logic for individual profile forms

// Updates Email
function submitEmailChange(){
	// Use html5 validation
	if($('#email')[0].checkValidity())
	{
		// Get the form information and create a FormData object
		var form = $('#email-form')[0];
		var formData = new FormData(form);
		
		// Disable buttons while the update is taking place
		$('#edit-email-button').prop('disabled',true);
		$('#cancel-edit-email-button').prop('disabled',true);

		// Append information to tell php what function to run
		formData.append("queryType", 'updateEmail');
					
		//insert into database, handle any submission errors.
		$.ajax({
			async: true,
			processData: false, // This must be false with FormData object
	    	contentType: false, // This must be false with FormData object
			type: 'POST',
			url: "editProfile.php",
			data: formData,
			success: function(result){
				//alert(result);				
				if(result==''){
					// successful update, activate fields
					_email=$('#email').val();
					$('#edit-email-button').prop('disabled',false);
					$('#cancel-edit-email-button').prop('disabled',false);
					emailDefaultView();

				}
				else if(result=='Email address already taken.'){
					alert("Email already in use.");
					$('#edit-email-button').prop('disabled',false);
					$('#cancel-edit-email-button').prop('disabled',false);
					emailEditView();
				}
				else{
					alert(result);
				}
			}
		});
	}
}

// Updates User ID
function submitUserIdChange(){
	// Use html5 validation
	if($('#userid')[0].checkValidity())
	{
		// Get the form information and create a FormData object
		var form = $('#userid-form')[0];
		var formData = new FormData(form);

		// Get the form information and create a FormData object
		var form = document.getElementById("userid-form");
		var formData = new FormData(form);
		// Append information to tell php what function to run
		formData.append("queryType", 'updateUserId');
			
		//insert into database, handle any submission errors.
		$.ajax({
			async: true,
			processData: false, // This must be false with FormData object
	    	contentType: false, // This must be false with FormData object
			type: 'POST',
			url: "editProfile.php",
			data: formData,
			success: function(result){
				//alert(result);				
				if(result==''){
					// successful update, activate fields
					_userid=$('#userid').val();
					$('#edit-userid-button').prop('disabled',false);
					$('#cancel-edit-userid-button').prop('disabled',false);
					userIdDefaultView();

				}
				else if(result=='User ID already taken.'){
					alert("User ID already in use.");
					$('#edit-userid-button').prop('disabled',false);
					$('#cancel-edit-userid-button').prop('disabled',false);
					userIdEditView();
				}
				else{
					alert(result);
				}
			}
		});
	}
}

// Updates Name
function submitNameChange(){
	// Use html5 validation
	if($('#firstname')[0].checkValidity() && $('#lastname')[0].checkValidity())
	{
		// Get the form information and create a FormData object
		var form = document.getElementById("name-form");
		var formData = new FormData(form);
		// Append information to tell php what function to run
		formData.append("queryType", 'updateName');

		// Disable buttons while the update is taking place
		$('#edit-name-button').prop('disabled',true);
		$('#cancel-edit-name-button').prop('disabled',true);

		//insert into database, handle any submission errors.
		$.ajax({
			async: true,
			processData: false, // This must be false with FormData object
	    	contentType: false, // This must be false with FormData object
			type: 'POST',
			url: "editProfile.php",
			data: formData,
			success: function(result){
				//alert(result);
				if(result==''){
					// successful update, activate fields
					_firstName=$('#firstname').val();
					_lastName=$('#lastname').val();
					$('#edit-name-button').prop('disabled',false);
					$('#cancel-edit-name-button').prop('disabled',false);
					nameDefaultView();

				}
				else{
					alert(result);
					$('#edit-name-button').prop('disabled',false);
					$('#cancel-edit-name-button').prop('disabled',false);
					nameEditView();
				}
			}
		});
	}
}

// Updates profile
function ProfileChange(){
	// Check if a file was chosen
	if($('#imageToUpload').val()==''){
		//pictureDefaultView();
		alert("NO Profile Img");
	}
	else{
		// Get the form information and create a FormData object
		var form = $('#pf-form')[0];
		var formData = new FormData(form);
		
		//insert into database, handle any submission errors.
		$.ajax({
			async: true,
			processData: false, // This must be false with FormData object
	    	contentType: false, // This must be false with FormData object
			type: 'POST',
			url: "editProfile.php",
			data: formData,
			success: function(result){
				//alert(result);
				if(result.indexOf("../profile_images/") !=-1){
					//alert(result.substring(result.indexOf(" ")+1));
					_profileimage=result;
					window.location = "../student/student_main.html";
				}
				else{
					alert('File could not be uploaded.  Please try again.');
				}
			}
		});
	}
}