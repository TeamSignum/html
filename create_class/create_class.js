// Variables and properties

$( document ).ready(function() 
{
	// This prevents the profileform from submitting and refreshing the page.
	$("#createForm").submit(function(e){
    	e.preventDefault();
  });
});

// Queries the database and stores class information in javascript variables
function createClass(){
	// Get the form information and create a FormData object
		var form = document.getElementById("createForm");
		var formData = new FormData(form);
	
	$.ajax({
		async: true,
		processData: false, // This must be false with FormData object
      	contentType: false, // This must be false with FormData object
		type: 'POST',
		url: "create_class.php",
		data: formData,
		success: function(result){
			//alert(result);
			window.location.href = "/student/student_main.html";
		}
	});
}

// Check if form information is in the appropriate format
function validateFormData(){
	return true;
}