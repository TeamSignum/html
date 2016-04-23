<?php

include '../../imports/ChromePhp.php';

session_start();

try{

	// Loads a node pop up. A node pop up has an nid, a classid, and a type. 
	$nid = $_POST["nid"];
	$cid = $_SESSION["classid"];
	$type = $_POST["type"];
	$classOrConcept = $_POST["classOrConcept"];

	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// If the node type is concept load the pop up from the concept table.
	if($type == "concept"){
		// if in the class view.
		if($classOrConcept == 0){
			$query1 = "SELECT * FROM `popupconcept` WHERE `nid` = ? AND `cid` = ?";
			
			$statement1 = $DB->prepare($query1);
			$statement1->bindParam(1, $nid);
			$statement1->bindParam(2, $cid);

			$query2 = "SELECT * FROM nodes
					   WHERE nid = ? and cid = ?";

			$statement2 = $DB->prepare($query2);
			$statement2->bindParam(1, $nid);
			$statement2->bindParam(2, $cid);
		}
		else{
			$nidd = $_SESSION['nid'];
			$nid2 = $nid;
			
			$query1 = "SELECT * FROM `popupconcept2` WHERE `nid` = ? AND `nid2` = ? AND `cid` = ?";
			
			$statement1 = $DB->prepare($query1);
			$statement1->bindParam(1, $nidd);
			$statement1->bindParam(2, $nid2);
			$statement1->bindParam(3, $cid);

			$query2 = "SELECT * FROM `nodes2` WHERE `nid` = ? AND `nid2` = ? AND `cid` = ?";
			
			$statement2 = $DB->prepare($query2);
			$statement2->bindParam(1, $nidd);
			$statement2->bindParam(2, $nid2);
			$statement2->bindParam(3, $cid);
		}
	}
	// If the node type is assignment load pop up from assignmen popup table.
	else if($type == "assignment"){
		$nidd = $_SESSION['nid'];
		$nid2 = $nid;
	
		$query1 = "SELECT * FROM `popupassignment` WHERE `nid` = ? AND `nid2` = ? AND `cid` = ?";
		
		$statement1 = $DB->prepare($query1);
		$statement1->bindParam(1, $nidd);
		$statement1->bindParam(2, $nid2);
		$statement1->bindParam(3, $cid);

		$query2 = "SELECT * FROM `nodes2` WHERE `nid` = ? AND `nid2` = ? AND `cid` = ?";
			
		$statement2 = $DB->prepare($query2);
		$statement2->bindParam(1, $nidd);
		$statement2->bindParam(2, $nid2);
		$statement2->bindParam(3, $cid);
	}
	// Otherwise type is quiz and load pop up from quiz table.
	else{
		$nidd = $_SESSION['nid'];
		$nid2 = $nid;
		
		$query1 = "SELECT * FROM `popupquiz` WHERE `nid` = ? AND `nid2` = ? AND `cid` = ?";
		
		$statement1 = $DB->prepare($query1);
		$statement1->bindParam(1, $nidd);
		$statement1->bindParam(2, $nid2);
		$statement1->bindParam(3, $cid);

		$query2 = "SELECT * FROM `nodes2` WHERE `nid` = ? AND `nid2` = ? AND `cid` = ?";
			
		$statement2 = $DB->prepare($query2);
		$statement2->bindParam(1, $nidd);
		$statement2->bindParam(2, $nid2);
		$statement2->bindParam(3, $cid);
	}

	// Exectue queries
	$statement1->execute();
	$statement2->execute();

	// Gather result
	$result1 = $statement1->fetch(PDO::FETCH_ASSOC);
	$result2 = $statement2->fetch(PDO::FETCH_ASSOC);

	// Configure result for concept pop up;
	if($type == "concept"){
		$title = $result1['title'];
		$description = $result1['description'];
		$duedate = $result1['duedate'];
		$availabledate = $result2['availableDate'];
		$notes = $result1['notes'];

		$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'availabledate' => $availabledate, 'notes' => $notes);  

		echo json_encode($popup);
	}
	// Configure result for assignment popup
	else if($type == "assignment"){
		$title = $result1['title'];
		$description = $result1['description'];
		$duedate = $result1['duedate'];
		$availabledate = $result2['availableDate'];
		$notes = $result1['notes'];

		$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'availabledate' => $availabledate, 'notes' => $notes);  

		echo json_encode($popup);
	}
	// Configure result for quiz popup.
	else{
		$title = $result1['title'];
		$description = $result1['description'];
		$duedate = $result1['duedate'];
		$availabledate = $result2['availableDate'];
		$notes = $result1['notes'];

		$popup = array('title' => $title, 'description' => $description, 'duedate' => $duedate, 'availabledate' => $availabledate, 'notes' => $notes);  

		echo json_encode($popup);
	}
}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>