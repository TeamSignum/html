<?php

include '../../imports/ChromePhp.php';

session_start();

$uid = $_SESSION['userid'];

try{
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$query = "SELECT users.firstname, users.lastname FROM users WHERE users.idusers = ?";

	$statement = $DB->prepare($query);
	$statement->bindParam(1, $uid);
	$statement->execute();

	$results = $statement->fetch(PDO::FETCH_ASSOC);

	$firstname = $results["firstname"];
	$lastname = $results["lastname"];
	$name = array('firstname' => $firstname, 'lastname' => $lastname);
	
	echo json_encode($name);
}
catch(PDOException $e){
	echo $e->getMessage();
}

?>