<?php

	/* 
	 * Author: Joseph Cottongim
	 * Date: January 31, 2016
	 *
	 * PHP file for queries relating to grades on the Learning Universe website
	 *
	 */

	session_start();
	
	if(isset($_POST['uid']) && isset($_POST['nid']) && isset($_POST['classid']))
	{
		
		$uid = $_POST['uid'];
		$nid = $_POST['nid'];
		$classid = $_POST['classid'];		
		
		// Set include path and require appropriate files
		set_include_path( "../");
		require_once (db.php);
		
		// Login to the database
		openDB();
		
		if(true) // Need query selection logic
		{
		
			// Student requests
		
			// Query a grade for a single assignment
			$query = "SELECT score FROM grades WHERE uid='$uid' AND nid='$nid' AND classid='$classid'";
		
			// Query all grades for a class
			$query = "SELECT score FROM grades WHERE uid='$uid' AND classid='$classid'";
		
			// Query all grades for all classes
			$query = "SELECT score FROM grades WHERE uid='$uid' ORDER BY classid";
	
	
			// Professor requests
			
			// Query a single student grade for a single assignment
			$query = "SELECT score FROM grades WHERE uid='$uid' AND nid='$nid' AND classid='$classid'";
			
			// Query all grades for a student
			$query = "SELECT score FROM grades WHERE uid='$uid' AND classid='$classid'";
			
			// Query all grades for an assignment
			$query = "SELECT score FROM grades WHERE nid='$nid' AND classid='$classid'";
					
			// Query all grades for a class
			$query = "SELECT score FROM grades WHERE classid='$classid' ORDER BY uid ASC, nid ASC";
			
		}
		
		if($query!=null)
		{
			$statement = $DB->prepare($query);
		
			// Execute the database query
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
			
			// Need handling for failed queries
		}
		
		// Close the PDO DB Connection (not necessary, but good practice...so I've read)
		$DB = null;
	}
	else
	{
		$result="query error";
	}

?>