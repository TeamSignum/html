var userId = 1;

$(document).ready(function() {
	
	GetNotifications(1);

  	$("[data-toggle]").click(function() {
    	var toggle_el = $(this).data("toggle");
    	$(toggle_el).toggleClass("open-sidebar");
  	});
  
});
