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

if(isset($_POST['nperc']))
{
	$cid = $_SESSION['classid'];
	$nid = $_SESSION['nid'];
	
	$nid2s = $_POST['nperc'];
	
	$percents = array();
	
	foreach($nid2s as $n)
	{
		$nid2 = $n;
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			$query = "SELECT COUNT(*) as ptotal FROM completed WHERE completed.cid='$cid' AND completed.nid='$nid' AND completed.nid2='$nid2'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			$count = $result['ptotal'];
			
			$percents[] = array('nid' => $nid2, 'count' => $count);
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
	$nid = $_SESSION['nid'];
	
	try
	{
		$nid2 = $_POST['nstats'];
	
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
		$query = "SELECT COUNT(*) as ctotal, cdate FROM completed WHERE completed.cid='$cid' AND completed.nid='$nid' AND completed.nid2='$nid2' GROUP BY cdate";
			
		$statement = $DB->prepare($query);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		$stats = array();
		
		foreach($result as $r)
		{
			$ctotal = $r['ctotal'];
			$cdate = $r['cdate'];
			
			$stats[] = array('cdate' => $cdate, 'ctotal' => $ctotal);
		}
		
		$query = "SELECT COUNT(*) as ttotal FROM completed WHERE completed.cid='$cid' AND completed.nid='$nid' AND completed.nid2='$nid2'";
			
		$statement = $DB->prepare($query);
		$statement->execute();
		$result2 = $statement->fetch(PDO::FETCH_ASSOC);
		
		$ttotal = $result2['ttotal'];
		
		$stats[] = array('cdate' => "-1", 'ctotal' => $ttotal);
		
		echo json_encode($stats);
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}

if(isset($_POST["directa"]))
{
	$_SESSION["nid2a"] = $_POST["directa"];
	echo 1;
}
?>