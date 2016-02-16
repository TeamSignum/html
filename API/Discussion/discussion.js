/* 
 * Discussion forum API
 */

 var dnid = 0;
 var did  = 0;

function LoadDiscussion(nid){

	dnid = nid;
	lvl0.innerHTML = "";

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Discussion/discussion.php",
		dataType: 'json',
		data: {action: "load", nid: nid}, 
		success: function(result){
			UseLoadData(result);
		}
	}); 

	return false;
}

function UseLoadData(result){
	did = result[result.length - 1]["id"]; 

	for(var i = 0; i < result.length; i++){
		if(result[i]["level"] == 0){
			AddTextContainer(result[i]["content"], lvl0, result[i]["id"]);
		}
		else if(result[i]["level"] == 1){
			var container = "#rtext" + result[i]["parent"];
			AddTextContainer2(result[i]["content"], $(container), result[i]["id"]);
		}
	}
}

function SubmitReply(textarea, containerid, parentid){

	var content = textarea.value;
	var container = "#rtext" + parentid;
	var level = 1;
	did++;

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Discussion/discussion.php",
		data: {action: "save", nid: dnid, level: level, content: content, parent: parentid}, 
		success: function(result){
			textarea.value = "";
			AddTextContainer2(content, $(container), did);
		}
	}); 

	return false;
}

/*
 * @param id - id of the text field
 */
function SubmitNewQuestion(textarea, nid, level, container){

	var content = textarea.value;
	did++;

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Discussion/discussion.php",
		data: {action: "save", nid: nid, level: level, content: content}, 
		success: function(result){
			textarea.value = "";
			AddTextContainer(content, container, did);
		}
	}); 

	return false;
}

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

function ClearReplyContainer(containerid){
	$('*[id^="reply"]').html("");
}

function AddTextContainer(content, container, id){
	var html = `
	  <div class="textcontainer" id="d` + id + `">
	    <span>` + content + `</span>
	    <img src="../imports/images/reply.png" alt="Reply" style="width:16px;height:16px;float:right;" onclick="AddReplyContainer(reply`+id+`,`+id+`)">
	  	<div id="reply` + id + `"></div>
	  	<div id="rtext` + id + `" style="margin: 25px 0px 0px 10%;"></div>
	    <hr>
	  </div>
	`;

	container.innerHTML = container.innerHTML + html;
}

function AddTextContainer2(content, container, id){
	var html = `
	  <div class="textcontainer" id="d` + id + `" style="font-weight: bold; margin-bottom: 20px; font-size: 14px;">
	    <span>` + content + `</span>
	  </div>
	`;

	container.html(container.html() + html);
}
