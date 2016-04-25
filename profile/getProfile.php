<?php

	/* 
	 * Author: Learning Universe - Joseph Cottongim
	 * Date: February 3, 2016
	 *
	 * Description: php file to pull user profile information
	 * from the Learning Universe database
	 *
	 */

	session_start();
	
	// Check that uid is set in the Session
	if(isset($_SESSION['uid']))
	{	
		// Get the email from the session
		$uid = $_SESSION['uid'];
		
		// Set include path and require appropriate files
		set_include_path( "../");
		require_once ('db.php');
		
		// Login to the database	
		$DB=openDB();		
				
		// Set and prepare the database query
		$query = "SELECT * FROM users WHERE uid = ?";
		$statement = $DB->prepare($query);
		$statement->bindParam(1, $uid);	
		
		// Execute the database query
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		echo json_encode($result);
	}
	else
	{	
		echo "Something went wrong.  Profile not found.";
	}
?>