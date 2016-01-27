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
	
	// This prevents the profileform from submitting and refreshing the page.
	$("#profileForm").submit(function(e){
    e.preventDefault();
  });
});

// Queries the database and stores profile information in javascript variables
function getProfileData(){
	"use strict";
	$.ajax({
		async: true,
		type: 'POST',
		url: "getProfile.php",
		datatpye: "json",
		success: function(result){
			var parsedResult = JSON.parse(result);
			//alert(result);
			_userid = parsedResult[0].uid;
			_email = parsedResult[0].email;
			_firstName = parsedResult[0].firstname;
			_lastName = parsedResult[0].lastname;
			if(parsedResult[0].profilepic === null){
				_profileimage = "default.jpg";
			}
			else{
				_profileimage=parsedResult[0].profilepic;
			}

			profileView();
		}
	});
}

// Submits profile information to the database
function submitProfileChanges(){
	"use strict";
	if(validateFormData)
	{
		// Get the form information and create a FormData object
		var form = document.getElementById("profileForm");
		var formData = new FormData(form);
		
		//insert into database, handle any submission errors.
		$.ajax({
			async: false,
			processData: false, // This must be false with FormData object
      contentType: false, // This must be false with FormData object
			type: 'POST',
			url: "saveProfile.php",
			data: formData,
			success: function(result){
				//alert(result);
				
				// Reload the profileForm to get the new data
				getProfileData();
			}
		});
			
	}
	else
	{
		alert("invalid data");
	}
}

// Check if form information is in the appropriate format
function validateFormData(){
	return true;
}

// Displays the profile information in a non-editable format
// *****TODO: Move element tags to the html file, and only use JS to change the contents*****
function profileView(){
	$('#profileForm').html('<div class="col-md-4"></div>\
					<div class="col-md-4">\
				<label for="email">Email address</label>\
						<input type="email" name="email" class="form-control" id="email" value="' + _email + '" disabled>\
				<label for="userid">User ID</label>\
						<input type="text" name="userid" class="form-control" id="userid" value="' + _userid + '" disabled>\
				<label for="firstname">First Name</label>\
						<input type="text" name="firstname" class="form-control" id="firstname" value="' + _firstName + '" disabled>\
				<label for="lastname">Last Name</label>\
						<input type="text" name="lastname" class="form-control" id="lastname" value="' + _lastName + '" disabled>\
						<br/>\
				<label for="picture">Profile Picture</label>\
				<br>\
					<img src="../profile_images/' + _profileimage + '">\
					<br><br>\
					<p id="buttonRegion">\
								<button onclick="profileEdit()" class="btn btn-primary btn-lg btn-block">Edit Profile</button>\
						</p>\
				</div>\
				<div class="col-md-4"></div>	');
}

// Displays the profile information in and editable format
// *****TODO: Move element tags to the html file, and only use JS to change the contents*****
function profileEdit(){
$('#profileForm').html('<div class="col-md-4"></div>\
	      <div class="col-md-4">\
		  <label for="email">Email address</label>\
          <input type="email" name="email" class="form-control" id="email" value="' + _email + '">\
		  <label for="userid">User ID</label>\
          <input type="text" name="userid" class="form-control" id="userid" value="' + _userid + '" >\
		  <label for="firstname">First Name</label>\
          <input type="text" name="firstname" class="form-control" id="firstname" value="' + _firstName + '" >\
		  <label for="lastname">Last Name</label>\
          <input type="text" name="lastname" class="form-control" id="lastname" value="' + _lastName + '" >\
          <br>\
			<label for="picture">Profile Picture <input type="file" name="imageToUpload" id="imageToUpload" accept="image/*"></label>\
					<img src="../profile_images/' + _profileimage + '" id="profilepic">\
					<br><br>\
	  	  <p id="buttonRegion">\
          		<button onclick="submitProfileChanges()" class="btn btn-primary btn-lg btn-block">Submit Changes</button>\
          </p>\
		  </div>\
      <div class="col-md-4"></div>	');
}