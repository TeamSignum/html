/*
 * Learning Universe
 * Quiz Builder
 *
 * Outlines question templates used to create a quiz.
 */
 
//Template variables
var qmc;
var qtf;
var qsa;
var num = 1;
var qtype = [];
var questions = [];

$(function () {
	//Multiple choice, TF, and short answer templates
    qmc = $("#MCQXX").clone(true);
	qtf = $("#TFQXX").clone(true);
	qsa = $("#SAQXX").clone(true);
	
	//Add question to the quiz
	$("#addqmc").click(
        function() {addmc(qmc); });
		
	$("#addqtf").click(
        function() {addtf(qtf); });
		
	$("#addqsa").click(
        function() {addsa(qsa); });

	$("#savequiz").click(
        function() {saveQuiz(); });			
    
	//Remove templates from initial page load
    $("#MCQXX").remove();
    $("#TFQXX").remove();
	$("#SAQXX").remove();
	
	loadQuiz();
});

//Adds a multiple choice question to the quiz.
//Changes the template IDs to its real IDs
function addmc(q)
{
	var temp = q.clone(true);
	
	temp.attr("id", "MCQ" + num.toString());
	temp.find("#MCDXX").attr("id", "MCD" + num.toString());
	
	temp.find("#MXX").attr("id", "M" + num.toString()).attr("name", "MT" + num.toString());
	temp.find("#MLXX").attr("id", "ML" + num.toString()).attr("for", "M" + num.toString()).text("Question " + num.toString() + ":");
	
	temp.find("#MAIXX").attr("id", "MAI" + num.toString());
	temp.find("#MBIXX").attr("id", "MBI" + num.toString());
	temp.find("#MCIXX").attr("id", "MCI" + num.toString());
	
	temp.find("#AXX").attr("id", "A" + num.toString()).attr("name", "MC" + num.toString());
	temp.find("#BXX").attr("id", "B" + num.toString()).attr("name", "MC" + num.toString());
	temp.find("#CXX").attr("id", "C" + num.toString()).attr("name", "MC" + num.toString());
	
	$("#Quiz").append(temp);
	
	num++;
	qtype.push("mc");
	
	return false;
}

//Adds a TF choice question to the quiz.
//Changes the template IDs to its real IDs
function addtf(q)
{
	var temp = q.clone(true);
	
	temp.attr("id", "TFQ" + num.toString());
	temp.find("#TFDXX").attr("id", "TFD" + num.toString());
	
	temp.find("#TFXX").attr("id", "TF" + num.toString()).attr("name", "TFT" + num.toString());
	temp.find("#TFLXX").attr("id", "TFL" + num.toString()).attr("for", "TF" + num.toString()).text("Question " + num.toString() + ":");
	
	//temp.find("#TIXX").attr("id", "TI" + num.toString());
	//temp.find("#FIXX").attr("id", "FI" + num.toString());
	
	temp.find("#TXX").attr("id", "T" + num.toString()).attr("name", "TFC" + num.toString());
	temp.find("#FXX").attr("id", "F" + num.toString()).attr("name", "TFC" + num.toString());
	
	$("#Quiz").append(temp);
	
	num++;
	qtype.push("tf");
	
	return false;
}

//Adds a short answer choice question to the quiz.
//Changes the template IDs to its real IDs
//Short answers are currently not being used to allow auto grading.
function addsa(q)
{
	var temp = q.clone(true);
	
	temp.attr("id", "SAQ" + num.toString());
	temp.find("#SADXX").attr("id", "SAD" + num.toString());
	
	temp.find("#SAXX").attr("id", "SA" + num.toString()).attr("name", "SAT" + num.toString());
	temp.find("#SALXX").attr("id", "SAL" + num.toString()).attr("for", "SA" + num.toString()).text("Question " + num.toString() + ":");
	
	temp.find("#ANSXX").attr("id", "ANS" + num.toString()).attr("name", "SAC" + num.toString());
	
	$("#Quiz").append(temp);
	
	num++;
	qtype.push("sa");
	
	return false;
}

//Deletes a question from the quiz.
function deleteQ(did)
{
	//Grab the question IDs
	var qid = did.substring(0, 3);
	var nid = did.substring(3, did.length);
	var divid;
	
	//Find the question type
	if(qid === "MCD")
	{
		divid = "MCQ" + nid;
	}
	if(qid === "TFD")
	{
		divid = "TFQ" + nid;
	}
	if(qid === "SAD")
	{
		divid = "SAQ" + nid;
	}
	
	$("#"+divid).remove();
	
	//Remove question
	//Re-number and re-ID the questions that followed the deleted question
	var index = parseInt(nid);
	for(var i = index; i < qtype.length; i++)
	{
		var qnum = i + 1;
		if(qtype[i] === "mc")
		{
			var temp = $("#MCQ" + qnum.toString());
			temp.attr("id", "MCQ" + i.toString());
			temp.find("#MCD" + qnum.toString()).attr("id", "MCD" + i.toString());
			
			temp.find("#M" + qnum.toString()).attr("id", "M" + i.toString()).attr("name", "MT" + i.toString());
			temp.find("#ML" + qnum.toString()).attr("id", "ML" + i.toString()).attr("for", "M" + i.toString()).text("Question " + i.toString() + ":");
			
			temp.find("#MAI" + qnum.toString()).attr("id", "MAI" + i.toString());
			temp.find("#MBI" + qnum.toString()).attr("id", "MBI" + i.toString());
			temp.find("#MCI" + qnum.toString()).attr("id", "MCI" + i.toString());
			
			temp.find("#A" + qnum.toString()).attr("id", "A" + i.toString()).attr("name", "MC" + i.toString());
			temp.find("#B" + qnum.toString()).attr("id", "B" + i.toString()).attr("name", "MC" + i.toString());
			temp.find("#C" + qnum.toString()).attr("id", "C" + i.toString()).attr("name", "MC" + i.toString());
		}
		if(qtype[i]  === "tf")
		{
			var temp = $("#TFQ" + qnum.toString());
			temp.attr("id", "TFQ" + i.toString());
			temp.find("#TFD" + qnum.toString()).attr("id", "TFD" + i.toString());
			
			temp.find("#TF" + qnum.toString()).attr("id", "TF" + i.toString()).attr("name", "TFT" + i.toString());
			temp.find("#TFL" + qnum.toString()).attr("id", "TFL" + i.toString()).attr("for", "TF" + i.toString()).text("Question " + i.toString() + ":");
			
			temp.find("#T" + qnum.toString()).attr("id", "T" + i.toString()).attr("name", "TFC" + i.toString());
			temp.find("#F" + qnum.toString()).attr("id", "F" + i.toString()).attr("name", "TFC" + i.toString());
		}
		if(qtype[i] === "sa")
		{
			var temp = $("#SAQ" + qnum.toString());
			temp.attr("id", "SAQ" + i.toString());
			temp.find("#SAD" + qnum.toString()).attr("id", "SAD" + i.toString());
			
			temp.find("#SA" + qnum.toString()).attr("id", "SA" + i.toString()).attr("name", "SAT" + i.toString());
			temp.find("#SAL" + qnum.toString()).attr("id", "SAL" + i.toString()).attr("for", "SA" + i.toString()).text("Question " + i.toString() + ":");
			
			temp.find("#ANS" + qnum.toString()).attr("id", "ANS" + i.toString()).attr("name", "SAC" + i.toString());
		}
	}
	qtype.splice((index-1), 1);
	num--;
	
	return false;
}

//Validation
//Checks if all input fields for a question are filled out.
function inputCheck()
{
	var empty = false
	$('input[type=text]').each(function(){
       if (this.value == "") {
           empty = true;
       } 
    })
	
	return empty;
}

//Validation
//Checks if an answer has been selected for a question.
function answerCheck()
{
	var empty = false
	$('input[type=radio]').each(function(){
		var name = $(this).attr("name");
		
        if($("input:radio[name="+ name +"]:checked").length == 0) {
           empty = true;
       } 
    })
	
	return empty;
}

//Save the quiz to the database.
function saveQuiz()
{
	//Validation checks
	var c1 = inputCheck();
	if(c1 == true)
	{
		swal("Fill in all the inputs.");
	}
	var c2 = answerCheck();
	if(c2 == true)
	{
		swal("Select an answer for each question.");
	}
	
	if(c1 == false && c2 == false)
	{
		//Loop through questions and set up JSON format for each question
		questions = [];
		for(var i = 0; i < qtype.length; i++)
		{
			var index = i+1;
			if(qtype[i] === "mc")
			{
				var temp = $("#MCQ" + index.toString()).clone(true);
				var t = {
					qnum: index,
					type: "mc",
					question: temp.find("#M" + index.toString()).val(),
					answer: temp.find("input[name=MC" + index.toString() + "]:checked").val(),
					a: temp.find("#MAI" + index.toString()).val(),
					b: temp.find("#MBI" + index.toString()).val(),
					c: temp.find("#MCI" + index.toString()).val()
				};
				questions.push(t);
			}
			if(qtype[i] === "tf")
			{
				var temp = $("#TFQ" + index.toString()).clone(true);
				var t = {
					qnum: index,
					type: "tf",
					question: temp.find("#TF" + index.toString()).val(),
					answer: temp.find("input[name=TFC" + index.toString() + "]:checked").val(),
					a: "",
					b: "",
					c: ""
				};
				questions.push(t);
			}
			if(qtype[i] === "sa")
			{
				var temp = $("#SAQ" + index.toString()).clone(true);
				var t = {
					qnum: index,
					type: "sa",
					question: temp.find("#SA" + index.toString()).val(),
					answer: "",
					a: "",
					b: "",
					c: ""
				};
				questions.push(t);
			}
		}
		
		//Send the questions to be saved into the database
		$.ajax({
			//async: true, 
			type: 'POST',
			url: "quizsave.php",
			dataType: 'html',
			data: {questions: questions},
		
			success: function(result){
				swal("Saved"); 
			}
		});
	}
	return false;
}

//Load the quiz from the database.
function loadQuiz()
{
	$.ajax({
		//async: true, 
		type: 'POST',
		url: "quizsave.php",
		dataType: 'json',
		data: {load: 1},
		
		success: function(result){
			//alert(result);
			populateQuiz(result);
		}
	});
		
	return false;
}

//Populate the question templates from the loaded JSON question data received from the database.
function populateQuiz(q)
{
	//Loop through the questions
	//Determine question type
	//Fill in the template info
	//Append question to the page.
	for(var i = 0; i < q.length; i++)
	{
		var type = q[i].type;
		var question = q[i].question;
		var answer = q[i].answer;
		if(type === "mc")
		{
			var a = q[i].a;
			var b = q[i].b;
			var c = q[i].c;
			
			var temp = qmc.clone(true);
			temp.attr("id", "MCQ" + num.toString());
			temp.find("#MCDXX").attr("id", "MCD" + num.toString());
	
			temp.find("#MXX").attr("id", "M" + num.toString()).attr("name", "MT" + num.toString()).val(question);
			temp.find("#MLXX").attr("id", "ML" + num.toString()).attr("for", "M" + num.toString()).text("Question " + num.toString() + ":");
	
			temp.find("#MAIXX").attr("id", "MAI" + num.toString()).val(a);
			temp.find("#MBIXX").attr("id", "MBI" + num.toString()).val(b);
			temp.find("#MCIXX").attr("id", "MCI" + num.toString()).val(c);
	
			temp.find("#AXX").attr("id", "A" + num.toString()).attr("name", "MC" + num.toString());
			temp.find("#BXX").attr("id", "B" + num.toString()).attr("name", "MC" + num.toString());
			temp.find("#CXX").attr("id", "C" + num.toString()).attr("name", "MC" + num.toString());
			
			temp.find("input[name=MC" + num.toString() + "][value=" + answer + "]").prop('checked', true);
	
			$("#Quiz").append(temp);
	
			num++;
			qtype.push("mc");
		}
		if(type === "tf")
		{
			var temp = qtf.clone(true);
			temp.attr("id", "TFQ" + num.toString());
			temp.find("#TFDXX").attr("id", "TFD" + num.toString());
	
			temp.find("#TFXX").attr("id", "TF" + num.toString()).attr("name", "TFT" + num.toString()).val(question);
			temp.find("#TFLXX").attr("id", "TFL" + num.toString()).attr("for", "TF" + num.toString()).text("Question " + num.toString() + ":");
	
			temp.find("#TXX").attr("id", "T" + num.toString()).attr("name", "TFC" + num.toString());
			temp.find("#FXX").attr("id", "F" + num.toString()).attr("name", "TFC" + num.toString());
			
			temp.find("input[name=TFC" + num.toString() + "][value=" + answer + "]").prop('checked', true);
	
			$("#Quiz").append(temp);
			
			num++;
			qtype.push("tf");
		}
		if(type === "sa")
		{
			var temp = qsa.clone(true);
			temp.attr("id", "SAQ" + num.toString());
			temp.find("#SADXX").attr("id", "SAD" + num.toString());
	
			temp.find("#SAXX").attr("id", "SA" + num.toString()).attr("name", "SAT" + num.toString()).val(question);
			temp.find("#SALXX").attr("id", "SAL" + num.toString()).attr("for", "SA" + num.toString()).text("Question " + num.toString() + ":");
	
			temp.find("#ANSXX").attr("id", "ANS" + num.toString()).attr("name", "SAC" + num.toString());
	
			$("#Quiz").append(temp);
	
			num++;
			qtype.push("sa");
		}
	}
}