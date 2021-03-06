<?php

/* 
 * Author: Learning Universe - Joseph Cottongim, Edited by Namgi Yoon
 * Date: February 3, 2016
 * 
 * Description: php file to save user profile changes on the Learning
 * Universe website.
 *
 */

include '../imports/ChromePhp.php';

session_start();

// Check that uid is set in the Session
if(isset($_SESSION['uid'])){	
	$uid = $_SESSION['uid'];
}
else{
	die();
}
// Set include path and require appropriate files
set_include_path( "../");
require_once ('db.php');

if(isset($_POST['email'])){
	$email=$_POST['email'];
}
else{
	die("New email address was not found.");
}

if(isset($_POST['userid'])){
	$userid=$_POST['userid'];
}
else{
	die("New User ID was not found.");
}

if(isset($_POST['firstname']) && isset($_POST['lastname'])){
	$firstname=$_POST['firstname'];
	$lastname=$_POST['lastname'];
}
else{
	die("New name information was not found.");
}

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
$targetDirectory="../profile_images";	
// Create a unique file name with tempnam function
$destinationFileName = tempnam($targetDirectory, $uploadedFileName);
// Get the extension from uploaded file
$fileExtension = '.' . pathinfo($_FILES['imageToUpload']['name'], PATHINFO_EXTENSION);
// Add the extension to the unique file name
$destinationFileName.=$fileExtension;
// remove ".tmp" extension if it's in the string (mainly for prettiness
// in local testing)
if (strpos($destinationFileName, '.tmp') !== false) {
    $destinationFileName = str_replace(".tmp","", $destinationFileName);
}

// Assuming $_FILES['file']['error'] == 0 (no errors)
if (move_uploaded_file($_FILES['imageToUpload']['tmp_name'], $destinationFileName)) {
    // Strip the file path to store the image name in the database
    $databaseFileName=basename($destinationFileName);
    $databaseFileName="../profile_images/".$databaseFileName;
    
    // File uploaded successfully, add reference to the database 
    ChromePhp::log($databaseFileName);

	try{
		// Login to the database	
		$DB=openDB();

		$query = "UPDATE users
				  SET email=?, uid=?, firstname=?, lastname=?, profilepic=?
				  WHERE uid=?";
						
		$statement = $DB->prepare($query);
		$statement->bindValue(1, $email);
		$statement->bindValue(2, $userid);
		$statement->bindValue(3, $firstname);
		$statement->bindValue(4, $lastname);					
		$statement->bindValue(5, $databaseFileName);
		$statement->bindValue(6, $uid);

		$statement->execute();

		// Update the email session variable
		$_SESSION['email']=$email;
		$_SESSION['uid']=$userid;
		$_SESSION['firstname']=$firstname;
		$_SESSION['lastname']=$lastname;

		// Delay/hack to allow time for image file to upload before
		// returning to the JS file.  If the file isn't uploaded, it won't
		// display when the site goes to the student_main page.
		sleep(2);
		echo($databaseFileName);
	}
	catch(PDOException $ex){
		if($ex->getCode()=="23000"){
			echo("Email address already taken.");
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

} 
else {
    // tempnam() created a new file, but moving the uploaded file failed
    unlink($destinationFileName); // remove temporary file
    die('File could not be uploaded.');
}	
	
?>