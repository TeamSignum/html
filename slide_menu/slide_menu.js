var role = '';


$(document).ready(function() {
	getRole();
  	$("[data-toggle]").click(function() {
  		var notification_type = document.getElementById('notification_type').value;
  		if (notification_type == '' ) { alert('missing keyword'); return }
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
				        studentAssignment(result);
				        break;
				    default:
				        alert('Incorrect Keyword');
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
	//alert(result);
	var notification = '';
	for (var i = 0; i < result.length; i++){
		notification += '<li><a href="#">New discussion is written by '
						+result[i]['firstname']+' in '
						+result[i]['classnumber']+ ' at '
						+result[i]['date_entered'] + '</a></li>';
	}
	$('#sidebar').html('<ul>'+notification+'</ul>');
}

function studentAssignment(result){
	alert(result);
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