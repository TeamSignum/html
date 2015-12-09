<?php

try{
	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// Prepare query
	$query = "SELECT * FROM `nodepopups` WHERE `id` = ?";

	$statement = $DB->prepare($query);
	$statement->bindParam(1, $nid);

	$statement->execute();

	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	$popup = array();

	echo "shit's fucked up man"; 


	// foreach($result as $row)
	// {
	// 	$title = $row['title'];
	// 	$description = $row['description'];
	// 	$duedate = $row['duedate'];
	// 	$notes = $row['notes'];

	// 	$popup[] = array('top' => $top, 'left' => $left, 'radius' => $radius, 'type' => $type, 'title' => $title);
	// }

	// echo json_encode($nodes);
}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>