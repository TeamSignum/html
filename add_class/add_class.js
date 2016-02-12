
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
});

function getAllClasses(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "add_class.php",
		datatype: 'json',
		data: {'function': 'getallclasses'},
		success: function(result){
			var classes = JSON.parse(result);
			insertClasses(classes);			
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
	$('#allclass').html(html);
}


function enroll(ekeyVal, addclassVal){
	$.ajax({
		async: true,
		type: 'POST',
		url: "add_class.php",
		datatype: 'json',
		data: {'function': 'enroll', 'ekey': ekeyVal, 'cid': addclassVal},
		success: function(results){
			//var test = JSON.parse(results);
			 window.location='../student/student.php';
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});
}
