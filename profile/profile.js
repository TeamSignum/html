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
	$('form').submit(function(e){
    	e.preventDefault();
    });

	emailDefaultView();
	userIdDefaultView();
	nameDefaultView();
	pictureDefaultView();
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
				_profileimage="../profile_images/" + parsedResult[0].profilepic;
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
function emailDefaultView(){
	// Set up 'CHANGE' button

	$('#edit-email-button').off().on('click', emailEditView);
	$('#edit-email-button').attr('class', 'btn btn-primary btn-sm');
	$('#edit-email-button').text('CHANGE');
	// Set up 'CANCEL' button
	$('#cancel-edit-email-button').attr('class', 'btn btn-danger btn-sm');
	$('#cancel-edit-email-button').hide();
	$('#cancel-edit-email-button').off().on('click', emailDefaultView);
	$('#email').val(_email);
	// Disable email input field
	$('#email').prop('disabled',true);
}

function emailEditView(){
	// Update "CHANGE' button
	$('#edit-email-button').off().on('click', submitEmailChange);
	$('#edit-email-button').attr('class', 'btn btn-success btn-sm');
	$('#edit-email-button').text('SUBMIT');
	// Display 'CANCEL' button
	$('#cancel-edit-email-button').show();
	// Enable email input field
	$('#email').prop('disabled',false);
	
	turnOffOtherEditFields($('#edit-email-button'));
}

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


function userIdDefaultView(){
	// Set up 'CHANGE' button
	$('#edit-userid-button').off().on('click', userIdEditView);
	$('#edit-userid-button').attr('class', 'btn btn-primary btn-sm');
	$('#edit-userid-button').text('CHANGE');
	// Set up 'CANCEL' button
	$('#cancel-edit-userid-button').attr('class', 'btn btn-danger btn-sm');
	$('#cancel-edit-userid-button').hide();
	$('#cancel-edit-userid-button').off().on('click', userIdDefaultView);
	$('#userid').val(_userid);
	// Disable userid input field
	$('#userid').prop('disabled',true);
}

function userIdEditView(){
	// Update "CHANGE' button
	$('#edit-userid-button').off().on('click', submitUserIdChange);
	$('#edit-userid-button').attr('class', 'btn btn-success btn-sm');
	$('#edit-userid-button').text('SUBMIT');
	// Display 'CANCEL' button
	$('#cancel-edit-userid-button').show();
	// Enable userid input field
	$('#userid').prop('disabled',false);
	
	turnOffOtherEditFields($('#edit-userid-button'));
}

function submitUserIdChange(){
	// Use html5 validation
	if($('#userid')[0].checkValidity())
	{
		// Get the form information and create a FormData object
		var form = $('#userid-form')[0];
		var formData = new FormData(form);
		
		// Disable buttons while the update is taking place
		$('#edit-userid-button').prop('disabled',true);
		$('#cancel-edit-userid-button').prop('disabled',true);

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

function nameDefaultView(){
	// Set up 'CHANGE' button
	$('#edit-name-button').off().on('click', nameEditView);
	$('#edit-name-button').attr('class', 'btn btn-primary btn-sm');
	$('#edit-name-button').text('CHANGE');
	// Set up 'CANCEL' button
	$('#cancel-edit-name-button').attr('class', 'btn btn-danger btn-sm');
	$('#cancel-edit-name-button').hide();
	$('#cancel-edit-name-button').off().on('click', nameDefaultView);
	$('#firstname').val(_firstName);
	$('#lastname').val(_lastName);
	// Disable userid input field
	$('#firstname').prop('disabled',true);
	$('#lastname').prop('disabled',true);
}

function nameEditView(){
	// Update "CHANGE' button
	$('#edit-name-button').off().on('click', submitNameChange);
	$('#edit-name-button').attr('class', 'btn btn-success btn-sm');
	$('#edit-name-button').text('SUBMIT');
	// Display 'CANCEL' button
	$('#cancel-edit-name-button').show();
	// Enable userid input field
	$('#firstname').prop('disabled',false);
	$('#lastname').prop('disabled',false);
	
	turnOffOtherEditFields($('#edit-name-button'));
}

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

function pictureDefaultView(){
	// Set up 'CHANGE' button
	$('#edit-picture-button').show();
	$('#edit-picture-button').off().on('click', pictureEditView);
	$('#edit-picture-button').attr('class', 'btn btn-primary btn-sm');
	$('#edit-picture-button').text('CHANGE');
	// Set up 'CANCEL' button
	$('#cancel-edit-picture-button').attr('class', 'btn btn-danger btn-sm');
	$('#cancel-edit-picture-button').hide();
	$('#cancel-edit-picture-button').off().on('click', pictureDefaultView);
	$('#profileimage').attr('src', _profileimage);
	// Hide browse button
	$('#browse-picture').hide();
}

function pictureEditView(){
	// Update "CHANGE' button
	$('#edit-picture-button').off().on('click', submitPictureChange);
	$('#edit-picture-button').attr('class', 'btn btn-success btn-sm');
	$('#edit-picture-button').text('SUBMIT');
	// Display 'CANCEL' button
	$('#cancel-edit-picture-button').show();
	// Display browse button
	$('#browse-picture').show();
	
	turnOffOtherEditFields($('#edit-picture-button'));
}

function submitPictureChange(){
	// Check if a file was chosen
	if($('#imageToUpload').val()==''){
		pictureDefaultView();
	}
	else{
		// Get the form information and create a FormData object
		var form = $('#picture-form')[0];
		var formData = new FormData(form);
		// Append information to tell php what function to run
		formData.append("queryType", 'updatePicture');

		// Disable buttons while the update is taking place
		$('#edit-picture-button').prop('disabled',true);
		$('#cancel-edit-picture-button').prop('disabled',true);

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
				if(result.indexOf("Success: ") !=-1){
					//alert(result.substring(result.indexOf(" ")+1));
					_profileimage="../profile_images/" + result.substring(result.indexOf(" ")+1);
					$('#edit-picture-button').prop('disabled',false);
					$('#cancel-edit-picture-button').prop('disabled',false);
					
					pictureDefaultView();
				}
				else{
					alert('File could not be uploaded.  Please try again.');
					$('#edit-picture-button').prop('disabled',false);
					$('#cancel-edit-picture-button').prop('disabled',false);
					$('#profileimage').attr('src', _profileimage);
					pictureEditView();
				}
			}
		});
	}
}

function turnOffOtherEditFields(editButton){
	// var buttonArray = $('.edit-button');
	// for(var i = 0; i < buttonArray.length; i++){
	// 	alert(buttonArray[i].attr('id'));
	// }
}