/*
 * Learning Universe
 * Quiz Viewer
 *
 * Outlines question templates used to outline a quiz for a student to take.
 */

//Template variables 
var qmc;
var qtf;
var qsa;
var num = 1;
var qtype = [];

$( document ).ready(function () {
	//Multiple choice, TF, and short answer templates
    qmc = $("#MCQXX").clone(true);
	qtf = $("#TFQXX").clone(true);
	qsa = $("#SAQXX").clone(true);

	$("#savequiz").click(
       function() { submitQuiz(); 
    });			
    
	//Remove templates from initial page load
    $("#MCQXX").remove();
    $("#TFQXX").remove();
	$("#SAQXX").remove();
	
	loadQuiz();
});

//Load the quiz from the database.
function loadQuiz()
{
	$.ajax({
		//async: true, 
		type: 'POST',
		url: "quizload.php",
		dataType: 'json',
		data: {load: 1},
		
		success: function(result){
			//alert(result);
			createQuiz(result);
		}
	});
}

//Populate the question templates from the loaded JSON question data received from the database.
function createQuiz(q)
{
	//Loop through the questions
	//Determine question type
	//Fill in the template info
	//Append question to the page.
	for(var i = 0; i < q.length; i++)
	{
		var type = q[i].type;
		var question = q[i].question;
		//alert(type + " " + question);
		if(type === "mc")
		{
			var a = q[i].a;
			var b = q[i].b;
			var c = q[i].c;
			
			var temp = qmc.clone(true);
			temp.attr("id", "MCQ" + num.toString());
			
			temp.find("#MXX").attr("id", "M" + num.toString()).text(question);
			temp.find("#MLXX").attr("id", "ML" + num.toString()).attr("for", "M" + num.toString()).text("Question " + num.toString() + ": ");
			
			temp.find("#MAIXX").attr("id", "MAI" + num.toString()).text(a);
			temp.find("#AXX").attr("id", "A" + num.toString()).attr("name", "MC" + num.toString());
			
			temp.find("#MBIXX").attr("id", "MBI" + num.toString()).text(b);
			temp.find("#BXX").attr("id", "B" + num.toString()).attr("name", "MC" + num.toString());
			
			temp.find("#MCIXX").attr("id", "MCI" + num.toString()).text(c);
			temp.find("#CXX").attr("id", "C" + num.toString()).attr("name", "MC" + num.toString());
			
			$("#Quiz").append(temp);
			num++;
			qtype.push("mc");
		}
		if(type === "tf")
		{
			var temp = qtf.clone(true);
			temp.attr("id", "TFQ" + num.toString());
			
			temp.find("#TFXX").attr("id", "TF" + num.toString()).text(question);
			temp.find("#TFLXX").attr("id", "TFL" + num.toString()).attr("for", "TF" + num.toString()).text("Question " + num.toString() + ": ");
			
			temp.find("#TXX").attr("id", "T" + num.toString()).attr("name", "TFC" + num.toString());
			temp.find("#FXX").attr("id", "F" + num.toString()).attr("name", "TFC" + num.toString());
			
			$("#Quiz").append(temp);
			num++;
			qtype.push("tf");
		}
		if(type === "sa")
		{
			var temp = qsa.clone(true);
			temp.attr("id", "SAQ" + num.toString());
			
			temp.find("#SAXX").attr("id", "SA" + num.toString()).text(question);
			temp.find("#SALXX").attr("id", "SAL" + num.toString()).attr("for", "SA" + num.toString()).text("Question " + num.toString() + ": ");
			
			temp.find("#ANSXX").attr("id", "ANS" + num.toString()).attr("name", "SAC" + num.toString());
			
			$("#Quiz").append(temp);
			num++;
			qtype.push("sa");
		}
	}
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

//Submits the students answers for the quiz to the database.
function submitQuiz()
{
	//Validation checks
	var c1 = answerCheck();
	if(c1 == true)
	{
		swal("Fill in all answers.");
	}
	
	if(c1 == false)
	{
		//Loop through student's answers and set up JSON format for each question/answer
		var answers = [];
		for(var i = 0; i < qtype.length; i++)
		{
			var index = i+1;
			if(qtype[i] === "mc")
			{
				var temp = $("#MCQ" + index.toString()).clone(true);
				var a = {
					qnum: index,
					answer: temp.find("input[name=MC" + index.toString() + "]:checked").val()
				};
				answers.push(a);
			}
			if(qtype[i] === "tf")
			{
				var temp = $("#TFQ" + index.toString()).clone(true);
				var a = {
					qnum: index,
					answer: temp.find("input[name=TFC" + index.toString() + "]:checked").val()
				};
				answers.push(a);
			}
			if(qtype[i] === "sa")
			{
				var temp = $("#SAQ" + index.toString()).clone(true);
				//var answer = temp.find("input[name=TFC" + index.toString() + "]:checked").val()
			}
			
		}
		
		//Send the answers to be saved into the database
		$.ajax({
			//async: true, 
			type: 'POST',
			url: "quizload.php",
			dataType: 'html',
			data: {answers: answers},
		
			success: function(result){
				//alert(result);
				//Sends answers if student accepts the submission
				swal({
					title: "Quiz",
					text: "You have successfully completed the quiz.",
					confirmButtonText: "Ok",
					closeOnConfirm: true},
					function(isConfirm){
						if(isConfirm)
						{
							//Navigates student back to concept view
							window.location = '../concept_view/concept_view.html';
						}
					}
				);
			}
		});
	}
	return false;
}