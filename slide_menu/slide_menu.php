<?php 
session_start();

if(isset($_SESSION['userid'])){
   	$userid = $_SESSION['userid']; 
   
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
					$notifications = array();
					$query = "SELECT * FROM LU.grades WHERE `idusers` = '$userid' AND `date_entered` >= DATE_SUB(CURDATE(), INTERVAL 10 DAY)";
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetchAll(PDO::FETCH_ASSOC);
					foreach($result as $row)
					{
						$score = $row['score']; 
						$notifications[] = array('score' => $score);
					}
					echo json_encode($notifications);
				}else if($role=='professor'){
					$notifications = array();
					$query = "SELECT cid FROM LU.teaching WHERE `idusers` = '$userid' ";
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetchAll(PDO::FETCH_ASSOC);
					
					foreach ($result as $row => $cid) {
						//$cid = $row['cid'];
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
		}
	}	
}
else{
	echo "nope!";
}




?>