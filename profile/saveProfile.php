<?php

	session_start();
	
	// Check that email is set in the Session
	// if(isset($_SESSION['email']))
	//{	
		// Get the email from the session
		//$email = $_SESSION['email'];
		
		//Get form data
		//print_r($_POST);
		$email=$_POST['email'];
		$userid=$_POST['userid'];
		$firstname=$_POST['firstname'];
		$lastname=$_POST['lastname'];
				
		// Set up the database connection
		$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$query = "UPDATE users SET firstname='$firstname', lastname='$lastname', uid='$userid' WHERE email='$email'";
		
		$stmt = $DB->prepare($query);
		
		$stmt->execute();
		
		
		
		
	//}
	//else
	//{	
	//	echo "Something went wrong.  Profile not found.";
	//}
?>