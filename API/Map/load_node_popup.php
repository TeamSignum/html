<?php

include '../imports/ChromePhp.php';

try{

	$nid = $_POST["nid"];
	$type = $_POST["type"];
	$classOrConcept = $_POST["classOrConcept"];

	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if($type == "concept"){
		if($classOrConcept == 0){
			$query = "SELECT * FROM `popupconcept` WHERE `nid` = ?";
		}
		else{
			$query = "SELECT * FROM `popupconcept2` WHERE `nid` = ?";
		}
	}
	else if($type == "assignment"){
		$query = "SELECT * FROM `popupassignment` WHERE `nid` = ?";
	}
	else{
		$query = "SELECT * FROM `popupquiz` WHERE `nid` = ?";
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
	else if($type == "assignment"){
		$title = $result['title'];
		$description = $result['description'];
		$duedate = $result['duedate'];
		$notes = $result['notes'];

		$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'notes' => $notes);  

		echo json_encode($popup);
	}
	else{
		$title = $result['title'];
		$description = $result['description'];
		$duedate = $result['duedate'];
		$notes = $result['notes'];

		$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'notes' => $notes);  

		echo json_encode($popup);
	}
}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>