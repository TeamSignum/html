<?php

session_start();

if(isset($_POST['pnodes']))
{
	$cid = $_SESSION['classid'];
	
	$nids = $_POST['pnodes'];
	
	$participants = array();
	
	foreach($nids as $n)
	{
		$nid = $n;
	
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			$query = "SELECT SUM(participants)as psum FROM nodes2 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			$count = $result['psum'];
			
			$participants[] = array('nid' => $nid, 'count' => $count);
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}
	echo json_encode($participants);
}
?>