<?php
session_start();

if(isset($_POST["class"]))
{

	// Get the node id from the session.  Currently hard coding it.
	//$uid = $_SESSION['id'];
	$userid = 'user1';
		
	// Set up the database connection
	$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
	// Set and prepare the database query
	$query = "SELECT b.classnumber
				FROM enrolled a, classes b
				WHERE a.cid = b.id and a.uid ='" .$userid. "'";
	$statement = $DB->prepare($query);
		
	// Execute the database query
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($result);
}

if(isset($_POST["name"]))
{
	$userid = $_SESSION['userid'];
	try
	{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$query = "SELECT firstname FROM users WHERE idusers = '$userid'";
		
		$statement = $DB->prepare($query);
		$statement->execute();
		$result = $statement->fetch(PDO::FETCH_ASSOC);
		
		$t = $result['firstname'];
		
		$r = array('name' => $t);
		
		echo json_encode($r);
		//echo $result['firstname'];
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}

?>
