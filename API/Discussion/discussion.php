<?php

include '../../imports/ChromePhp.php';

session_start();
$idusers = $_SESSION['idusers'];

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
			$id      = $row['iddiscussions'];
			$nid     = $row['nid'];
			$idusers = $row['idusers'];
			$level   = $row['level'];
			$content = $row['content'];

			$discussions[] = array('id' => $id, 'nid' => $nid, 'idusers' => $idusers, 'level' => $level, 'content' => $content);
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
	$parent  = $_POST["parent"];

	try
	{
		// Setup connection
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();

		// Create Query
		$query = "INSERT INTO `discussions` (`nid`, `idusers`, `level`, `content`, `parent`) values (?,?,?,?,?)";
		$statement = $DB->prepare($query);

		// Bind Values
		$statement->bindValue (1, $nid);
		$statement->bindValue (2, $idusers);
		$statement->bindValue (3, $level);
		$statement->bindValue (4, $content);
		$statement->bindValue (5, $parent);

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