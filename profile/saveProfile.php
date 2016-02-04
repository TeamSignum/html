<?php

	/* 
	 * Author: Joseph Cottongim
	 * Date: February 3, 2016
	 * 
	 * Description: php file to save user profile changes on the Learning
	 * Universe website.
	 *
	 */

	session_start();
	
	// Check that uid is set in the Session
	if(isset($_SESSION['uid']))
	{	
		// Get the email from the session
		$uid = $_SESSION['uid'];
		
		// Get form data
		$email=$_POST['email'];
		$userid=$_POST['userid'];
		$firstname=$_POST['firstname'];
		$lastname=$_POST['lastname'];
		
		var_dump($userid);
		
		// Get image file
		$sourcePath=($_FILES['imageToUpload']['tmp_name']);
		$targetDirectory="../profile_images/";
		//$targetDirectory="http://ec2-52-33-118-140.us-west-2.compute.amazonaws.com/profile_images/";
		
		// Create a file name for the image that matches the uid
		$filename = $userid . ".jpg";
		echo $filename;
		$targetFile=$targetDirectory.$filename;
		
		// Saving the profile pic to the profile_images directory
		move_uploaded_file($_FILES['imageToUpload']['tmp_name'], $targetFile);
				
		// Save any other changes to the database
		$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$query = "UPDATE users SET email=?, uid=?, firstname=?, lastname=?, profilepic=? WHERE uid=? ";
		$statement = $DB->prepare($query);
		$statement->bindValue (1, $email);
		$statement->bindValue (2, $uid);
		$statement->bindValue (3, $firstname);					
		$statement->bindValue (4, $lastname);
		$statement->bindValue (5, $filename);
		$statement->bindValue (6, $uid);
		
		$statement->execute();
		
	}
	else
	{	
		echo "Something went wrong.  Profile not found.";
	}
?>