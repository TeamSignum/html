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