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
			
				if(isset($_SESSION['classid']) && isset($_SESSION['nid']) && isset($_SESSION['nid2a'])){
					$cid = $_SESSION['classid'];
					$nid = $_SESSION['nid'];
					$nid2 = $_SESSION['nid2a'];
				}
				else{
					die("Information required for query was not found.");
				}

				try{

					// Create a PDO object	
					$DB=openDB();

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

					echo json_encode($result);

					}
					catch(PDOException $e){
						die($e->getMessage);
					}
				break;

			case 'submitGrade':
				if(isset($_SESSION['classid']) && isset($_SESSION['nid']) && isset($_SESSION['nid2a'])){
					$cid = $_SESSION['classid'];
					$nid = $_SESSION['nid'];
					$nid2 = $_SESSION['nid2a'];
				}
				else{
					die("Information required for query was not found.");
				}

				if(isset($_POST['grader-comments']) && isset($_POST['grade']) && isset($_POST['userid'])) {
					$userid = $_POST['userid'];
					$grader_comments = $_POST['grader-comments'];
					$grade = $_POST['grade'];
					//echo($grader_comments.' '.$grade);
					//die();
				}
				else{
					//print_r($_POST);
					die("Form data was not set.");
				}

				try{

					// Create a PDO object	
					$DB=openDB();
					
					// See if there is an assignment record, and create one if none exists
					$query = "SELECT COUNT(*) as count
							  FROM assignments
							  WHERE cid = ? AND nid = ? AND nid2 = ? AND idusers = ?";
					$statement = $DB->prepare($query);
					$statement->bindValue(1, $cid);
					$statement->bindValue(2, $nid);
					$statement->bindValue(3, $nid2);
					$statement->bindValue(4, $userid);

					$statement->execute();
					$result = $statement->fetchAll(PDO::FETCH_ASSOC);
					
					$count = (int)($result[0]['count']);

					if($count == 0){
						$query="INSERT INTO assignments
								(cid, nid, nid2, idusers, tdate, grader_comments, grade)
								VALUES
								(?,?,?,?,?,?,?)";
						$statement = $DB->prepare($query);
						$statement->bindValue(1, $cid);
						$statement->bindValue(2, $nid);
						$statement->bindValue(3, $nid2);
						$statement->bindValue(4, $userid);
						$statement->bindValue(5, null, PDO::PARAM_INT); // Submits null value to DB
						$statement->bindValue(6, $grader_comments);					
						$statement->bindValue(7, $grade);

						// Execute the database query
						$statement->execute();
						echo("Success");
					}
					else{
						$query="UPDATE assignments
							SET grader_comments=?, grade=?
							WHERE cid=? AND nid=? AND nid2=? AND idusers=?";
										
						$statement = $DB->prepare($query);
						$statement->bindValue(1, $grader_comments);					
						$statement->bindValue(2, $grade);
						$statement->bindValue(3, $cid);
						$statement->bindValue(4, $nid);
						$statement->bindValue(5, $nid2);
						$statement->bindValue(6, $userid);
							
						// Execute the database query
						$statement->execute();
						echo("Success");
					}
				}
				catch(PDOException $e){
					echo($e->getMessage());
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