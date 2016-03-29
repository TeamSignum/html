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

    	 	//namgi
	  	$("#sendMessage").click(function(){ 
	  		sendMessage();
	  		
	  	});
  	});
});

function sendMessage(){
	$.ajax({
        type: "POST",
        url: "../slide_menu/send_message.php",
        dataType: "html",
        data: {'classid': $('#selectedClass').val(), 'message': $('#message').val()},
        success: function(result) {
          //$("#result").html(result);
          alert("Send the message");
          $('#message').test("haha");
        },
        error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
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
	var html = '<select id="selectedClass">';
	for(var i = 0 ; i <classes.length; i++){
		html += '<option value="'+classes[i].cid+'">'
								+classes[i].classnumber+'</option>'; 
	}

	html+='</select><input type="text" id="message" name="message"> <input type="button" value="Send" id="sendMessage" name="sendMessage">';

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
		        studentProfMessage(result[3]);
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

function studentProfMessage(result){
var notification = '';
	for (var i = 0; i < result.length; i++){
		counter += 1;
		notification += '<li><a href="../grades/">'
						+result[i]['author_name']+' in '
						+result[i]['class_number']+' send \''
						+result[i]['message']+'\' at '
						+result[i]['send_date']+'</a></li>';
	}
	$('#message').html('<ul>'+notification+'</ul>');
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