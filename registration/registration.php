<!DOCTYPE html>
<html>
<head> 
  <link rel="import" href="../imports/import.html">
  <link rel="stylesheet" type="text/css" href="class_builder.css"> 
  <script src="class_builder.js" type="text/javascript"></script>
  <title> Class Builder </title>  
</head> 
<body>

<h1>Class Builder<h1>

<div id="container"> 
	<h2> Learning Map </h2>
  <canvas id="map" width="500" height="500"></canvas>
</div>

<script type="text/javascript"> 

	$( document ).ready(function() {

  var canvas = new fabric.Canvas('map');
  canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.item(0).hasControls = canvas.item(0).hasBorders = false;

  canvas.on({
    'mouse:down': function(e) {
      if (e.target) {
        e.target.opacity = 0.5;
        canvas.renderAll();
        alert("Event!"); 
      }
    },
    'mouse:up': function(e) {
      if (e.target) {
        e.target.opacity = 1;
        canvas.renderAll();
        alert("Event!"); 
      }
    },
    'object:moved': function(e) {
      e.target.opacity = 0.5;
    },
    'object:modified': function(e) {
      e.target.opacity = 1;
    }

  });

  this.__canvases.push(canvas);
  });

</script> 

</body>
</html>