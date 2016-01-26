// Variables and properties
var _email;
var _firstName;
var _lastName;
var _description;
var _userid;


$( document ).ready(function() 
{
	getProfileData();
});

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

			profileView();
		}
	});
}

function submitProfileChanges(){
	if(validateFormData)
	{
		//insert into database, handle any submission errors.
		$.ajax({
			async: false,
			type: 'POST',
			url: "saveProfile.php",
			data: $('#profileContainer').serialize(),
			success: function(result){
				getProfileData();
			}
		});
			
	}
	else
	{
		alert("invalid data");
	}
	
	
}



function validateFormData(){
	return true;
}

function profileView(){
	$('#profileContainer').html('<div class="col-md-4"></div>\
					<div class="col-md-4">\
				<label for="email">Email address</label>\
						<input type="email" name="email" class="form-control" id="email" value="' + _email + '" disabled>\
				<label for="userid">User ID</label>\
						<input type="text" name="userid" class="form-control" id="userid" value="' + _userid + '" disabled>\
				<label for="firstname">First Name</label>\
						<input type="text" name="firstname" class="form-control" id="firstname" value="' + _firstName + '" disabled>\
				<label for="lastname">Last Name</label>\
						<input type="text" name="lastname" class="form-control" id="lastname" value="' + _lastName + '" disabled>\
						<br>\
					<p id="buttonRegion">\
								<button onclick="profileEdit()" class="btn btn-primary btn-lg btn-block">Edit Profile</button>\
						</p>\
				</div>\
				<div class="col-md-4"></div>	');
}

function profileEdit(){
	
$('#profileContainer').html('<div class="col-md-4"></div>\
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
	  	  <p id="buttonRegion">\
          		<button onclick="submitProfileChanges()" class="btn btn-primary btn-lg btn-block">Submit Changes</button>\
          </p>\
		  </div>\
      <div class="col-md-4"></div>	');
}