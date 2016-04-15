<?php

include '../../imports/ChromePhp.php';

session_start();

if(isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    ChromePhp::log($action);
    switch($action) {
        case 'concept' : 
        	SaveConceptPopup();
        	break;
        case 'assignment' :
        	ChromePhp::log("Here");
        	SaveAssignmentPopup();
        	break;
        case 'quiz' : 
        	SaveQuizPopup();
        	break;
    }
}

function SaveConceptPopup(){
	$classOrConcept = $_POST["classOrConcept"];
	$nid= $_POST["nid"];
	$title= $_POST["title"];
	$description= $_POST["description"];
	$notes = $_POST["notes"];
	$duedate= $_POST["duedate"];
	$availabledate= $_POST["availabledate"];
	$cid = $_SESSION['classid'];

	try
	{
		// Setup connection
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();

		// Create query 
		if($classOrConcept == 0){
			$query = "REPLACE INTO `popupconcept` (`nid`, `cid`, `title`, `description`, `duedate`, `notes`) values (?,?,?,?,?,?)";
			
			$statement = $DB->prepare($query);

			$statement->bindValue (1, $nid);
			$statement->bindValue (2, $cid);
			$statement->bindValue (3, $title);
			$statement->bindValue (4, $description);
			$statement->bindValue (5, $duedate);
			$statement->bindValue (6, $notes);

			// Execute query
			$statement->execute();

			// Put the available date in the nid table
			$query = "UPDATE nodes 
					  SET availableDate = ?
					  WHERE cid = ? AND nid = ?";

			$statement = $DB->prepare($query);
			$statement->bindValue (1, $availabledate);
			$statement->bindValue (2, $cid);
			$statement->bindValue (3, $nid);
			
			$statement->execute();

			$DB->commit();
		}
		else{
			$nidd = $_SESSION['nid'];
			$nid2 = $nid;
		
			$query = "REPLACE INTO `popupconcept2` (`nid`, `nid2`, `cid`, `title`, `description`, `duedate`, `notes`) values (?,?,?,?,?,?,?)";
			
			$statement = $DB->prepare($query);

			$statement->bindValue (1, $nidd);
			$statement->bindValue (2, $nid2);
			$statement->bindValue (3, $cid);
			$statement->bindValue (4, $title);
			$statement->bindValue (5, $description);
			$statement->bindValue (6, $duedate);
			$statement->bindValue (7, $notes);

			// Execute query
			$statement->execute();

			// Put the available date in the nid2 table
			$query = "UPDATE nodes2 
					  SET availableDate = ?
					  WHERE cid = ? AND nid = ? AND nid2 = ?";

			$statement = $DB->prepare($query);
			$statement->bindValue (1, $availabledate);
			$statement->bindValue (2, $cid);
			$statement->bindValue (3, $nidd);
			$statement->bindValue (4, $nid2);
			
			$statement->execute();

			$DB->commit();
		}
		
	}

	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}

function SaveAssignmentPopup(){
	$nid= $_POST["nid"];
	$title= $_POST["title"];
	$description= $_POST["description"];
	$notes = $_POST["notes"];
	$duedate= $_POST["duedate"];
	$cid = $_SESSION['classid'];

	try
	{
		// Setup connection
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();

		$duedate = strtotime($duedate);
		$duedate = date("Y-m-d H:i:s", $duedate);
		
		$nidd = $_SESSION['nid'];
		$nid2 = $nid;

		$query = "REPLACE INTO `popupassignment` (`nid`, `nid2`, `cid`, `title`, `description`, `duedate`, `notes`) values (?,?,?,?,?,?,?)";
		$statement = $DB->prepare($query);

		$statement->bindValue (1, $nidd);
		$statement->bindValue (2, $nid2);
		$statement->bindValue (3, $cid);
		$statement->bindValue (4, $title);
		$statement->bindValue (5, $description);
		$statement->bindValue (6, $duedate);
		$statement->bindValue (7, $notes);

		// Execute query
		$statement->execute();

		$query = "UPDATE nodes2 
					  SET availableDate = ?
					  WHERE cid = ? AND nid = ? AND nid2 = ?";

		$statement = $DB->prepare($query);
		$statement->bindValue (1, $availabledate);
		$statement->bindValue (2, $cid);
		$statement->bindValue (3, $nidd);
		$statement->bindValue (4, $nid2);
		
		$statement->execute();
		$DB->commit();
	}

	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}

function SaveQuizPopup(){
	$nid= $_POST["nid"];
	$title= $_POST["title"];
	$description= $_POST["description"];
	$duedate= $_POST["duedate"];
	$notes= $_POST["notes"];
	$cid = $_SESSION['classid'];

	try
	{
		// Setup connection
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();

		$duedate = strtotime($duedate);
		$duedate = date("Y-m-d H:i:s", $duedate);
		
		$nidd = $_SESSION['nid'];
		$nid2 = $nid;

		// Create query 
		$query = "REPLACE INTO `popupquiz` (`nid`, `nid2`, `cid`, `title`, `description`, `duedate`, `notes`) values (?,?,?,?,?,?,?)";
		$statement = $DB->prepare($query);

		$statement->bindValue (1, $nidd);
		$statement->bindValue (2, $nid2);
		$statement->bindValue (3, $cid);
		$statement->bindValue (4, $title);
		$statement->bindValue (5, $description);
		$statement->bindValue (6, $duedate);
		$statement->bindValue (7, $notes);

		// Execute query
		$statement->execute();

		$query = "UPDATE nodes2 
					  SET availableDate = ?
					  WHERE cid = ? AND nid = ? AND nid2 = ?";

		$statement = $DB->prepare($query);
		$statement->bindValue (1, $availabledate);
		$statement->bindValue (2, $cid);
		$statement->bindValue (3, $nidd);
		$statement->bindValue (4, $nid2);
		
		$statement->execute();
		$DB->commit();
	}

	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}

?>
