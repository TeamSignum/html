<?php

include '../../imports/ChromePhp.php';

session_start();

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
	$cid     = $_SESSION['classid'];
	$idusers = $_SESSION['idusers'];

	try{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$query = "SELECT * FROM discussions WHERE discussions.nid = ? AND discussions.cid = ? ORDER BY discussions.level";

		$statement = $DB->prepare($query);
		$statement->bindParam(1, $nid);
		$statement->bindParam(2, $cid);
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
			$parent  = $row['parent'];

			$discussions[] = array('id' => $id, 'nid' => $nid, 'idusers' => $idusers, 'level' => $level, 'content' => $content,
				'parent' => $parent);
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
	$cid     = $_SESSION['classid'];
	$idusers = $_SESSION['idusers'];

	try
	{
		// Setup connection
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();

		// Create Query
		$query = "INSERT INTO `discussions` (`nid`, `cid`, `idusers`, `level`, `content`, `parent`) values (?,?,?,?,?,?)";
		$statement = $DB->prepare($query);

		// Bind Values
		$statement->bindValue (1, $nid);
		$statement->bindValue (2, $cid);
		$statement->bindValue (3, $idusers);
		$statement->bindValue (4, $level);
		$statement->bindValue (5, $content);
		$statement->bindValue (6, $parent);

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