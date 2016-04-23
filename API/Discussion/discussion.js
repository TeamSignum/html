/* 
 * Discussion forum API
 */

 var dnid = 0;
 var did  = 0;
 var classOrConcept;
 var myname = "";

// Loads a discussion for node with id @nid
function LoadDiscussion(nid, _classOrConcept){

	classOrConcept = _classOrConcept;

	dnid = nid;
	$("#lvl0").html("");

	// Fetch the name of the current user.
	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Discussion/getname.php",
		dataType: 'json',
		success: function(result){
			myname = result["firstname"] + " " + result["lastname"];
		}
	}); 

	// Load the discussion messages
	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Discussion/discussion.php",
		dataType: 'json',
		data: {action: "load", nid: nid, classOrConcept: classOrConcept}, 
		success: function(result){
			UseLoadData(result);
		}
	}); 

	return false;
}

// Constructs the discussion forum by adding text containers for each message in result
function UseLoadData(result){
	if(result.length > 0){
		did = result[result.length - 1]["id"]; 
	}
	
	for(var i = 0; i < result.length; i++){
		if(result[i]["level"] == 0){
			AddTextContainer(result[i]["content"], lvl0, result[i]["id"], result[i]["firstname"] + " " + result[i]["lastname"]);
		}
		else if(result[i]["level"] == 1){
			var container = "#rtext" + result[i]["parent"];
			AddTextContainer2(result[i]["content"], $(container), result[i]["id"], 
				result[i]["firstname"] + " " + result[i]["lastname"]);
		}
	}
}

// Saves a reply to the database. A reply has a parentid (message that was replied to)
function SubmitReply(textarea, containerid, parentid){

	var content = textarea.value;
	var container = "#rtext" + parentid;
	var level = 1;
	did++;

	// Ajax async save reply to database and add text container
	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Discussion/discussion.php",
		data: {action: "save", nid: dnid, level: level, content: content, parent: parentid, classOrConcept: classOrConcept}, 
		success: function(result){
			textarea.value = "";
			AddTextContainer2(content, $(container), did, myname);
			ClearReplyContainer(containerid);
		}
	}); 

	return false;
}

// Event called when a new question (level 0) is submitted. Saves the question to the database and 
// writes it out in a text container.
function SubmitNewQuestion(textarea, nid, level, container){

	var content = textarea.value;
	did++;

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Discussion/discussion.php",
		data: {action: "save", nid: nid, level: level, content: content, classOrConcept: classOrConcept}, 
		success: function(result){
			textarea.value = "";
			AddTextContainer(content, container, did, myname);
		}
	}); 

	return false;
}

// Add a reply text box.
function AddReplyContainer(container, id){
	$('*[id^="reply"]').html("");
	
	var html = `
	<div class="form-style-2">
		<form style="margin-bottom: 50px;">
			<textarea id="reply" class="textarea-field" style="width:100%;height:60px;" placeholder="Reply"></textarea>
			<div>
				<button type="button" class="btn1" id="" onclick="SubmitReply(reply,'`+container.id+`',`+id+`)">Reply</button>
				<button type="button" class="btn2" id="" onclick="ClearReplyContainer('`+container.id+`')">Cancel</button>
			</div>
		</form>
	</div>
	`;

	container.innerHTML = html;
}

// Deletes all reply text boxes.
function ClearReplyContainer(containerid){
	$('*[id^="reply"]').html("");
}

// Constructs a text container with id and contents of [name]: content
// E.g [Dan]: What is a loop?
function AddTextContainer(content, container, id, name){
	var html = `
	  <div class="textcontainer" id="d` + id + `">
	    <span>[` + name + `]: ` + content + `</span>
	    <img src="../imports/images/reply.png" alt="Reply" style="width:16px;height:16px;float:right;" onclick="AddReplyContainer(reply`+id+`,`+id+`)">
	  	<div id="rtext` + id + `" style="margin: 25px 0px 0px 10%;"></div>
	  	<div id="reply` + id + `"></div>
	    <hr>
	  </div>
	`;

	container.innerHTML = container.innerHTML + html;
}

// See AddTextContainer
// Does not add a assoicated reply container.
function AddTextContainer2(content, container, id, name){
	var html = `
	  <div class="textcontainer" id="d` + id + `" style="font-weight: bold; margin-bottom: 20px; font-size: 14px;">
	    <span>[` + name + `]: ` + content + `</span>
	  </div>
	`;

	container.html(container.html() + html);
}
