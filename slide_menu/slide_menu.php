<?php 

session_start();

if(isset($_SESSION['userid'])){

   	$userid = $_SESSION['userid'];

   	$role = '';
	$query= null;

	// Set include path and require appropriate files
	set_include_path( "../");
	require_once ('db.php');

	// Login to the database	
	$DB=openDB();

	if(isset($_POST['function'])){
		$fun = $_POST['function'];

		switch($fun)
		{
			case 'getRole':
				$query = "SELECT role FROM LU.users WHERE idusers='$userid';";
				$statement = $DB->prepare($query);
				$statement->execute();
				$result = $statement->fetch();
				$role = $result[0];
				echo(json_encode($result[0]));
				break;
			case 'getNotifications':
				$query = "SELECT role FROM LU.users WHERE idusers='$userid';";
				$statement = $DB->prepare($query);
				$statement->execute();
				$result = $statement->fetch();
				$role = $result[0];
				if($role == 'student'){
					
							getGrade($userid, $DB);
						
							// getDiscussion($userid, $DB);
							
							// getAssignmentNQuiz($userid, $DB);
							
					
					
				}else if($role=='professor'){
					$notifications = array();
					$query = "SELECT cid FROM LU.teaching WHERE `idusers` = '$userid' ";
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetchAll(PDO::FETCH_ASSOC);
					
					foreach ($result as $row => $cid) {
						$query = "SELECT count(*) FROM LU.enrolled WHERE cid = ?;";
						$statement = $DB->prepare($query);
						$statement->bindValue(1, $cid['cid']);
						$statement->execute();
						$students = $statement->fetch();
						$notifications[] = array('students' => $students['count(*)']);						
					}
					echo(json_encode($notifications));	
				}
				break;
		}// end switch	
	}// end if
	else{
		echo (json_encode("No keyword"));
	}
}
else{
	echo (json_encode('No Role'));
}// end iduser

function getGrade($userid, $DB){
	$notifications = array();
	$query = "SELECT cid, title, score, date_entered FROM LU.grades 
				left join LU.popupassignment on grades.idassignment = popupassignment.idassignment 
				where idusers = ? and date_entered >= DATE_SUB(CURDATE(), INTERVAL 20 DAY)
				order by date_entered;";
	$statement = $DB->prepare($query);
	$statement->bindValue(1, $userid);	
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	foreach($result as $row)
	{
		$title = $row['title'];
		$score = $row['score'];
		$date_entered = $row['date_entered'];
		$tmp_cid = $row['cid'];

		$query = "SELECT classnumber from LU.classes where cid ='$tmp_cid'";
		$statement = $DB->prepare($query);
		$statement->execute();
		$result2 = $statement->fetch(PDO::FETCH_ASSOC);

		$classnumber = $result2['classnumber'];

		$notifications[] = array('title' => $title, 'score' => $score, 'date_entered' => $date_entered ,'classnumber' => $classnumber);

	}
	echo json_encode($notifications);
}

function getDiscussion($userid, $DB){
	$notifications = array();
	$query = "SELECT classes.classnumber, users.firstname, discussions.content, discussions.date_entered from LU.discussions 
					inner join LU.enrolled on enrolled.cid = discussions.cid
					inner join LU.classes on enrolled.cid = classes.cid
					inner join LU.users on enrolled.idusers = users.idusers
					where 	enrolled.idusers = ? and 
							enrolled.idusers != discussions.idusers and
        					date_entered >= DATE_SUB(CURDATE(), INTERVAL 10 DAY)
					order by date_entered;";
	$statement = $DB->prepare($query);
	$statement->bindValue(1, $userid);	
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	foreach ($result as $row) {
		$notifications[] = array(	'classnumber' => $row['classnumber'], 
									'firstname' => $row['firstname'],
									'content' => $row['content'],
									'date_entered' => $row['date_entered']);
	}
	echo json_encode($notifications);
}

function getAssignmentNQuiz($userid, $DB){
	$notifications = array();
	$query = "SELECT classes.classnumber, popupassignment.title, popupassignment.duedate FROM LU.popupassignment 
				LEFT JOIN LU.enrolled on LU.enrolled.cid = LU.popupassignment.cid 
				LEFT JOIN LU.classes on  LU.classes.cid = LU.popupassignment.cid
				WHERE LU.enrolled.idusers = ? 
				AND
					LU.popupassignment.duedate >= DATE(now())
				AND
				    LU.popupassignment.duedate <= DATE_ADD(DATE(now()), INTERVAL 2 WEEK);";
	$statement = $DB->prepare($query);
	$statement->bindValue(1, $userid);	
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	foreach ($result as $row) {
		$notifications[] = array(	'title' => $row['title'], 
									'duedate' => $row['duedate'],
									'classnumber' => $row['classnumber']);
	}


	echo json_encode($notifications);
}

?>