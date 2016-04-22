<?php
//Learning Universe
//PHP for prof_class_view.js

session_start();

//Get the total number of students working on a node
if(isset($_POST['pnodes']))
{
	$cid = $_SESSION['classid'];
	
	$nids = $_POST['pnodes'];
	
	$participants = array();
	
	//Loop through each node
	foreach($nids as $n)
	{
		$nid = $n;
	
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			//Select the sum of participants from all of the nodes 
			$query = "SELECT SUM(participants)as psum FROM nodes2 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			$count = $result['psum'];
			
			//Convert participants to JSON format
			$participants[] = array('nid' => $nid, 'count' => $count);
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}
	echo json_encode($participants);
}

//Get the number of students who have completed each node
if(isset($_POST['nperc']))
{
	$cid = $_SESSION['classid'];
	
	$nids = $_POST['nperc'];
	
	$percents = array();
	
	//Loop through each node
	foreach($nids as $n)
	{
		$nid = $n;
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			//Select the total number of nodes within the concept node
			$query = "SELECT COUNT(*) as tnodes FROM nodes2 WHERE nodes2.cid='$cid' AND nodes2.nid='$nid'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			
			$tnodes = $result['tnodes'];
			
			//Select the number of students who have completed the node
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

//Get the total number of students enrolled in the class
if(isset($_POST['enrolled']))
{
	if($_POST['enrolled'] == 1)
	{
		$cid = $_SESSION['classid'];
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			//Count the total number of students
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

//Get the completion stats for a specific node for the google chart
if(isset($_POST['nstats']))
{
	$cid = $_SESSION['classid'];
	$nid = $_POST['nstats'];
	
	try
	{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
		//Select the nodes id and title
		$query = "SELECT nid2,title FROM nodes2 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid'";
			
		$statement = $DB->prepare($query);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		$stats = array();
		
		//Loop through each node within the concept node
		foreach($result as $r)
		{
			$nid2 = $r['nid2'];
			$title = $r['title'];
			
			//Select the count of students who have completed the node
			$query = "SELECT COUNT(*) as ctotal FROM completed WHERE completed.cid='$cid' AND completed.nid='$nid' AND completed.nid2='$nid2'";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result2 = $statement->fetch(PDO::FETCH_ASSOC);
			
			$ctotal = $result2['ctotal'];
			
			$stats[] = array('nid2' => $nid2, 'title' => $title, 'ctotal' => $ctotal);
		}
		
		$tnodes = count($result);
		
		//Select the count of students who have fully completed all of the nodes within the concept node
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

//Set the nid for navigation
if(isset($_POST['direct']))
{
	$_SESSION['nid'] = $_POST['direct'];
	echo "1";
}
?>