<?php
	session_start();
	
	// TODO: Need to get node id
	if(!isset($_SESSION['id'])) // change to isset when everything is figured out.
	{		
		// Get the node id from the session.  Currently hard coding it.
		//$uid = $_SESSION['id'];
		$nodeid = '51';
		
		// Set up the database connection
		$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		// Set and prepare the database query
		$query = "SELECT * FROM nodes WHERE nid = '" .$nodeid. "'";
		$statement = $DB->prepare($query);
		
		// Execute the database query
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		echo json_encode($result);
		
	}

?>