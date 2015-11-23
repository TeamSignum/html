/*
 * JAVASCRIPT HELPER FUNCTIONS 
 * 
 * @Details: Please include any helper function that you think would be generally useful for any html/javascript page. 
 * 
 * @Instructions: helper.js is included in import.html. It will automatically be linked when you import import.html
 * 				  ***helper.js requires jquery. Jquery is automatically included in import.html. If you do not import import.html 
                  you must included jquery before helper.js. 
 */ 

/*
 * Returns width of div
 * @param div_id - html id of div no #
 * @example: 
 *          <div style="width: 500px" id="myDiv"></div> 
 *          getDivWidth('myDiv'); 
 */ 
 function getDivWidth(div_id){
 	return $("#" + div_id).width(); 
 } 

 /*
  * See getDivWidth. 
  */ 
 function getDivHeight(div_id){
 	return $("#" + div_id).height(); 
 } 


/* 
 * Universal function for all pages. Called when document is ready. 
 * You must include a div with id="navbar:" + path to html directory. 
 * For example in login.php, 
 *            <div id="navbar:../"></div>
 * Where ../ is the relative path to html directory. (1 step out). 
 */ 
 $( document ).ready(function() {
 	var $element  = $('*[id^="navbar"]'); 
 	var id        = $element[0].id; 
 	var path      = id.split(":")[1] + "navbar/navbar.html"; 
 	var imagePath = id.split(":")[1] + "navbar/images/LU_Logo_Navbar.png"

 	$('*[id^="navbar"]').load(path); 

 	// TODO: change navbar-image src tag. 

 }); 