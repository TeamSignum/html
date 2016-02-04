var notifications = []; 

function GetNotifications(pid)
{
	$.ajax({
		async: true,
		type: 'POST',
		url: "../API/Notifications/notifications.php",
		dataType: 'json',
		data: {func: 1, pid: pid},
		success: function(results){
			for (var i = 0; i < results.length; i++){
				var notification = {
					score: results[i]["score"]
				};
				notifications.push(notification);
			}
		}
	});

	return false;
}