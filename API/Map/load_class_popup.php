<?php

include '../../imports/ChromePhp.php';

try{

	// Loads a class popup from that database. A class pop  up has a cid.
	$cid = $_POST["cid"];

	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$query = "SELECT * FROM `classes` WHERE `cid` = ?";

	$statement = $DB->prepare($query);
	$statement->bindParam(1, $cid);

	$statement->execute();

	$result = $statement->fetch(PDO::FETCH_ASSOC);

	$name = $result['classname'];
	$number = $result['classnumber'];
	$section = $result['section'];
	$description = $result['description'];

	$popup = array('name' => $name, 'number' => $number, 'section' => $section, 'description' => $description);  

	echo json_encode($popup);
}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>