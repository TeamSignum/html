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
	$.ajax({
		async: true,
		type: 'POST',
		url: "profile.php",
		datatpye: "json",
		success: function(result){
			var parsedResult = JSON.parse(result);
			//alert(parsedResult);
			_userid = parsedResult[0].uid;
			_email = parsedResult[0].email;
			_firstName = parsedResult[0].firstname;
			_lastName = parsedResult[0].lastname;

			buildPage();
		}
		
			
	});
}

function buildPage(){
	$('#email').val(_email);
	$('#userid').val(_userid);
	$('#firstname').val(_firstName);
	$('#lastname').val(_lastName);
}

function editProfile(){
	//alert("hello");
	
}