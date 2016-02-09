<?php

	/* 
	 * Author: Joseph Cottongim
	 * Date: February 8, 2016
	 *
	 * PHP backend functionality for professor to create a class
	 *
	 */

	// TODO: Add all error checking
	session_start();
	
	print_r($_SESSION);
	print_r($_POST);
	
	// Check SESSION variables
	if(!isset($_SESSION['userid'])){
		; // TODO: redirect to the login page
	}
	else{
		$userid = $_SESSION['userid'];
	}

	if(isset($_POST['classname'])){
		$classname=$_POST['classname'];
	}
	if(isset($_POST['description'])){
		$description=$_POST['description'];
	}
	if(isset($_POST['classnumber'])){
		$classnumber=$_POST['classnumber'];
	}
	if(isset($_POST['section'])){
		$section=$_POST['section'];
	}
	if(isset($_POST['ekey'])){
		$ekey=$_POST['ekey'];
	}
		
	// Set include path and require appropriate files
	set_include_path( "../");
	require_once ('db.php');
	
	try {
		// Login to the database	
		$DB=openDB();
			
		$query = "INSERT INTO classes 
				  (section, classnumber, classname, description, ekey)
				  VALUES
				  (?,?,?,?,?)";

		$statement = $DB->prepare($query);
		$statement->bindValue (1, $section);
		$statement->bindValue (2, $classnumber);
		$statement->bindValue (3, $classname);					
		$statement->bindValue (4, $description);
		$statement->bindValue (5, $ekey);
		$statement->execute();
	}
	catch  (PDOException $ex){
		echo
		    "<p>oops</p>
		     <p> Code: {$ex->getCode()} </p>
		     <pre>$ex</pre>";
	}
	
?>