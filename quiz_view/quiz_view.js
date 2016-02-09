var qmc;
var qtf;
var qsa;
var num = 1;

$( document ).ready(function () {
    qmc = $("#MCQXX").clone(true);
	qtf = $("#TFQXX").clone(true);
	qsa = $("#SAQXX").clone(true);

	$("#savequiz").click(
       function() { swal("Saved"); 
    });			
    
    $("#MCQXX").remove();
    $("#TFQXX").remove();
	$("#SAQXX").remove();
	
	loadQuiz();
});

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

function createQuiz(q)
{
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
		}
	}
}