var classNumberArray = [];
var studentNodeRadius = 100;
var classOrbitalRadius = 200;
var classNodeRadius = 60;

function getClassNumbers(){
	$.ajax({
		async: false,
		type: 'POST',
		url: "student_main.php",
		datatpye: "json",
		success: function(result){	
			var classNumbersJson = JSON.parse(result); 	
			for(var x in classNumbersJson){
				classNumberArray.push(classNumbersJson[x].classnumber);
			}
			//alert(result);
		}
	});
}

function drawclassnode(canvas){

	var classNodeSpacing = (Math.PI * 2) / classNumberArray.length;

	for (var i = classNumberArray.length - 1; i >= 0; i--) {
		//
		currentAngle = i * classNodeSpacing;

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
			id: "mapNode"
		});

		canvas.add(node_group);
	};

}

function redirect(){
	window.location = '../class_view/class_view.html';
}

$( document ).ready(function() {

	var canvas = new fabric.Canvas('student_main');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.background 

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
	
	var studentName = new fabric.Text('NAMGI', {
		fontSize: '36',
		fontFamily: 'Arial',
		fontStyle: 'bold',
		fill: 'black',
		originX: 'center',
		originY: 'center',
		selectable: false
	});

	var studentNodeGroup = new fabric.Group([studentNode, studentName], {
		left: (canvas.width/2) - studentNodeRadius,
		top: (canvas.height/2) - studentNodeRadius,
		selectable: false,
		stroke: 'white',
		strokeWidth: 5,
		id: "mapNode"
	});
	
	studentNodeGroup.on('selected', function() {
  		alert("Clicked");
	});

	canvas.add(classOrbital, studentNodeGroup);
	getClassNumbers();
	drawclassnode(canvas);
	
	canvas.on({

		'mouse:down': function(e) {
	    	if (e.target) 
	    	{
	    		//loadNodePopup(e.target);
				redirect();
	    	}
	    },
		
		'mouse:over': function(e){
			if(e.target.id === "mapNode")
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
			if(e.target.id === "mapNode")
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