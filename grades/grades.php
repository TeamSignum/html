<?php

	/* 
	 * Author: Joseph Cottongim
	 * Date: January 31, 2016
	 *
	 * PHP file for queries relating to grades on the Learning Universe website
	 *
	 */

	session_start();
	
	if(isset($_POST['gradeQuery']))
	{
		$gradeQuery=$_POST['gradeQuery'];
		$query=null;
		
		// Set include path and require appropriate files
		set_include_path( "../");
		require_once (db.php);
		
		// Login to the database
		openDB();
		
		// Queries are numbered 1-7
		switch($gradeQuery) 
		{
			// Student requests
			case 1: // Query a grade for a single assignment
				$query = "SELECT score FROM grades WHERE uid='$uid' AND nid='$nid' AND classid='$classid'";
			case 2: // Query all grades for a class
				$query = "SELECT score FROM grades WHERE uid='$uid' AND classid='$classid'";
			case 3: // Query all grades for all classes
				$query = "SELECT score FROM grades WHERE uid='$uid' ORDER BY classid";
			
			// Professor requests
			case 4: // Query a single student grade for a single assignment
				$query = "SELECT score FROM grades WHERE uid='$uid' AND nid='$nid' AND classid='$classid'";
			case 5: // Query all grades for a student for a specific class
				$query = "SELECT score FROM grades WHERE uid='$uid' AND classid='$classid'";
			case 6: // Query all grades for an assignment
				$query = "SELECT score FROM grades WHERE nid='$nid' AND classid='$classid'";
			case 7: // Query all grades for a class
				$query = "SELECT score FROM grades WHERE classid='$classid' ORDER BY uid ASC, nid ASC";
		}
		
		if($query!=null)
		{
			$statement = $DB->prepare($query);
			
			// Execute the database query
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
				
			// Need handling for failed queries
			
			// Close the PDO DB Connection (not necessary, but good practice...so I've read)
			$DB = null;
		}
		else
		{
			$result="query error";
		}
	}
	else
	{
		$result="query error";
	}

?>