<?php

	session_start();
	
	// *****TODO: Hook up session information.  Everything is hard coded right now*****
	
	// Check that email is set in the Session
	// if(isset($_SESSION['email']))
	//{	
		// Get the email from the session
		//$email = $_SESSION['email'];
		
		// Get form data
		$email=$_POST['email'];
		$userid=$_POST['userid'];
		$firstname=$_POST['firstname'];
		$lastname=$_POST['lastname'];
		
		// *****TODO: Check if an image was provided*****
		
		// Get image file
		$sourcePath=($_FILES['imageToUpload']['tmp_name']);
		$targetDirectory="../profile_images/";
		
		// Hard coding file name for now.  Need to change it to include the UID
		$hardcodedfilename = "user2.jpg";
		$targetFile=$targetDirectory . $hardcodedfilename;
		
		echo($targetFile);
		
		// Saving the profile pic to the profile_images directory
		move_uploaded_file($_FILES['imageToUpload']['tmp_name'], $targetFile);
				
		// Set up the database connection
		$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		//$query = "UPDATE users SET firstname='$firstname', lastname='$lastname', uid='$userid' WHERE email='$email'";
		$query = "UPDATE users SET profilepic='$hardcodedfilename' WHERE email='$email'";
		
		$stmt = $DB->prepare($query);
		
		$stmt->execute();
		
	//}
	//else
	//{	
	//	echo "Something went wrong.  Profile not found.";
	//}
?>