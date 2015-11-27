var classarray = ['cs1410', 'cs2420', 'cs3100'];
var orbital_radius = 100;
var plant_radius = 200;

function drawclassnode(){
	var node_space = (Math.PI * 2) / classarray.length;

	for (var i = classarray.length - 1; i >= 0; i--) {
		//draw the circle
		classarray[i]
		//var center_x =  
		//var center_y = 
	};

}

$( document ).ready(function() {

	var canvas = new fabric.Canvas('student_main');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var innerCircle = new fabric.Circle({
		radius: plant_radius,
		fill: '#99ffff',
		stroke: "black",
		left: (canvas.width/2) - plant_radius ,
		top: (canvas.height/2) - plant_radius
	});

	var outerCircle= new fabric.Circle({
		radius: orbital_radius,
		fill: 'black',
		left: (canvas.width/2) - orbital_radius/64 - orbital_radius,
		top: (canvas.height/2) - orbital_radius/64 - orbital_radius
	});

	innerCircle.set('selectable', false);
	outerCircle.set('selectable', false);

	
	canvas.add(innerCircle, outerCircle);
});