<?php

	/* 
	 * Author: Joseph Cottongim
	 * Date: January 31, 2016
	 *
	 * PHP file for queries relating to grades on the Learning Universe website
	 *
	 */

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
	
	// Check POST variables
	if(isset($_POST['classid'])){
		$classid = $_POST['classid'];
	}
	if(isset($_POST['nid'])){
		$nid = $_POST['nid'];
	}
	
	if(isset($_POST['gradeQuery']))
	{
		$gradeQuery=$_POST['gradeQuery'];
		$query=null;
		
		// Set include path and require appropriate files
		set_include_path( "../");
		require_once ('db.php');
		
		// Login to the database	
		$DB=openDB();
		
		// Queries are numbered 1-7
		switch($gradeQuery) 
		{
			// Student requests
			case 1: // Query a grade for a single assignment
				$query = "SELECT c.classnumber, n.title, g.score
									FROM grades g
									INNER JOIN nodes n
										ON g.nid=n.nid
									INNER JOIN classes c
										ON g.cid=c.cid
									WHERE g.idusers=? and g.cid=? and n.nid=?;";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $userid);					
				$statement->bindValue (2, $classid);
				$statement->bindValue (3, $nid);
				break;
				
			case 2: // Query all grades for a class
				$query = "SELECT c.classnumber, n.title, g.score
									FROM grades g
									INNER JOIN nodes n
										ON g.nid=n.nid
									INNER JOIN classes c
										ON g.cid=c.cid
									WHERE g.idusers=? and g.cid=?
									ORDER BY n.nid ASC;";
				
				$statement = $DB->prepare($query);
				$statement->bindValue (1, $userid);
				$statement->bindValue (2, $classid);
				break;
			
			case 3: // Query all grades for all classes
				$query =	"SELECT c.classnumber, n.title, g.score
									FROM grades g
									INNER JOIN nodes n
										ON g.nid=n.nid
									INNER JOIN classes c
										ON g.cid=c.cid
									WHERE g.idusers=?
									ORDER BY c.classnumber ASC;";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $userid);		
				break;
			
			// Professor requests
			case 4: // Query a single student grade for a single assignment
				$query =	"SELECT c.classnumber, n.title, g.score
									FROM grades g
									INNER JOIN nodes n
										ON g.nid=n.nid
									INNER JOIN classes c
										ON g.cid=c.cid
									WHERE g.idusers=? and n.nid=?;";
				
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $userid);					
				$statement->bindValue (2, $nid);
				break;
				
			case 5: // Query all grades for a student for a specific class
				$query =	"SELECT c.classnumber, n.title, g.score
									FROM grades g
									INNER JOIN nodes n
										ON g.nid=n.nid
									INNER JOIN classes c
										ON g.cid=c.cid
									WHERE g.idusers=? and g.cid=?
									ORDER BY n.nid ASC;";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $userid);					
				$statement->bindValue (2, $classid);
				break;
				
			case 6: // Query all grades for an assignment
				$query =	"SELECT c.classnumber, n.title, g.score
									FROM grades g
									INNER JOIN nodes n
										ON g.nid=n.nid
									INNER JOIN classes c
										ON g.cid=c.cid
									WHERE n.nid=?;";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $nid);					
				break;
				
			case 7: // Query all grades for a class
				$query = "SELECT c.classnumber, n.title, g.score
									FROM grades g
									INNER JOIN nodes n
										ON g.nid=n.nid
									INNER JOIN classes c
										ON g.cid=c.cid
									WHERE g.idusers=? and g.cid=?
									ORDER BY n.nid ASC;";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $userid);					
				$statement->bindValue (2, $classid);
				break;
		}
		
		if($query!=null)
		{
			// Execute the database query
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
			
			// TODO: Need error handling for empty query results
			
			// Check for a failed query
			if(mysql_errno()){
    			echo "MySQL error ".mysql_errno().": "
         		.mysql_error()."\n<br>When executing <br>\n$query\n<br>";
			}
			else{
				echo(json_encode($result));
			}
			
			// Close the PDO DB Connection (not necessary, but good practice...so I've read)
			$DB = null;
		}
		else
		{
			echo "ERROR: Invalid query type.";
		}
	}
	else
	{
		echo "ERROR: No query type provided.";
	}

?>