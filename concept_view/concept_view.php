<?php
//Learning Universe
//PHP for concept_view.js

session_start();

//Get the total number of students working on a node
if(isset($_GET['pnodes']))
{
	$cid = $_SESSION['classid'];
	$nid = $_SESSION['nid'];
	
	$nid2s = $_GET['pnodes'];
	
	$participants = array();
	
	//Loop through each node
	foreach($nid2s as $n)
	{
		$nid2 = $n;
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			//Select the count of participants
			$query = "SELECT participants FROM nodes2 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid' AND nodes2.nid2 = '$nid2'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			$count = $result['participants'];
			
			$participants[] = array('nid' => $nid2, 'count' => $count);
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}
	
	echo json_encode($participants);
}

//Set the current node the student is working on
if(isset($_POST['setp']))
{
	$cid = $_SESSION['classid'];
	$nid = $_SESSION['nid'];

	//If student is currently working on a node switch it to the new node
	if(isset($_SESSION['currentnode']))
	{
		$nid2 = $_SESSION['currentnode'];
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$DB->beginTransaction();
			
			//Decrement the previous node's participants
			$query = "UPDATE nodes2 SET participants = participants - 1 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid' AND nodes2.nid2 = '$nid2'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$DB->commit();
			
			//Set new node
			$nid2 = $_POST['setp'];
			$_SESSION['currentnode'] = $nid2;
			
			$DB->beginTransaction();
			
			//Increment the new node's participants
			$query = "UPDATE nodes2 SET participants = participants + 1 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid' AND nodes2.nid2 = '$nid2'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$DB->commit();
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}
	//Set the node the student is currently working on
	else
	{
		try
		{
			$nid2 = $_POST['setp'];
			$_SESSION['currentnode'] = $nid2;
			
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$DB->beginTransaction();
			
			//Increment the node's participants
			$query = "UPDATE nodes2 SET participants = participants + 1 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid' AND nodes2.nid2 = '$nid2'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$DB->commit();
		}
		catch(PDOException $e2)
		{
			echo $e2->getMessage();
		}
	}
}

?>