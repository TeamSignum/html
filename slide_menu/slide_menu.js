var role = '';
var counter = 0;

$(document).ready(function() {
	getRole();
	getNotifications();
  	$("[data-toggle]").click(function() {  		
  	   	var toggle_el = $(this).data("toggle");
    	$(toggle_el).toggleClass("open");
    	//$("#dim_div").show();
    	counter = 0;
  	});

  	$("#send").click(function(){
  		sendMessage();
  	});
});

function sendMessage(){
	alert("Your message was sent successfully!");

	$.ajax({
        type: "POST",
        url: "addEntryAjaxPdo.php",
        dataType: "html",
        data: {
          message: $("#message").val()
        },

        success: function(result) {
          $("#result").html(result);
        }
    });
}

function getProfClass(){

	$.ajax({
		async: true,
		type: 'POST',
		url: "../slide_menu/slide_menu.php",
		dataType: 'json',
		data:{'function': 'getProfClass'},
		success: function (result){

			$('#feet').html(setFeet(result));	
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});
}

function setFeet(classes){
	var html = '';
	for(var i = 0 ; i <classes.length; i++){
		html += '<select><option value="'+classes[i].cid+'">'
								+classes[i].classnumber+'</option></select>'; 
	}

	html+='<input type="text" id="message" name="message"><input type="button" id="send" name="send" value="Send">';

	return html;
}

function getRole(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "../slide_menu/slide_menu.php",
		dataType: 'json',
		data:{'function': 'getRole'},
		success: function (result){
			role = result;
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});
}

function getNotifications()
{
	$.ajax({
		async: true,
		type: 'POST',
		url: "../slide_menu/slide_menu.php",
		dataType: 'json',
		data: {'function': 'getNotifications'},
		success: function(result){
			if(role == "student"){
				studentGrade(result[0]);				     
		        studentDiscussion(result[1]);				       
		        studentAssignmentNQuiz(result[2]);
		        $('#notification').html(counter);
			}else if(role == 'professor'){
				getProfClass();
				professorNotification(result);
			}
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});

	return false;
}

function studentDiscussion(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		counter += 1;
		notification += '<li><a href="#">New discussion: "'
						+result[i]['content']+'" is written by '
						+result[i]['firstname']+' in '
						+result[i]['classnumber']+ ' at '
						+result[i]['date_entered'] + '</a></li>';
	}
	$('#discussion').html('<ul>'+notification+'</ul>');
}

function studentAssignmentNQuiz(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		counter += 1;
		notification += '<li><a href="#">New Assignment: "'
						+result[i]['title']+'" in '
						+result[i]['classnumber']+' Due to '
						+result[i]['duedate']+ '</a></li>';
	}
	$('#assignment').html('<ul>'+notification+'</ul>');
}

function studentGrade(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		counter += 1;
		notification += '<li><a href="../grades/">The Score of '
						+result[i]['title']+' in '
						+result[i]['classnumber']+' has been posted at '
						+result[i]['date_entered']+'</a></li>';
	}
	$('#grade').html('<ul>'+notification+'</ul>');
}

function studentNotification(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		notification += '<li><a href="#">Your grade is '+result[i]['score']+'</a></li>';
	}
	$('#sidebar').html('<ul>'+notification+'</ul>');
}

function professorNotification(result){
	//todo something
	var notification = '';
	for (var i = 0; i < result.length; i++){
		notification += '<li><a href="#">your students number is '+result[i]['students']+'</a></li>';
	}
	$('#sidebar').html('<ul>'+notification+'</ul>');
}