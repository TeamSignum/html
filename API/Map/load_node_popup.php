<?php

include '../../imports/ChromePhp.php';

session_start();

try{

	$nid = $_POST["nid"];
	$cid = $_SESSION["classid"];
	$type = $_POST["type"];
	$classOrConcept = $_POST["classOrConcept"];

	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if($type == "concept"){
		if($classOrConcept == 0){
			$query = "SELECT * FROM `popupconcept` WHERE `nid` = ? AND `cid` = ?";
			
			$statement = $DB->prepare($query);
			$statement->bindParam(1, $nid);
			$statement->bindParam(2, $cid);
		}
		else{
			$nidd = $_SESSION['nid'];
			$nid2 = $nid;
			
			$query = "SELECT * FROM `popupconcept2` WHERE `nid` = ? AND `nid2` = ? AND `cid` = ?";
			
			$statement = $DB->prepare($query);
			$statement->bindParam(1, $nidd);
			$statement->bindParam(2, $nid2);
			$statement->bindParam(3, $cid);
		}
	}
	else if($type == "assignment"){
		$nidd = $_SESSION['nid'];
		$nid2 = $nid;
	
		$query = "SELECT * FROM `popupassignment` WHERE `nid` = ? AND `nid2` = ? AND `cid` = ?";
		
		$statement = $DB->prepare($query);
		$statement->bindParam(1, $nidd);
		$statement->bindParam(2, $nid2);
		$statement->bindParam(3, $cid);
	}
	else{
		$nidd = $_SESSION['nid'];
		$nid2 = $nid;
		
		$query = "SELECT * FROM `popupquiz` WHERE `nid` = ? AND `nid2` = ? AND `cid` = ?";
		
		$statement = $DB->prepare($query);
		$statement->bindParam(1, $nidd);
		$statement->bindParam(2, $nid2);
		$statement->bindParam(3, $cid);
	}

	$statement->execute();

	$result = $statement->fetch(PDO::FETCH_ASSOC);

	if($type == "concept"){
		$title = $result['title'];
		$description = $result['description'];
		$duedate = $result['duedate'];
		$notes = $result['notes'];

		$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'notes' => $notes);  

		echo json_encode($popup);
	}
	else if($type == "assignment"){
		$title = $result['title'];
		$description = $result['description'];
		$duedate = $result['duedate'];
		$notes = $result['notes'];

		$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'notes' => $notes);  

		echo json_encode($popup);
	}
	else{
		$title = $result['title'];
		$description = $result['description'];
		$duedate = $result['duedate'];
		$notes = $result['notes'];

		$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'notes' => $notes);  

		echo json_encode($popup);
	}
}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>