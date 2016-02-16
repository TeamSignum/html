// Notification object
var notifications = []; 

/*
 * GetNotifications
 * Populates var notifications with notifications objects. 
 * 		- A notificaiton object contains the score for grades. 
 * 
 * Pseudo Code: 
 * foreach notifcation in notifications
 * 		set innerhtm = notification.score
 *
 * @param: pid = person id (get from session)
 */
function GetNotifications(pid)
{

	$.ajax({
		async: true,
		type: 'POST',
		url: "../API/Notifications/notifications.php",
		dataType: 'json',
		data: {pid: pid},
		success: function(results){
			var notification = '';
			for (var i = 0; i < results.length; i++){
				notification += '<li><a href="#">Your grade is '+results[i]["score"]+'</a></li>';
			}
			$('#sidebar').html('<ul>'+notification+'</ul>');
		}
	});

	return false;
}
