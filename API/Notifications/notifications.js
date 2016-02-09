var userId = 1;

$(document).ready(function() {
	
	GetNotifications(1);

  	$("[data-toggle]").click(function() {
    	var toggle_el = $(this).data("toggle");
    	$(toggle_el).toggleClass("open-sidebar");
  	});
  
});


function GetNotifications(pid)
{

	$.ajax({
		async: true,
		type: 'POST',
		url: "../API/Notifications/notifications.php",
		dataType: 'json',
		data: {func: 1, pid: pid},
		success: function(results){
			var notification = '';
			for (var i = 0; i < results.length; i++){
				notification += '<li><a href="#">'+results[i]["score"]+'</a></li>';
			}
			$('#sidebar').html('<ul>'+notification+'</ul>');
		}
	});

	return false;
}
