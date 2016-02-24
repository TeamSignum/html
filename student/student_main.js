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


		// Draw popup
		var popupCircle = new fabric.Circle({
			radius: 15,
			left: canvas.width/2 + Math.cos(currentAngle)*classOrbitalRadius + classNodeRadius - 30,
			top: canvas.height/2 + Math.sin(currentAngle)*classOrbitalRadius - classNodeRadius - 5,
			fill: '#009ACD',
			stroke: 'white',
			strokeWidth: 5,
			id: "popupnode"
		});
		popupCircle.cid = classIdArray[i];
		popupCircle.popup = "";
		popupCircle.lockMovementX = popupCircle.lockMovementY = true;
		popupCircle.hasControls = popupCircle.hasBorders = false;
		canvas.bringToFront(popupCircle);
		canvas.add(popupCircle);

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

function LoadPopup(node){

	$.ajax({
		async: true, 
		type: 'POST', 
		url: "../API/Map/load_class_popup.php",
		data: {cid: node.cid}, 
		dataType: "json", 
		success: function(result){
			node.popup = GenPopup(result);
			$("#popup").html(node.popup);
			$("#custom_container").show();
			$("#dim_div").show();
		}
	}); 

	return false; 
}

function HidePopup(){
	$("#custom_container").hide();
	$("#dim_div").hide();
}

function GenPopup(result){
	var html = `
	<div class="form-style-2">
		<div class="form-style-2-heading" style="width: 100%;">`+result["name"]+`</div>
			<div style="font-size:16px; font-weight:bold; text-align: left;">
				<p style="float:left; margin-left: 15px;">Number: `+ result["number"] +`</p>
				</br></br>
				<p style="float:left; margin-left: 15px;">Section: `+ result["section"] +`</p>
				</br></br>
				<p style="float:left; margin-left: 15px;">Description: `+ result["description"] +`</p>
			</div>
		</div>
	</div>
	`;

	return html;
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
	
	canvas.hoverCursor = 'pointer';
	
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

				if(e.target.id === "popupnode"){
					LoadPopup(e.target);
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

	$( "#xmark" ).click(function() {
		HidePopup();
	});
});