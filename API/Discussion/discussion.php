<?php

include '../../imports/ChromePhp.php';

session_start();
$pid = $_SESSION['pid'];

if(isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    switch($action) {
        case 'save' : 
        	SaveDiscussion();
        	break;
        case 'load' : 
        	LoadDiscussion(); 
        	break;
    }
}

function LoadDiscussion(){
	$nid = $_POST["nid"];

	try{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$query = "SELECT * FROM discussions WHERE discussions.nid = ? ORDER BY discussions.level";

		$statement = $DB->prepare($query);
		$statement->bindParam(1, $nid);
		$statement->execute();

		$results = $statement->fetchAll(PDO::FETCH_ASSOC);

		$discussions = array();

		foreach($results as $row)
		{
			$nid     = $row['nid'];
			$pid     = $row['pid'];
			$level   = $row['level'];
			$content = $row['content'];

			$discussions[] = array('nid' => $nid, 'pid' => $pid, 'level' => $level, 'content' => $content);
		}
		
		echo json_encode($discussions);
	}
	catch(PDOException $e){
		echo $e->getMessage();
	}
}

function SaveDiscussion(){
	$nid     = $_POST["nid"];
	$level   = $_POST["level"];
	$content = $_POST["content"];

	ChromePhp::Log($pid);

	try
	{
		// Setup connection
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();

		// Create Query
		$query = "INSERT INTO `discussions` (`nid`, `pid`, `level`, `content`) values (?,?,?,?)";
		$statement = $DB->prepare($query);

		// Bind Values
		$statement->bindValue (1, $nid);
		$statement->bindValue (2, $pid);
		$statement->bindValue (3, $level);
		$statement->bindValue (4, $content);

		// Execute query
		$statement->execute();
		$DB->commit();
	}

	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}
?>