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
			case 'getStuClass':
				$query = "SELECT enrolled.cid, classes.classnumber FROM LU.enrolled INNER JOIN LU.classes ON enrolled.cid = classes.cid WHERE idusers = '$userid';";
				$statement = $DB->prepare($query);
				$statement->execute();
				$result = $statement->fetchAll(PDO::FETCH_ASSOC);
				echo json_encode($result);
				break;
			case 'getProfClass':
				$query = "SELECT teaching.cid, classes.classnumber FROM LU.teaching INNER JOIN LU.classes ON teaching.cid = classes.cid WHERE idusers = '$userid';";
				$statement = $DB->prepare($query);
				$statement->execute();
				$result = $statement->fetchAll(PDO::FETCH_ASSOC);
				echo json_encode($result);
				break;
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
					$notifications = array
						(
							getGrade($userid, $DB),
							getDiscussion($userid, $DB),
							getAssignmentNQuiz($userid, $DB),
							getProfMessage($userid, $DB)
						);
					echo(json_encode($notifications));
				}else if($role=='professor'){
					$notifications = array
						(
							getStuMessage($userid, $DB)
						);
					// How many students took the class
					// $query = "SELECT cid FROM LU.teaching WHERE `idusers` = '$userid' ";
					// $statement = $DB->prepare($query);
					// $statement->execute();
					// $result = $statement->fetchAll(PDO::FETCH_ASSOC);
					
					// foreach ($result as $row => $cid) {
					// 	$query = "SELECT count(*) FROM LU.enrolled WHERE cid = ?;";
					// 	$statement = $DB->prepare($query);
					// 	$statement->bindValue(1, $cid['cid']);
					// 	$statement->execute();
					// 	$students = $statement->fetch();
					// 	$notifications[] = array('students' => $students['count(*)']);
					// }
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
	$query = "SELECT p.title, a.grade, c.classnumber, a.date_entered
				FROM users u
				INNER JOIN assignments a
					ON u.idusers = a.idusers 
				INNER JOIN popupassignment p
					ON a.cid = p.cid AND a.nid = p.nid AND a.nid2 = p.nid2
				INNER JOIN classes c
					ON a.cid = c.cid
				WHERE a.idusers = ?
				AND
				p.duedate >= DATE_SUB(curdate(), INTERVAL 7 day)
				UNION
				SELECT p.title, q.grade, c.classnumber, q.tdate 
				FROM users u
				JOIN quizzes q
					ON u.idusers = q.idusers 
				JOIN popupquiz p
					ON q.cid = p.cid AND q.nid = p.nid AND q.nid2 = q.nid2
				INNER JOIN classes c
					ON q.cid = c.cid
				WHERE q.idusers = ?
				AND
				p.duedate >= DATE_SUB(curdate(), INTERVAL 7 day);";
	$statement = $DB->prepare($query);
	$statement->bindValue(1, $userid);
	$statement->bindValue(2, $userid);	
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	foreach($result as $row)
	{
		$title = $row['title'];
		$grade = $row['grade'];
		$classnumber = $row['classnumber'];
		$date_entered = $row['date_entered'];
		
		$notifications[] = array('title' => $title, 'grade' => $grade, 'classnumber' => $classnumber, 'date_entered' => $date_entered );

	}
	
	return $notifications; 
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
	
	return $notifications;
}

function getAssignmentNQuiz($userid, $DB){
	$notifications = array();
	$query = "SELECT p.title, c.classnumber, p.duedate
			FROM users u
			INNER JOIN assignments a
				ON u.idusers = a.idusers 
			INNER JOIN popupassignment p
				ON a.cid = p.cid AND a.nid = p.nid AND a.nid2 = p.nid2
			INNER JOIN enrolled e
				on e.cid = p.cid
			INNER JOIN classes c
				ON a.cid = c.cid
			WHERE a.idusers = 134
			AND
			p.duedate >= DATE_SUB(curdate(), INTERVAL 7 day)
			UNION
			SELECT p.title, c.classnumber, p.duedate
			FROM users u
			JOIN quizzes q
				ON u.idusers = q.idusers 
			JOIN popupquiz p
				ON q.cid = p.cid AND q.nid = p.nid AND q.nid2 = q.nid2
			INNER JOIN enrolled e
				on e.cid = p.cid
			INNER JOIN classes c
				ON q.cid = c.cid
			WHERE q.idusers = 134
			AND
			p.duedate >= DATE_SUB(curdate(), INTERVAL 7 day);";
	$statement = $DB->prepare($query);
	$statement->bindValue(1, $userid);	
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	foreach ($result as $row) {
		$notifications[] = array(	'title' => $row['title'], 
									'duedate' => $row['duedate'],
									'classnumber' => $row['classnumber']);
	}


	return $notifications;
}

function getProfMessage($userid, $DB){
	$notifications = array();
	$query = "select users.firstname, classes.classnumber, professor_notification.message, professor_notification.date_entered 
				from LU.enrolled 
				inner join LU.professor_notification on LU.enrolled.cid = LU.professor_notification.cid
				inner join LU.users on professor_notification.idusers = users.idusers
				inner join LU.classes on classes.cid = professor_notification.cid
				where LU.enrolled.idusers = ? 
				AND 
					LU.users.role = 'professor'
				AND 
					LU.professor_notification.date_entered >= DATE_SUB(curdate(), INTERVAL 10 day);";
	$statement = $DB->prepare($query);
	$statement->bindValue(1, $userid);	
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	foreach ($result as $row) {
		$notifications[] = array(	'author_name' => $row['firstname'],
									'class_number' => $row['classnumber'],
									'message' => $row['message'],
									'send_date' => $row['date_entered']);
	}

	return $notifications;
}

function getStuMessage($userid, $DB){
	$notifications = array();

	$query = "select u.firstname, c.classnumber, pn.message,  pn.date_entered
			from teaching t 
			inner join professor_notification pn
				on t.cid = pn.cid 
			inner join users u
				on pn.idusers = u.idusers
			inner join classes c
				on c.cid = pn.cid
			where t.idusers = ?
			AND 
				pn.idusers != t.idusers
			AND
				pn.date_entered >= DATE_SUB(curdate(), INTERVAL 10 day);";
	$statement = $DB->prepare($query);
	$statement->bindValue(1, $userid);
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	foreach ($result as $row) {
		$notifications[] = array(	'author_name' => $row['firstname'],
									'class_number' => $row['classnumber'],
									'message' => $row['message'],
									'send_date' => $row['date_entered']);
	}
	return $notifications;	
}
?>