<?php

	session_start();
	
	// Check that email is set in the Session
	// if(isset($_SESSION['email']))
	//{	
		// Get the email from the session
		//$email = $_SESSION['email'];
				
		// Set up the database connection
		$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		// Set and prepare the database query
		$query = "SELECT * FROM users WHERE email = 'user2@gmail.com'";
		$statement = $DB->prepare($query);
		
		// Execute the database query
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		echo json_encode($result);
	//}
	//else
	//{	
	//	echo "Something went wrong.  Profile not found.";
	//}
?>