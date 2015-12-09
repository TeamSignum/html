<?php

	session_start();
	
	// TODO: Need to get id from POST that comes to this page
	if(!isset($_SESSION['id'])) // change to isset when everything is figured out.
	{		
		// Get the user uid from the session.  Currently hard coding it.
		//$uid = $_SESSION['id'];
		$uid = 'user2';
		
		// Set up the database connection
		$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		// Set and prepare the database query
		$query = "SELECT * FROM users WHERE uid = '" .$uid. "'";
		$statement = $DB->prepare($query);
		
		// Execute the database query
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		echo json_encode($result);
		
	}
	else
	{	
		$email = "joe@learninguniverse.com";
		$userName = "AverageJoe";
		$firstName = "Joe";
		$lastName = "Cottongim";
		$isProfileOwner = true;
		$readonly = "readonly";  //Sets whether a text field can be edited.  Possible values are "readonly" or "".
	}
?>	
