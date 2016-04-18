
/* 
 * Author: Namgi Yoon
 * Date: February 11, 2016
 *
 */
$(document).ready(function() {

	getAllClasses();

	$("#add").click(function() {
		var ekeyVal = $('#ekey').val();
		var addclassVal = $('#allclass').val();
		
		enroll(ekeyVal, addclassVal);
  	});

	getMyClasses();

  	$('#delete').click(function(){
  		var deleteclassVal = $('#myclass').val();
  		deleteMyClass(deleteclassVal);
  	});
});

function getMyClasses(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "add_class.php",
		datatype: 'json',
		data: {'function': 'getMyClasses'},
		success: function(result){
			var myclasses = JSON.parse(result);			
			$('#myclass').html(insertClasses(myclasses));			
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});
}

function getAllClasses(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "add_class.php",
		datatype: 'json',
		data: {'function': 'getallclasses'},
		success: function(result){
			var classes = JSON.parse(result);			
			$('#allclass').html(insertClasses(classes));		
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});
}

function insertClasses(classes){
	var html = '';

	for(var i = 0 ; i <classes.length; i++){
		html += '<option value="'+classes[i].cid+'">'
								+classes[i].classnumber+'</option>'; 
	}

	return html;
}

function enroll(ekeyVal, addclassVal){
	$.ajax({
		async: true,
		type: 'POST',
		url: "add_class.php",
		datatype: 'json',
		data: {'function': 'enroll', 'ekey': ekeyVal, 'cid': addclassVal},
		success: function(results){	
			if(results == "error1"){
				$('#ekey').addClass('warning');
				$('#ekey-error').html("Enorllment key do not match");
			}else{
				window.location='../student/student.php';
			}
				
			
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});
}

function deleteMyClass(deleteclassVal){
	swal({   
		title: "Are you sure?",   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Yes",   
		cancelButtonText: "No",   
		closeOnConfirm: false,   
		closeOnCancel: false }, 
		function(isConfirm){   
			if (isConfirm) {
				swal("Completed", "The class has been unenrolled.", "success");
				$.ajax({
					async: true,
					type: 'POST',
					url: "add_class.php",
					datatype: 'json',
					data: {'function': 'deleteMyClass', 'cid': deleteclassVal},
					success: function(result){
						 window.location='../student/student.php';	
					},
					error:function(request,status,error){
			        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			       	}
				});
			} 
			else {     
				swal("Cancelled", "", "error");   
			} 
	});
}