<!DOCTYPE html>
<html>
<head> 
  <link rel="import" href="../imports/import.html">
  <link rel="stylesheet" type="text/css" href="student_main.css">
  <script src="student_main.js" type="text/javascript"></script>
  <title> student_main_page </title>  
</head> 
<body>
<div id="navbar:.."/>
<h1> Student Main Page<h1>

<div id="container"> 
  <canvas id="student_main" width="1900" height="1000"></canvas>
</div>
</body>

<?php
//function() getClassName{
	$host = 'localhost';
	$db_name = 'ludb';
	$email = 'test2@gmail.com';

	$connection = new MongoClient('localhost');

	//if(connection){
	//connecting to cidbase
	$db = $connection->$db_name;

	//connect to specific collection
	$collection1 = $db->users;

	$query1 = array('email'=>$email);
	
	//finding user and search what class he is taking.
	$cursor1 = $collection1->findOne($query1);

	if(count($cursor1)) {

		$classid = $cursor1["classes"];

		foreach ($classid as $cid) {
			# code...
			$float_cid = (float) $cid;
			$collection2 = $db->class;
			$query2 = array('_id'=>$float_cid);
			$cursor2 = $collection2->findOne($query2);
			$classname = $cursor2["classname"];
		}
	}

	//if(count($cursor1)){
	//	for ($i=0; $i < sizeof($cursor1Array['classes']) ; $i++) { 
	//		echo $cursor1Array['classes'][i];
	//	}
	//}
	//}
	//else{
	//	die("cidbese are not connected");
	//}
//}
 ?>