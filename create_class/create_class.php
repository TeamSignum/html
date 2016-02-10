<?php

	/* 
	 * Author: Learning Universe
	 * Last Updated: February 9, 2016
	 *
	 * PHP backend functionality for professor to create a class
	 *
	 */

	// TODO: Add all error checking
	session_start();
	
	//print_r($_SESSION);
	//print_r($_POST);
	
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
		// Use a transaction since there are multiple queries
		$DB->beginTransaction();
		
			// Insert info into classes table	
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

			// Get the CID of the newly inserted class
			$query="SELECT LAST_INSERT_ID()";
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);

			$cid=$result[0]['LAST_INSERT_ID()'];

			// Insert the info into the teaching table
			$query = "INSERT INTO teaching
					  (idusers, cid)
					  VALUES
					  (?,?)";
			$statement = $DB->prepare($query);
			$statement->bindValue (1, $userid);
			$statement->bindValue (2, $cid);
			$statement->execute();
		// Commit the transaction
		$DB->commit();
	}
	catch (Exception $ex){
    	$DB->rollback();
    	echo
		    "<p>oops</p>
		     <p> Code: {$ex->getCode()} </p>
		     <pre>$ex</pre>";
    }
	
?>