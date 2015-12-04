
var classarray = [];
var planet_radius = 100;
var orbital_radius = 200;
var class_radius = 60;

function getClassName(){
	$.ajax({
		async: false,
		type: 'POST',
		url: "student_main.php",
		datatpye: 'JSON',
		success: function(result){	
			var classnamearr = JSON.parse(result); 	
			for(var x in classnamearr){
				classarray.push(classnamearr[x]);
			}
		}
	});
}

function drawclassnode(canvas){

	var node_space = (Math.PI * 2) / classarray.length;

	for (var i = classarray.length - 1; i >= 0; i--) {
		//
		inite_angle = i * node_space;

		//draw the circle
		var classCircle = new fabric.Circle({
			radius: class_radius,
			originX: 'center',
			originY: 'center',
			fill: 'black'
		});

		//draw the text
		var className = new fabric.Text(classarray[i],{
			originX: 'center',
			originY: 'center',
			fill: 'white'
		});

		var node_group = new fabric.Group([classCircle,className], {
			left: canvas.width/2 + Math.cos(inite_angle)*orbital_radius - class_radius,
			top: canvas.height/2 + Math.sin(inite_angle)*orbital_radius - class_radius,
			selectable: false
		});

		canvas.add(node_group);
	};

}

$( document ).ready(function() {

	var canvas = new fabric.Canvas('student_main');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var outer = new fabric.Circle({
		radius: orbital_radius,
		fill: '#99ffff',
		stroke: "black",
		left: (canvas.width/2) - orbital_radius ,
		top: (canvas.height/2) - orbital_radius,
		selectable: false
	});

	var inner= new fabric.Circle({
		radius: planet_radius,
		fill: 'black',
		originX: 'center',
		originY: 'center',
		selectable: false
	});

	var accountName = new fabric.Text('NAMGI', {
		fill: 'white',
		originX: 'center',
		originY: 'center',
		selectable: false
	});

	var profile = new fabric.Group([inner,accountName], {
		left: (canvas.width/2) - planet_radius ,
		top: (canvas.height/2) - planet_radius,
		selectable: false
	});

	canvas.add(outer, profile);
	getClassName();
	drawclassnode(canvas);

});