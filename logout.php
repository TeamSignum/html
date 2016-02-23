<?php
session_start();

if(isset($_SESSION['email']))
{
	unset($_SESSION['email']);
	header("location: login/login.html");
	if(isset($_SESSION['currentnode']));
	{
		$cid = $_SESSION['classid'];
		$nid = $_SESSION['nid'];
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
			
			unset($_SESSION['currentnode']);
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}
}

?>