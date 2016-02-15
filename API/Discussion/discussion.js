/* 
 * Discussion forum API
 */

 var dnum = 0;

function LoadDiscussion(nid){

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
	dnum = result.length - 1;
	for(var i = 0; i < result.length; i++){
		if(result[i]["level"] == 0){
			AddTextContainer(result[i]["content"], lvl0, i);
		}
	}
}

function SubmitReply(){
}

/*
 * @param id - id of the text field
 */
function SubmitNewQuestion(textarea, nid, level, container){

	var content = textarea.value;

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Discussion/discussion.php",
		data: {action: "save", nid: nid, level: level, content: content}, 
		success: function(result){
			textarea.value = "";
			dnum++;
			AddTextContainer(content, container, dnum);
		}
	}); 

	return false;
}

function AddReplyContainer(container, num){
	$('*[id^="reply"]').html("");
	
	var html = `
	<div class="form-style-2">
		<form style="margin-bottom: 50px;">
			<textarea id="reply" class="textarea-field" style="width:100%;height:60px;" placeholder="Reply"></textarea>
			<div>
				<button type="button" class="btn1" id="" onclick="">Reply</button>
				<button type="button" class="btn2" id="" onclick="ClearReplyContainer('`+container.id+`')">Cancel</button>
			</div>
		</form>
	</div>
	`;

	container.innerHTML = container.innerHTML + html;
}

function ClearReplyContainer(containerid){
	$('*[id^="reply"]').html("");
}

function AddTextContainer(content, container, num){
	var html = `
	  <div class="textcontainer" id="d` + num + `">
	    <span>` + content + `</span>
	    <img src="../imports/images/reply.png" alt="Reply" style="width:16px;height:16px;float:right;" onclick="AddReplyContainer(reply`+num+`,`+num+`)">
	  	<div id="reply` + num + `"></div>
	    <hr>
	  </div>
	`;

	container.innerHTML = container.innerHTML + html;
}
