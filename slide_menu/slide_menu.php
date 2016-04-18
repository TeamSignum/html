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
	$query = "SELECT cid, title, score, date_entered FROM LU.grades 
				left join LU.popupassignment on grades.idassignment = popupassignment.idassignment 
				where idusers = ? and date_entered >= DATE_SUB(CURDATE(), INTERVAL 10 DAY)
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
	$query = "SELECT classes.classnumber, popupassignment.title, popupassignment.duedate FROM LU.popupassignment 
				LEFT JOIN LU.enrolled on LU.enrolled.cid = LU.popupassignment.cid 
				LEFT JOIN LU.classes on  LU.classes.cid = LU.popupassignment.cid
				WHERE LU.enrolled.idusers = ? 
				AND
					LU.popupassignment.duedate >= DATE_SUB(curdate(), INTERVAL 10 day);";
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
	$query = "select users.firstname, classes.classnumber, professor_notification.message, professor_notification.date_entered 
				from LU.enrolled 
				inner join LU.professor_notification on LU.enrolled.cid = LU.professor_notification.cid
				inner join LU.users on professor_notification.idusers = users.idusers
				inner join LU.classes on classes.cid = professor_notification.cid
				where 
					LU.users.role = 'student'
				AND 
					LU.professor_notification.date_entered >= DATE_SUB(curdate(), INTERVAL 10 day)
				group by LU.professor_notification.pnid;";
	$statement = $DB->prepare($query);
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