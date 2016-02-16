var role = '';

$(document).ready(function() {
	getRole();
  	$("[data-toggle]").click(function() {
  		getNotifications();
  	   	var toggle_el = $(this).data("toggle");
    	$(toggle_el).toggleClass("open-sidebar");
  	});
});


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
				studentNotification(result);
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