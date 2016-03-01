<?php

	/* 
	 * Author: Joseph Cottongim
	 * Date: January 31, 2016
	 * Last Edited: February 1, 2016
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
	
	// Check gradeQuery to determine execution
	if(isset($_POST['gradeQuery']))
	{
		$gradeQuery=$_POST['gradeQuery'];
		$query=null;
		
		// Set include path and require appropriate files
		set_include_path( "../");
		require_once ('db.php');
		
		// Login to the database	
		$DB=openDB();
		
		// Determine which gradeQuery is required and run it
		switch($gradeQuery) 
		{
			// #### Student requests ####
			// Request a single grade
			case 'studentOneGrade':
				// Set up required variables
				if(isset($_POST['cid']) && isset($_POST['idassignment'])){
					$cid = $_POST['cid'];
					$idassignment = $_POST['idassignment'];
				}
				else{
					die("Information required for query was not found.");
				}

				$query = "SELECT c.classnumber, p.title, g.score
						  FROM grades g
						  INNER JOIN popupassignment p
						  	  ON g.idassignment=p.idassignment
						  INNER JOIN classes c
						      ON p.cid=c.cid
						  WHERE g.idusers=? and c.cid=? and g.idassignment=?";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $userid);					
				$statement->bindValue(2, $cid);
				$statement->bindValue(3, $idassignment);
				break;
			
			// Query all grades for a class	
			case 'studentAllGradesOneClass': 
				// Set up required variables
				if(isset($_POST['cid'])){
					$cid = $_POST['cid'];
				}
				else{
					die("Information required for query was not found.");
				}

				$query = "SELECT c.classnumber, p.title, g.score
						  FROM grades g
						  INNER JOIN popupassignment p
						      ON g.idassignment=p.idassignment
						  INNER JOIN classes c
							  ON p.cid=c.cid
						  WHERE g.idusers=? and p.cid=?
						  ORDER BY p.duedate ASC";
				
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $userid);
				$statement->bindValue(2, $cid);
				break;
			
			// Query all grades for all classes
			case 'studentAllGradesAllClasses': 
				$query = "SELECT g.idusers, c.cid, c.classnumber, p.title, g.score
						  FROM grades g
						  INNER JOIN popupassignment p
							  ON g.idassignment=p.idassignment
						  INNER JOIN classes c
							  ON p.cid=c.cid
						  WHERE g.idusers=$userid
						  ORDER BY c.classnumber ASC";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $userid);		
				break;

			// Get class statistics for student view
			case 'studentClassGradeStats':
				// Set up required variables
				if(isset($_POST['cid'])){
					$cid = $_POST['cid'];
				}
				else{
					die("Information required for query was not found.");
				}
				$query = "SELECT g.idusers, c.classnumber, p.title, g.score
						  FROM grades g
						  INNER JOIN popupassignment p
						    ON g.idassignment=p.idassignment
						  INNER JOIN classes c
						    ON p.cid=c.cid
						  WHERE c.cid=?
						  ORDER BY p.title ASC";
									
				$statement = $DB->prepare($query);
				$statement->bindValue (1, $cid);

				break;
			
			// #### Professor requests ####
			// Query a single student grade for a single assignment
			case 'professorOneStudentOneAssignment': 
				// Set up required variables
				if(isset($_POST['studentid']) && isset($_POST['cid']) && isset($_POST['idassignment'])){
					$studentid = $_POST['studentid'];
					$cid = $_POST['cid'];
					$idassignment = $_POST['idassignment'];
				}
				else{
					die("Information required for query was not found.");
				}

				$query = "SELECT c.classnumber, p.title, g.score
						  FROM grades g
						  INNER JOIN popupassignment p
							  ON g.idassignment=p.idassignment
						  INNER JOIN classes c
							  ON p.cid=c.cid
						  WHERE g.idusers=? and c.cid=? and g.idassignment=?";
				
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $studentid);					
				$statement->bindValue(2, $cid);
				$statement->bindValue(3, $idassignment);
				break;
			
			// Query all grades for a student for a specific class	
			case 'professorOneStudentAllAssignments': 
				if(isset($_POST['studentid']) && isset($_POST['cid'])){
					$studentid = $_POST['studentid'];
					$cid = $_POST['cid'];
				}
				else{
					die("Information required for query was not found.");
				}
				$query = "SELECT c.classnumber, p.title, g.score
						  FROM grades g
						  INNER JOIN popupassignment p
							  ON g.idassignment=p.idassignment
						  INNER JOIN classes c
							  ON p.cid=c.cid
						  WHERE g.idusers=? and c.cid=?";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $studentid);					
				$statement->bindValue (2, $cid);
				break;
				
			// Query all grades for a specific assignment	
			case 'professorOneClassOneAssignments': 
				if(isset($_POST['cid']) && isset($_POST['idassignment'])){
					$cid = $_POST['cid'];
					$idassignment = $_POST['idassignment'];
				}
				else{
					die("Information required for query was not found.");
				}
				$query = "SELECT c.classnumber, p.title, g.score
						  FROM grades g
						  INNER JOIN popupassignment p
						    ON g.idassignment=p.idassignment
						  INNER JOIN classes c
						    ON p.cid=c.cid
						  WHERE g.idassignment=? and c.cid=?";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $idassignment);					
				$statement->bindValue (2, $cid);
				break;
			
			// Query all grades for a class	
			case 'professorOneClassAllAssignments':
				if(isset($_POST['cid'])){
					$cid = $_POST['cid'];
				}
				else{
					die("Information required for query was not found.");
				}

				$query = "SELECT c.classnumber, p.title, g.score
						  FROM grades g
						  INNER JOIN popupassignment p
						    ON g.idassignment=p.idassignment
						  INNER JOIN classes c
						    ON p.cid=c.cid
						  WHERE c.cid=?";
									
				$statement = $DB->prepare($query);
				$statement->bindValue (1, $cid);
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