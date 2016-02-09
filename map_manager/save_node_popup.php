<?php

include '../imports/ChromePhp.php';

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

	try
	{
		// Setup connection
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();

		// Create query 
		if($classOrConcept == 0){
			$query = "REPLACE INTO `popupconcept` (`nid`, `title`, `description`, `duedate`, `notes`) values (?,?,?,?,?)";
		}
		else{
			$query = "REPLACE INTO `popupconcept2` (`nid`, `title`, `description`, `duedate`, `notes`) values (?,?,?,?,?)";
		}
		$statement = $DB->prepare($query);

		$statement->bindValue (1, $nid);
		$statement->bindValue (2, $title);
		$statement->bindValue (3, $description);
		$statement->bindValue (4, $duedate);
		$statement->bindValue (5, $notes);

		// Execute query
		$statement->execute();
		$DB->commit();
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

	try
	{
		// Setup connection
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();

		$query = "REPLACE INTO `popupassignment` (`nid`, `title`, `description`, `duedate`, `notes`) values (?,?,?,?,?)";
		$statement = $DB->prepare($query);

		ChromePhp::log($query);

		$statement->bindValue (1, $nid);
		$statement->bindValue (2, $title);
		$statement->bindValue (3, $description);
		$statement->bindValue (4, $duedate);
		$statement->bindValue (5, $notes);

		// Execute query
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

	try
	{
		// Setup connection
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();

		// Create query 
		$query = "REPLACE INTO `popupquiz` (`nid`, `title`, `description`, `duedate`, `notes`) values (?,?,?,?,?)";
		$statement = $DB->prepare($query);

		$statement->bindValue (1, $nid);
		$statement->bindValue (2, $title);
		$statement->bindValue (3, $description);
		$statement->bindValue (4, $duedate);
		$statement->bindValue (5, $notes);

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
