<?php

include '../../imports/ChromePhp.php';

if(isset($_POST['func']) && !empty($_POST['func'])) {
    $func = $_POST['func'];
    $pid  = $_POST['pid'];
    switch($func) {
        case 1 : 
        	GetNotifications($pid);
        	break;
    }
}

function GetNotifications($person_id){
	try
	{
		$notifications = array();

		// Setup connection 
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		// Prepare query
		$query = "SELECT * FROM LU.grades WHERE `idusers` = '$person_id' AND `date_entered` >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";

		$statement = $DB->prepare($query);
		$statement->bindParam(1, $person_id);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		foreach($result as $row)
		{
			$score = $row['score']; 
			$notifications[] = array('score' => $score);
		}

		echo json_encode($notifications);
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}

?>