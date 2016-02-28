var role = '';

$(document).ready(function() {
	getRole();
  	$("[data-toggle]").click(function() {
  		getNotifications();
  	   	var toggle_el = $(this).data("toggle");
    	$(toggle_el).toggleClass("open");
    	//$("#dim_div").show();
  	});
});


function getRole(){
	$path = 
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
				studentGrade(result);				     
		        //studentDiscussion(result);				       
		        //studentAssignmentNQuiz(result);
				//studentNotification(result);
				//studentGrade(result);
				//studentDiscussion(result);
			}else if(role == 'professor'){
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
		notification += '<li><a href="../class_view/class_view.html">New discussion: "'
						+result[i]['content']+'" is written by '
						+result[i]['firstname']+' in '
						+result[i]['classnumber']+ ' at '
						+result[i]['date_entered'] + '</a></li>';
	}
	$('#sidebar').html('<ul>'+notification+'</ul>');
}

function studentAssignmentNQuiz(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		notification += '<li><a href="#">New Assignment: "'
						+result[i]['title']+'" in '
						+result[i]['classnumber']+' Due to '
						+result[i]['duedate']+ '</a></li>';
	}
	$('#sidebar').html('<ul>'+notification+'</ul>');
}

function studentGrade(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		notification += '<li><a href="../grades/grades.html">The Score of '
						+result[i]['title']+' in '
						+result[i]['classnumber']+' has been posted at '
						+result[i]['date_entered']+'</a></li>';
	}
	$('#sidebar').html('<ul>'+notification+'</ul>');
}

function studentNotification(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		notification += '<li><a href="../grades/grade_charts.html">Your grade is '+result[i]['score']+'</a></li>';
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