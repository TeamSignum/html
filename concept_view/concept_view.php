<?php

session_start();

if(isset($_GET['pnodes']))
{
	$cid = $_SESSION['classid'];
	$nid = $_SESSION['nid'];
	
	$nid2s = $_GET['pnodes'];
	
	$participants = array();
	
	foreach($nid2s as $n)
	{
		$nid2 = $n;
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
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

if(isset($_POST['setp']))
{
	$cid = $_SESSION['classid'];
	$nid = $_SESSION['nid'];

	if(isset($_SESSION['currentnode']))
	{
		$nid2 = $_SESSION['currentnode'];
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$DB->beginTransaction();
			
			$query = "UPDATE nodes2 SET participants = participants - 1 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid' AND nodes2.nid2 = '$nid2'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$DB->commit();
			
			//Set new node
			$nid2 = $_POST['setp'];
			$_SESSION['currentnode'] = $nid2;
			
			$DB->beginTransaction();
			
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
	else
	{
		try
		{
			$nid2 = $_POST['setp'];
			$_SESSION['currentnode'] = $nid2;
			
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$DB->beginTransaction();
			
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