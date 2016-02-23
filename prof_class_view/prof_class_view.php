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

if(isset($_POST['nperc']))
{
	$cid = $_SESSION['classid'];
	
	$nids = $_POST['nperc'];
	
	$percents = array();
	
	foreach($nids as $n)
	{
		$nid = $n;
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			$query = "SELECT COUNT(*) as tnodes FROM nodes2 WHERE nodes2.cid='$cid' AND nodes2.nid='$nid'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			$tnodes = $result['tnodes'];
			
			$query = "SELECT COUNT(*), idusers FROM completed WHERE completed.cid='$cid' AND completed.nid='$nid' GROUP BY idusers HAVING COUNT(*)='$tnodes'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result2 = $statement->fetchAll(PDO::FETCH_ASSOC);
			
			$count = count($result2);
			
			$percents[] = array('nid' => $nid, 'count' => $count);
		}
		catch(PDOException $e)
		{
			echo $e-getMessage();
		}
	}
	
	echo json_encode($percents);
}

if(isset($_POST['enrolled']))
{
	if($_POST['enrolled'] == 1)
	{
		$cid = $_SESSION['classid'];
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			$query = "SELECT COUNT(*) as etotal FROM enrolled WHERE enrolled.cid = '$cid'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			$etotal = $result['etotal'];
			
			echo $etotal;
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}
}

if(isset($_POST['nstats']))
{
	$cid = $_SESSION['classid'];
	$nid = $_POST['nstats'];
	
	try
	{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
		$query = "SELECT nid2,title FROM nodes2 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid'";
			
		$statement = $DB->prepare($query);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		$stats = array();
		
		foreach($result as $r)
		{
			$nid2 = $r['nid2'];
			$title = $r['title'];
			
			$query = "SELECT COUNT(*) as ctotal FROM completed WHERE completed.cid='$cid' AND completed.nid='$nid' AND completed.nid2='$nid2'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result2 = $statement->fetch(PDO::FETCH_ASSOC);
			
			$ctotal = $result2['ctotal'];
			
			$stats[] = array('nid2' => $nid2, 'title' => $title, 'ctotal' => $ctotal);
		}
		
		$tnodes = count($result);
		
		$query = "SELECT COUNT(*), idusers FROM completed WHERE completed.cid='$cid' AND completed.nid='$nid' GROUP BY idusers HAVING COUNT(*)='$tnodes'";
			
		$statement = $DB->prepare($query);
		$statement->execute();
		$result3 = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		$tcomplete = count($result3);
		
		$stats[] = array('nid2' => "-1", 'title' => "", 'ctotal' => $tcomplete);
		
		echo json_encode($stats);
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}

if(isset($_POST['direct']))
{
	$_SESSION['nid'] = $_POST['direct'];
	echo "1";
}
?>