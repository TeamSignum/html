var role = '';
var counter = 0;

$(document).ready(function() {
	getRole();
	getNotifications();
  	$("[data-toggle]").click(function() {  		
  	   	var toggle_el = $(this).data("toggle");
    	$(toggle_el).toggleClass("open");
    	counter = 0;
  	});

  	$('#messageImg').click( function(){
  		if(role == "professor"){
	  		var classList = getProfClass();
	  		swal({
	  			title: "Send A Message",
	  			html: true,
	  			text: classList,
	  			showCancelButton: true,
	  			confirmButtonText: "Send",
				closeOnConfirm: false,
				allowOutsideClick: false
	  		}, function(isConfirm){
	  			if(isConfirm == true){
	  				//real_time_notification();
		  			sendMessage();
		  			swal("Send This Message", "Your students will be notified", "success");
		  		}else{
		  			//classList = '';
		  		}
		  	});
  		}else if(role == "student"){
  			var classList = getStuClass();
	  		swal({
	  			title: "Send A Message",
	  			html: true,
	  			text: classList,
	  			showCancelButton: true,
	  			confirmButtonText: "Send",
				closeOnConfirm: false,
				allowOutsideClick: false
	  		}, function(isConfirm){
	  			if(isConfirm == true){
	  				//real_time_notification();
		  			sendMessage();
		  			swal("Send This Message", "Professor will be notified", "success");
		  		}else{
		  			//classList = '';
		  		}

		  	});
  		}

  	});
  	
  
});

function real_time_notification() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
        var options = {
                body: "This is the notification",
                icon: "icon.jpg",
                dir : "ltr"
             };
          var notification = new Notification("Hi there",options);
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
    
      if (permission === "granted") {
        var options = {
              body: "This is the body of the notification",
              icon: "icon.jpg",
              dir : "ltr"
          };
        var notification = new Notification("Hi there",options);
      }
    });
  }
}

function sendMessage(){
	$.ajax({
        type: "GET",
        url: "../slide_menu/send_message.php",
        dataType: "html",
        data: {'classid': $('#selectedClass').val(), 'message': $('#mid').val()},
        success: function(result) {
			alert(result);
        },
        error:function(request,status,error){
        	//alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
    });
}

function getStuClass(){
	var stuClass;
	$.ajax({
		async: false,
		type: 'POST',
		url: "../slide_menu/slide_menu.php",
		dataType: 'json',
		data:{'function': 'getStuClass'},
		success: function (result){
			stuClass = setClasses(result);
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});

	return stuClass;
}

function getProfClass(){
	var profClass;
	$.ajax({
		async: false,
		type: 'POST',
		url: "../slide_menu/slide_menu.php",
		dataType: 'json',
		data:{'function': 'getProfClass'},
		success: function (result){
			profClass = setClasses(result);
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});

	return profClass;
}

function setClasses(classes){
	var html = '<select id="selectedClass">';
	for(var i = 0 ; i <classes.length; i++){
		html += '<option value="'+classes[i].cid+'">'
								+classes[i].classnumber+'</option>'; 
	}

	html+='</select><br><br><textarea id="mid" name="message" cols="30" rows="5" style="width:630; height:200px;" placeholder="write a message"></textarea>';

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
				getStuClass();
				//hideMessageButton();
				studentGrade(result[0]);				     
		        studentDiscussion(result[1]);				       
		        studentAssignmentNQuiz(result[2]);
		        studentProfMessage(result[3]);
		        $('#notification').html(counter);
			}else if(role == 'professor'){
				getProfClass();
				//showMessageButton();
				professorNotification(result[0]);
				$('#notification').html(counter);
			}
		},
		error:function(request,status,error){
        	alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       	}
	});

	return false;
}
// function hideMessageButton(){
// 	$('#messageImg').hide();
// }
// function showMessageButton(){
// 	$('#messageImg').show();	
// }

function studentDiscussion(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		counter += 1;
		notification += '<li><a href="#">New discussion: "'
						+result[i]['content']+'" by '
						+result[i]['firstname']+' in '
						+result[i]['classnumber']+ '</a></li>';
	}
	$('#discussion').html('<ul>'+notification+'</ul>');
}

function studentAssignmentNQuiz(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		counter += 1;
		notification += '<li><a href="#">New Assignment: "'
						+result[i]['title']+'" in '
						+result[i]['classnumber']+' Due on '
						+result[i]['duedate']+ '</a></li>';
	}
	$('#assignment').html('<ul>'+notification+'</ul>');
}

function studentGrade(result){
	var notification = '';
	for (var i = 0; i < result.length; i++){
		counter += 1;
		notification += '<li><a href="../grades/grades.html">The Score of '
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
		notification += '<li><a href="#">'
						+result[i]['author_name']+' in '
						+result[i]['class_number']+' sent \''
						+result[i]['message']+'\'</a></li>';
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
	// var notification = '';
	// for (var i = 0; i < result.length; i++){
	// 	notification += '<li><a href="#">your students number is '+result[i]['students']+'</a></li>';
	// }
	// $('#sidebar').html('<ul>'+notification+'</ul>');
	var notification = '';
	for (var i = 0; i < result.length; i++){
		counter += 1;
		notification += '<li><a href="#">'
						+result[i]['author_name']+' in '
						+result[i]['class_number']+' sent \''
						+result[i]['message']+'\'</a></li>';
	}
	$('#sidebar').html('<ul>'+notification+'</ul>');
}