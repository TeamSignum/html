<?php

session_start();

include '../../imports/ChromePhp.php';

try{

	$cid = $_SESSION['classid'];
	$nid = $_POST['nid'];

	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$query = "SELECT lecturenotes.name FROM `lecturenotes` WHERE lecturenotes.cid = ? AND lecturenotes.nid = ?";

	$statement = $DB->prepare($query);
	$statement->bindParam(1, $cid);
	$statement->bindParam(2, $nid);
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	$lecturenotes = array();

	foreach($result as $row)
	{
		$name = $row['name'];

		$lecturenotes[] = array('name' => $name);
	}

	echo json_encode($lecturenotes);
}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>