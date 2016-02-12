<?php

session_start();

if(isset($_POST['pnodes']))
{
	$cid = $_SESSION['classid'];
	$nid = $_SESSION['nid'];
	
	$nid2s = $_POST['pnodes'];
	
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

?>