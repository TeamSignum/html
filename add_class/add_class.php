<?php

	/* 
	 * Author: Joseph Cottongim
	 * Date: February 3, 2016
	 *
	 * PHP backend functionality for students to add a class
	 *
	 */

	session_start();
	
	//print_r($_SESSION);
	
	// Check SESSION variables
	if(!isset($_SESSION['userid'])){
		; // TODO: redirect to the login page
	}
	else{
		$userid = $_SESSION['userid'];
	}
		
	if(isset($_POST['function']))
	{
		$function=$_POST['function'];
		$query=null;
		
		// Set include path and require appropriate files
		set_include_path( "../");
		require_once ('db.php');
		
		// Login to the database	
		$DB=openDB();
		
		// Functions
		switch($function) 
		{
			case 'getClasses':
				$query = "SELECT * FROM classes:";
				$statement = $DB->prepare($query);
				$statement->execute();
				$result = $statement->fetchAll(PDO::FETCH_ASSOC);
				break;
				
			case 'enroll':
				// Check if enrollment key matches (will all classes have an ekey?)
				if(isset($_POST['ekey']) && isset($_POST['cid']) && isset($_POST['uid'])){
					$ekey=$_POST['ekey'];
					$cid=$_POST['cid'];
					$uid=$_POST['uid'];
				}
				else{
					die("Enrollment Key or Class was not found");
				}
				
				$query = "SELECT c.ekey FROM classes c
									WHERE c.cid=?;";
				
				// Prepare and execute the database query
				$statement = $DB->prepare($query);
				$statement->bindValue (1, $cid);
				$statement->execute();
				$result = $statement->fetchAll(PDO::FETCH_ASSOC);
				
				// Compare enrollment key
				if($_ekey=result.ekey){
					// Enroll student in the class
					$query = "INSERT INTO enrolled (id, cid, uid) VALUES (?,?,?)";
					$statement = $DB->prepare($query);
					$statement->bindValue (1, $userid);
					$statement->bindValue (2, $cid);
					$statement->bindValue (3, $cid);
					$statement->execute();
					// Verify that insert succeeded
				}
					else
				{
					die("Enrollment key is invalid");
				}
				break;
				
			default:
				die("Invalid function selection");
		}
	}
?>