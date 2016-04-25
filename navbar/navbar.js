/*           
 * Author: LearningUniverse - Joseph Cottongim, Edited by Daniel Cushing                      
 * Created: February 1, 2016  
 *            
 * Javascript file for handling the interaction between                                                        
 * grades.html, grades.php to build the grade view.
 *          
 */ 

 var dropdownIsShown = false;

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

// Build navbar based on user and page that they are on
function evaluateSessionInfo(parsedResult){
	var html='';

	if(document.title=='Concept Builder'){
		html+='<li>';
		html+='<a href="../class_builder/class_builder.html" style="margin-top: 12px; font-size:14pt;"><i class="material-icons">arrow_back</i></a>';
		html+='</li>';	
	}
	else if(document.title=='Concept View'){
		html+='<li>';
		html+='<a href="../class_view/class_view.html" style="margin-top: 12px; font-size:14pt;"><i class="material-icons">arrow_back</i></a>';
		html+='</li>';	
	}

	else if(document.title=='Professor Concept View'){
		html+='<li>';
		html+='<a href="../prof_class_view/prof_class_view.html" style="margin-top: 12px; font-size:14pt;"><i class="material-icons">arrow_back</i></a>';
		html+='</li>';	
	}

	// Navbar if user is not logged in
	if(parsedResult=="Login"){
		html+='<ul class="nav navbar-nav">';

		// Login link
		if(document.title=='Login'){
			html+='<li class="active">';
		}
		else{
			html+='<li>';
		}
		html+='<a href="../login/login.html" style="margin-top: 12px; font-size:14pt;">Login</a>';
		html+='</li>';
		
		// Register link
		if(document.title=='Registration'){ 
			html+='<li class="active">';
		}
		else{
			html+='<li>';
		}
		html+='<a href="../registration/registration.html" style="margin-top: 12px; font-size:14pt;">Register</a>';
		html+='</li>';
		
		//html+='</ul>';				
		
	}
	
	// Navbar if student is logged in
	else if(parsedResult.role=='student'){
		html+='<ul class="nav navbar-nav">';

		if(document.title=='Class View'){
			// add class link and make it active
			html+='<li class="active">';
			html+='<a href="../class_view/class_view.html" style="margin-top: 12px; font-size:14pt;">'+
			parsedResult.className+'</a>';
			html+='</li>';
			
			html+='<li>';
			html+='<a href="../grades/grades.html" style="margin-top: 12px; font-size:14pt;">Grades</a>';
			html+='</li>';
		}

		if(document.title=='Grades'){
			html+='<li>';
			html+='<a href="../class_view/class_view.html" style="margin-top: 12px; font-size:14pt;">'+
			parsedResult.className+'</a>';
			html+='</li>';

			html+='<li class="active">';
			html+='<a href="../class_view/class_view.html" style="margin-top: 12px; font-size:14pt;">Grades</a>';
			html+='</li>';
		}

		// Account home link
		if(document.title=='Account Home'){ 
			html+='<li class="active">';
		}
		else{
			html+='<li>';
		}
		html+='<a style="margin-top: 12px; font-size:14pt; cursor: pointer;" onclick="showDropDown()"><i class="material-icons">account_circle</i></a>';
		html+='</li>';

		//html+='</ul>';
	}
	// Navbar if professor is logged in and on account home page
	else if(parsedResult.role=='professor'){
		html+='<ul class="nav navbar-nav">';

		if(document.title=='Class Builder'){
			// add class link and make it active
			html+='<li class="active">';
			html+='<a href="../class_builder/class_builder.html" style="margin-top: 12px; font-size:14pt;">'+
			parsedResult.className+' Builder</a>';
			html+='</li>';

			html+='<li>';
			html+='<a href="../prof_class_view/prof_class_view.html" style="margin-top: 12px; font-size:14pt;">'+
			parsedResult.className+' Class View</a>';
			html+='</li>';
		}

		if(document.title=='Professor Class View'){
			// add class link and make it active
			html+='<li>';
			html+='<a href="../class_builder/class_builder.html" style="margin-top: 12px; font-size:14pt;">'+
			parsedResult.className+' Builder</a>';
			html+='</li>';

			html+='<li class="active">';
			html+='<a href="../prof_class_view/prof_class_view.html" style="margin-top: 12px; font-size:14pt;">'+
			parsedResult.className+' Class View</a>';
			html+='</li>';
		}

		// Account home link
		if(document.title=='Account Home'){ 
			html+='<li class="active">';
		}
		else{
			html+='<li>';
		}
		html+='<a style="margin-top: 12px; font-size:14pt; cursor: pointer;" onclick="showDropDown()"><i class="material-icons">account_circle</i></a>';
		html+='</li>';

		//html+='</ul>';	
	}

	html+='<li>';
	html+='<a href="../user_feedback/user_feedback.html" style="margin-top: 12px; font-size:14pt;"><i class="material-icons">feedback</i></a>';
	html+='</li>';	
	html+='</ul>';	

	html+='<li>';
	html+='<a href="../about/about.html" style="margin-top: 12px; font-size:14pt;"><i class="material-icons">info</i></a>';
	html+='</li>';	
	html+='</ul>';	

	if(document.title == "Class Builder" || document.title == "Class View" 
		|| document.title == "Concept Builder" || document.title == "Concept View"){

		html+='<li>';
		html+='<i class="material-icons" id="help-icon" onclick="HelpMessageHelper()" style="cursor: pointer; margin: 27px 25px 0px 13px; color: #777777;">help</i>';
		html+='</li>';	
		html+='</ul>';	
	}

	insertNavBarHtml(html);
}

function showDropDown(){
	if(!dropdownIsShown){
		dropdownIsShown = true;
		$("#custom_dropdown").show();
	}
	else{
		dropdownIsShown = false;
		$("#custom_dropdown").hide();
	}
}

function insertNavBarHtml(html){
	$('#navBarLinks').html(html);
}