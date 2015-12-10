<?php

try{

	$nid = $_POST["nid"];

	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// Prepare query
	$query = "SELECT * FROM `nodepopups` WHERE `nid` = ?";

	$statement = $DB->prepare($query);
	$statement->bindParam(1, $nid);

	$statement->execute();

	$result = $statement->fetch(PDO::FETCH_ASSOC);

	$title = $result['title'];
	$description = $result['description'];
	$duedate = $result['duedate'];
	$notes = $result['notes'];

	$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'notes' => $notes);  

	echo json_encode($popup);
}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>