var role = '';


$(document).ready(function() {
	getRole();
  	$("[data-toggle]").click(function() {
  		var notification_type = document.getElementById('notification_type').value;
  		if (notification_type != '1' && notification_type != '2' && notification_type != '3' ) { 
  			alert('missing keyword or wrong keyword');
  			alert('please types "1" for grade or "2" for discussion or "3" for Assignment ');
  			return 
  		}
  		getNotifications(notification_type);
  	   	var toggle_el = $(this).data("toggle");
    	$(toggle_el).toggleClass("open-sidebar");
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

function getNotifications(notification_type)
{
	$.ajax({
		async: true,
		type: 'POST',
		url: "../slide_menu/slide_menu.php",
		dataType: 'json',
		data: {'function': 'getNotifications', 'notype': notification_type},
		success: function(result){
			if(role == "student"){
				switch(notification_type) {
				    case '1':
				        studentGrade(result);
				        break;
				    case '2':
				        studentDiscussion(result);
				        break;
			        case '3':
				        studentAssignmentNQuiz(result);
				        break;
				    default:
				        alert('error:Incorrect Keyword please types "1" for grade or "2" for discussion or "3" for Assignment ');
				        break;
				}
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