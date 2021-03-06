<?php

// Uploads lecture notes and saves the path to the database.

session_start();

include '../../imports/ChromePhp.php';

try{

	$cid = $_SESSION['classid'];
	$nid = $_POST['nid'];
	$level = $_POST['level'];
	$pnid = $_SESSION['nid'];

	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$statement;

	if($level == 1){
		$query = "SELECT lecturenotes.name, lecturenotes.path FROM `lecturenotes` WHERE lecturenotes.cid = ? AND lecturenotes.nid = ? AND lecturenotes.level = ? AND lecturenotes.pnid = ?";
		$statement = $DB->prepare($query);
		$statement->bindParam(1, $cid);
		$statement->bindParam(2, $nid);
		$statement->bindParam(3, $level);
		$statement->bindParam(4, $pnid);

	}
	else{
		$query = "SELECT lecturenotes.name, lecturenotes.path FROM `lecturenotes` WHERE lecturenotes.cid = ? AND lecturenotes.pnid = ?";
		$statement = $DB->prepare($query);
		$statement->bindParam(1, $cid);
		$statement->bindParam(2, $nid);
	}

	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	$lecturenotes = array();

	foreach($result as $row)
	{
		$name = $row['name'];
		$path = $row['path'];

		$lecturenotes[] = array('name' => $name, 'path' => $path);
	}

	echo json_encode($lecturenotes);
}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>