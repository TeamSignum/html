<?php

session_start();
$uid = $_SESSION['userid'];
$cid = $_POST['classid'];
$mid = $_POST['message'];

// Set include path and require appropriate files
//set_include_path( "../");
//require_once ('db.php');

try
{
	// Login to the database	
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$DB->beginTransaction();

	// insert the data
	$query = "INSERT INTO `LU`.`professor_notification` (`idusers`, `cid`, `message`) VALUES (?, ?, ?);";
	$statement = $DB->prepare($query);
	$statement->bindValue (1, $uid);
	$statement->bindValue (2, $cid);
	$statement->bindValue (3, $mid);
	$statement->execute();
	$DB->commit();
}
catch(PDOException $e)
{
	echo $e->getMessage();
}
?>