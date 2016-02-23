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
if(isset($_SESSION['uid'])){	
	$uid = $_SESSION['uid'];
}
else{
	die();
}

if(isset($_POST['queryType'])){
	$queryType=$_POST['queryType'];
}
else{
	die('Query type required to update profile was not found.');
}

// Set include path and require appropriate files
set_include_path( "../");
require_once ('db.php');

switch ($queryType) {
	case 'updateEmail':
		if(isset($_POST['email'])){
			$email=$_POST['email'];
		}
		else{
			die("New email address was not found.");
		}

		try{
			// Login to the database	
			$DB=openDB();

			$query = "UPDATE users
					  SET email=?
					  WHERE uid=?";
							
			$statement = $DB->prepare($query);
			$statement->bindValue(1, $email);					
			$statement->bindValue(2, $uid);

			$statement->execute();

			// Update the email session variable
			$_SESSION['email']=$email;
		}
		catch(PDOException $ex){
			if($ex->getCode()=="23000"){
				echo("Email address already taken.");
			}
			else{
			  	echo
			     "<p>oops</p>
			      <p> Code: {$ex->getCode()} </p>
			      <pre>$ex</pre>";
			}
			die();
		}
		
		break;

	case 'updateUserId':
		if(isset($_POST['userid'])){
			$userid=$_POST['userid'];
		}
		else{
			die("New User ID was not found.");
		}

		try{
			// Login to the database	
			$DB=openDB();

			$query = "UPDATE users
					  SET uid=?
					  WHERE uid=?";
							
			$statement = $DB->prepare($query);
			$statement->bindValue(1, $userid);					
			$statement->bindValue(2, $uid);

			$statement->execute();

			// Update the uid session variable
			$_SESSION['uid']=$userid;
		}
		catch(PDOException $ex){
			if($ex->getCode()=="23000"){
				echo("User ID already taken.");
			}
			else{
			  	echo
			     "<p>oops</p>
			      <p> Code: {$ex->getCode()} </p>
			      <pre>$ex</pre>";
			}
			die();
		}
		
		break;

	case 'updateName':
		if(isset($_POST['firstname']) && isset($_POST['lastname'])){
			$firstname=$_POST['firstname'];
			$lastname=$_POST['lastname'];
		}
		else{
			die("New name information was not found.");
		}

		try{
			// Login to the database	
			$DB=openDB();

			$query = "UPDATE users
					  SET firstname=?, lastname=?
					  WHERE uid=?";
							
			$statement = $DB->prepare($query);
			$statement->bindValue(1, $firstname);					
			$statement->bindValue(2, $lastname);
			$statement->bindValue(3, $uid);

			$statement->execute();

			// Update the uid session variable
			$_SESSION['firstname']=$firstname;
			$_SESSION['lastname']=$lastname;
		}
		catch(PDOException $ex){
			if($ex->getCode()=="23000"){
				echo("User ID already taken.");
			}
			else{
			  	echo
			     "<p>oops</p>
			      <p> Code: {$ex->getCode()} </p>
			      <pre>$ex</pre>";
			}
			die();
		}
		break;

	case 'updatePicture':
		if(!isset($_FILES['imageToUpload'])){
			die("No picture found.");
		}

		// $check if the file is an image.
		$check = getimagesize($_FILES["imageToUpload"]["tmp_name"]);
		if($check === false) {
		      die("Uploaded file is not an image.");
		}

		// Get image file name
		$uploadedFileName=pathinfo(($_FILES['imageToUpload']['name']), PATHINFO_FILENAME);
		// Set target directory
		// This line for testing on local machine (windows)
		//$targetDirectory=dirname(__DIR__)."\profile_images";
		// This line is for the server (Linux);
		$targetDirectory=dirname(__DIR__)."/profile_images";
		echo($targetDirectory);
		// Create a unique file name with tempnam function
		$destinationFileName = tempnam($targetDirectory, $uploadedFileName);
		//echo($destinationFileName);
		
		// Assuming $_FILES['file']['error'] == 0 (no errors)
		if (move_uploaded_file($_FILES['imageToUpload']['tmp_name'], $destinationFileName)) {
		    // Get the extension from uploaded file
		    $fileExtension = '.' . pathinfo($_FILES['imageToUpload']['name'], PATHINFO_EXTENSION);
		    // Replace tmp with actual file extension
		    $newFileName=str_replace('.tmp', $fileExtension, $destinationFileName);
		    // update the file name
		    rename($destinationFileName, $newFileName);
		    // Strip the file path to store the image name in the database
		    $databaseFileName=basename($newFileName);

		    // File uploaded successfully, add reference to the database
		    try{
			// Login to the database	
			$DB=openDB();

			$query = "UPDATE users
					  SET profilepic=?
					  WHERE uid=?";
							
			$statement = $DB->prepare($query);
			$statement->bindValue(1, $databaseFileName);	
			$statement->bindValue(2, $uid);
			
			$statement->execute();

			echo("Success: " . $databaseFileName);

			// TODO:  Need to delete the old file...
			}
			catch(PDOException $ex){
				if($ex->getCode()=="23000"){
					echo("User ID already taken.");
				}
				else{
				  	echo
				     "<p>oops</p>
				      <p> Code: {$ex->getCode()} </p>
				      <pre>$ex</pre>";
				}
			die();
		}

		} else {
		    // tempnam() created a new file, but moving the uploaded file failed
		    unlink($destinationFileName); // remove temporary file
		    die('File could not be uploaded.');
		}
		break;
	
	default:
		die("Invalid query type provided.");
		break;
}	
	
?>