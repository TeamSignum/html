<?php

	/* 
	 * Author: LearningUniverse
	 * Date: Spring 2016
	 *
	 * PHP file for getting assignment submissions for grading
	 *
	 */

	session_start();
	
	//print_r($_SESSION);
	//print_r($_POST);
	
	require_once ('../db.php');

	if(isset($_POST['gradeQuery']))
	{
		$query=$_POST['gradeQuery'];
		// Create a PDO object	
		$DB=openDB();

		switch($query)
		{
			case 'getAssignments':
			
				// if(isset($_POST['cid']) && isset($_POST['nid']) && isset($_POST['nid2'])){
				// 	$cid = $_POST['cid'];
				// 	$nid = $_POST['nid'];
				// 	$nid2 = $_POST['nid2'];
				// }
				// else{
				// 	die("Information required for query was not found.");
				// }

				// Hard coding values for testing
				$cid="1";
				$nid="1";
				$nid2="1";

				$query="SELECT u.firstname, 
							   u.lastname, 
							   u.idusers, 
							   a.cid, 
							   a.nid, 
							   a.nid2, 
							   a.tdate, 
							   a.file, 
							   a.grade,
							   a.student_comments,
							   a.grader_comments
						FROM users u
						NATURAL JOIN enrolled e
						LEFT JOIN assignments a
							ON e.idusers = a.idusers
						WHERE e.cid=? AND (a.nid=? OR a.nid IS NULL) AND (a.nid2=? OR a.nid2 IS NULL)
						ORDER BY u.lastname ASC";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $cid);					
				$statement->bindValue(2, $nid);
				$statement->bindValue(3, $nid2);	
					
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
				break;

			case 'submitGrade':
				if(isset($_POST['grader-comments']) && isset($_POST['grade'])) {
					$grader_comments = $_POST['grader-comments'];
					$grade = $_POST['grade'];

					echo ($grader_comments);
					echo ($grade);
				}
				else{
					die("Form data was not set.");
				}

				// Hard coding to test query

				$query="UPDATE assignments
						SET grader_comments=?, grade=?
						WHERE cid=? AND nid=? AND nid2=? AND idusers=?";
									
				$statement = $DB->prepare($query);
				$statement->bindValue(1, $grader_comments);					
				$statement->bindValue(2, $grade);
				$statement->bindValue(3, "1");
				$statement->bindValue(4, "1");
				$statement->bindValue(5, "1");
				$statement->bindValue(6, "1");
					
				// Execute the database query
				$statement->execute();
				
				// TODO: Need error handling for empty query results
				
				// Check for a failed query
				if(mysql_errno()){
					echo "MySQL error ".mysql_errno().": "
			 		.mysql_error()."\n<br>When executing <br>\n$query\n<br>";
				}
				else{
					echo("Success");
				}

				break;

			default:
				die("Unknown query type.");
		}
		// Close the PDO DB Connection (not necessary, but good practice...so I've read)
		$DB = null;
	}
	else{
		//print_r($_POST);
		die("Query type was not set.");
	}


?>