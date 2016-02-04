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
			//alert(result);
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
			profileView();
			bindHtmlElements();
		}
	});
}

// Submits profile information to the database
function submitProfileChanges(){
	if(validateFormData)
	{
		// Get the form information and create a FormData object
		var form = document.getElementById("profileForm");
		var formData = new FormData(form);
		
		//insert into database, handle any submission errors.
		$.ajax({
			async: true,
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
function profileView(){
	// Make all fields disabled
	$('#email').prop('disabled', true);
	$('#userid').prop('disabled', true);
	$('#firstname').prop('disabled', true);
	$('#lastname').prop('disabled', true);
	// Hide picture file input
	$('#browsebutton').hide();
	// Place actual values in the fields
	$('#email').val(_email);
	$('#userid').val(_userid);
	$('#firstname').val(_firstName);
	$('#lastname').val(_lastName);
	$('#profileimage').attr('src', _profileimage);
	$('#buttonregion').html('<button onclick="profileEdit()" class="btn btn-primary btn-lg btn-block">Edit Profile</button>');
}

// Displays the profile information in and editable format
function profileEdit(){
	$('#email').prop('disabled', false);
	$('#userid').prop('disabled', false);
	$('#firstname').prop('disabled', false);
	$('#lastname').prop('disabled', false);
  $('#browsebutton').show();
	$('#buttonregion').html('<button onclick="submitProfileChanges()" class="btn btn-primary btn-lg btn-block">Submit Changes</button>');	
}

function bindHtmlElements(){
	$('#imageToUpload').change(function(event){
		var tmppath = URL.createObjectURL(event.target.files[0]);
		$('#profileimage').attr('src', tmppath);
	});
}

