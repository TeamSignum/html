<?php

include '../imports/ChromePhp.php';

try{

	$nid = $_POST["nid"];
	$type = $_POST["type"];

	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if($type == "concept"){
		// Prepare query
		$query = "SELECT * FROM `popupconcept` WHERE `nid` = ?";
	}
	else{
		// Prepare query
		$query = "SELECT * FROM `popupconcept` WHERE `nid` = ?";
	}

	$statement = $DB->prepare($query);
	$statement->bindParam(1, $nid);

	$statement->execute();

	$result = $statement->fetch(PDO::FETCH_ASSOC);

	if($type == "concept"){
		$title = $result['title'];
		$description = $result['description'];
		$duedate = $result['duedate'];
		$notes = $result['notes'];

		$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'notes' => $notes);  

		echo json_encode($popup);
	}
	else{

	}
}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>