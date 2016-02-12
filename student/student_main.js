var classNumberArray = [];
var classIdArray = [];
var studentNodeRadius = 100;
var classOrbitalRadius = 200;
var classNodeRadius = 60;
var account_name = "";
var acc_role;

function getClassNumbers(){
	$.ajax({
		async: false,
		type: 'POST',
		url: "student_main.php",
		datatpye: 'json',
		data: {class: 1},
		
		success: function(result){
			//alert(result);
			var temp = JSON.parse(result);
			for(var x in temp)
			{
				classIdArray.push(temp[x].cid);
				classNumberArray.push(temp[x].classnumber);
			}
			classIdArray.push("-1");
			classNumberArray.push("+");
			//classNumberArray.push({cid: "-1", classnumber: "+"});
			//alert(classNumberArray);
			//var classNumbersJson = JSON.parse(result); 	
			//for(var x in classNumbersJson){
				//classNumberArray.push(classNumbersJson[x].classnumber);
			//}
			//classNumberArray.push("+");
		}
	});
}

function getName()
{
	$.ajax({
		type: 'POST',
		url: "student_main.php",
		dataType: 'json',
		data: {name: 1},
		async: false,
		
		success: function(result){
			//alert(result.name);
			account_name = result.name;
			acc_role = result.role;
			//alert(result.role);
		}
	});
	
	return false;
}

function drawclassnode(canvas){

	var classNodeSpacing = (Math.PI * 2) / classNumberArray.length;

	for (var i = classNumberArray.length - 1; i >= 0; i--) {
		//
		currentAngle = i * classNodeSpacing;
		var idname = classNumberArray[i];
		if(idname === "+")
		{
			idname = "addNode";
		}
		else
		{
			idname = "classNode";
		}

		//draw the circle
		var classCircle = new fabric.Circle({
			radius: classNodeRadius,
			originX: 'center',
			originY: 'center',
			fill: 'white',
			stroke: 'white',
			strokeWidth: 5,
			id: "mapNode"
		});
		
		//draw the text
		var className = new fabric.Text(classNumberArray[i],{
			originX: 'center',
			originY: 'center',
			fill: 'black',
			fontSize: '24',
			fontFamily: 'Arial',
			fontStyle: 'bold'
		});

		var node_group = new fabric.Group([classCircle,className], {
			left: canvas.width/2 + Math.cos(currentAngle)*classOrbitalRadius - classNodeRadius,
			top: canvas.height/2 + Math.sin(currentAngle)*classOrbitalRadius - classNodeRadius,
			selectable: false,
			id: idname
		});
		
		node_group.cid = classIdArray[i];

		canvas.add(node_group);
	};
}

function redirect(){
	window.location = '../class_view/class_view.html';
}

function directToClass(c)
{
	$.ajax({
		type: 'POST',
		url: "student_main.php",
		dataType: 'html',
		data: {direct: c},
		//async: false,
		
		success: function(result){
			//alert(result);
			if(result === "1")
			{
				//alert("2");
				//window.location = '../class_view/class.php';
				if(acc_role === "student")
				{
					window.location = '../class_view/class_view.html';
				}
				if(acc_role === "professor")
				{
					window.location = '../class_builder/class_builder.html';
				}
			}
		}
	});
	
	return false;
}

$( document ).ready(function() {
	
	getName();

	var canvas = new fabric.Canvas('student_main', {backgroundColor: "#99ffff"});

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	//canvas.background 

	var classOrbital = new fabric.Circle({
		radius: classOrbitalRadius,
		fill: '#99ffff',
		strokeWidth: 5,
		stroke: "black",
		left: (canvas.width/2) - classOrbitalRadius ,
		top: (canvas.height/2) - classOrbitalRadius,
		selectable: false
	});

	var studentNode= new fabric.Circle({
		radius: studentNodeRadius,
		fill: 'white',
		originX: 'center',
		originY: 'center',
		stroke: 'white',
		strokeWidth: 5,
		id: "mapNode"
		//selectable: true
	});
	
	var studentName = new fabric.Text('Name', {
		fontSize: '36',
		fontFamily: 'Arial',
		fontStyle: 'bold',
		fill: 'black',
		originX: 'center',
		originY: 'center',
		selectable: false
	});
	studentName.setText(account_name);

	var studentNodeGroup = new fabric.Group([studentNode, studentName], {
		left: (canvas.width/2) - studentNodeRadius,
		top: (canvas.height/2) - studentNodeRadius,
		selectable: false,
		stroke: 'white',
		strokeWidth: 5,
		id: "accountNode"
	});
	
	studentNodeGroup.on('selected', function() {
  		alert("Clicked");
	});

	canvas.add(classOrbital, studentNodeGroup);
	getClassNumbers();
	drawclassnode(canvas);
	
	canvas.on({

		'mouse:down': function(e) {
			if(e.target)
			{
				if (e.target.id === "classNode") 
				{
					//alert(e.target.cid);
					//loadNodePopup(e.target);
					//redirect();
					directToClass(e.target.cid);
				}
				if(e.target.id === "addNode")
				{
					//alert(e.target.cid);
					if(acc_role === "professor"){
						window.location.href = "/create_class/create_class.html";
					}
					else{
						window.location = '../add_class/add_class.html';
					}

				}
				if(e.target.id === "accountNode")
				{
					//alert("t");
					window.location = '../profile/profile.html';
				}
			}
	    },
		
		'mouse:over': function(e){
			if(e.target.id === "classNode" || e.target.id === "addNode" || e.target.id === "accountNode")
			{
				//e.target.studentNode.setStroke('yellow');
				e.target.forEachObject(function(object,i){
					if(object.id === "mapNode")
					{
						object.setStroke('yellow');
					}
				});
				canvas.renderAll();
			}
		},
	
		'mouse:out': function(e){
			if(e.target.id === "classNode" || e.target.id === "addNode" || e.target.id === "accountNode")
			{
				//e.target.setStroke('white');
				e.target.forEachObject(function(object,i){
					if(object.id === "mapNode")
					{
						object.setStroke('white');
					}
				});
				canvas.renderAll();
			}
		}
		
	});

});