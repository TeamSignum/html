/*
 *  Javascript file for navbar.  Builds navbar based on the user.
 *
 *
 *
 *
 */

$(document).ready(function() 
{
	//alert(document.title);
	getPHPSessionInfo();
});  

 // Gets SESSION info from PHP file
function getPHPSessionInfo(){
	$.ajax({
		async: true,
		type: 'POST',
		url: "../navbar/phpInfoGetter.php",
		datatpye: "json",
		data: {'GETINFO': 'SESSION'},
		success: function(result){
			//alert(result);
			var parsedResult = JSON.parse(result);
			//alert(parsedResult.role);
			evaluateSessionInfo(parsedResult);
		}
	});
}

function evaluateSessionInfo(parsedResult){
	var html='';

	// Navbar if user is not logged in
	if(parsedResult=="Login"){
		html+='<ul class="nav navbar-nav">';
		// Login link
		html+='<li>';
		html+='<a href="../login/login.html" style="margin-top: 12px; font-size:14pt;">Login</a>';
		html+='</li>';
		// Register link
		html+='<li>';
		html+='<a href="../registration/registration.html" style="margin-top: 12px; font-size:14pt;">Register</a>';
		html+='</li>';
		
		html+='</ul>';				
		
	}
	// Navbar if student is logged in
	else if(parsedResult.role=='student'){
		html+='<ul class="nav navbar-nav">';
		// Account home link
		html+='<li>';
		html+='<a href="../student/student_main.html" style="margin-top: 12px; font-size:14pt;">Account Home</a>';
		html+='</li>';

		// Logic for grades links
		// if(document.title=='student_main_page'){
		// 	html+='<li>';
		// 	html+='<a href="../grades/grade_charts.html" style="margin-top: 12px; font-size:14pt;">Grades</a>';
		// 	html+='</li>';
		// }
		//else 
		if(document.title=='Class View'){
			html+='<li>';
			html+='<a href="../grades/grades.html" style="margin-top: 12px; font-size:14pt;">Grades</a>';
			html+='</li>';
		}

		if(document.title=='Grades'){
			html+='<li>';
			html+='<a href="../class_view/class_view.html" style="margin-top: 12px; font-size:14pt;">Back to ' +
			parsedResult.className +'</a>';
			html+='</li>';
		}

		// Profile link
		html+='<li>';
		html+='<a href="../profile/profile.html" style="margin-top: 12px; font-size:14pt;">Profile</a>';
		html+='</li>';	
		// Logout link
		html+='<li>';
		html+='<a href="../logout.php" style="margin-top: 12px; font-size:14pt;">Logout</a>';
		html+='</li>';	

		html+='</ul>';	
		
	}
	// Navbar if professor is logged in and on account home page
	// **Currently contains all existing links for ease of testing other site features**
	else if(parsedResult.role=='professor'){
		html+='<ul class="nav navbar-nav">';
		// Account home link
		html+='<li>';
		html+='<a href="../student/student_main.html" style="margin-top: 12px; font-size:14pt;">Account Home</a>';
		html+='</li>';
		// All grades chart link
		// html+='<li>';
		// html+='<a href="/grades/grade_charts.html" style="margin-top: 12px; font-size:14pt;">Grades</a>';
		// html+='</li>';	
		// Profile link
		html+='<li>';
		html+='<a href="../profile/profile.html" style="margin-top: 12px; font-size:14pt;">Profile</a>';
		html+='</li>';
		// Class View link
		html+='<li>';
		html+='<a href="../class_view/class_view.html" style="margin-top: 12px; font-size:14pt;">Class View</a>';
		html+='</li>';	
		// Professor Class View
		html+='<li>';
		html+='<a href="../prof_class_view/prof_class_view.html" style="margin-top: 12px; font-size:14pt;">Professor Class View</a>';
		html+='</li>';	
		// Class Builder link
		html+='<li>';
		html+='<a href="../class_builder/class_builder.html" style="margin-top: 12px; font-size:14pt;">Class Builder</a>';
		html+='</li>';		
		// Logout link
		html+='<li>';
		html+='<a href="../logout.php" style="margin-top: 12px; font-size:14pt;">Logout</a>';
		html+='</li>';	

		html+='</ul>';	
		;
	}

	insertNavBarHtml(html);
}

function insertNavBarHtml(html){
	$('#navbarlinks').html(html);
}