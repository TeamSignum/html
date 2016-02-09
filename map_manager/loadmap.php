<?php
session_start();

include '../imports/ChromePhp.php';

if(isset($_POST["map"]))
{
	$map = $_POST["map"];
	//$parent = $_POST["parent"];
	$cid = $_SESSION["classid"];
	$level = $_POST["level"];
	
	if($map == 1)
	{
		try{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$nodes = array();

			if($level == 2)
			{
				$nid = $_SESSION["nid"];
				$query = "SELECT * FROM nodes2 WHERE nodes2.cid = '$cid' AND nodes2.nid = '$nid'";
			}
			else
			{
				$query = "SELECT * FROM nodes WHERE nodes.cid = '$cid'";
			}
			// hardcoded for now
			//if ($parent){
			//	$query = "SELECT * FROM nodes WHERE nodes.parent = 1";
			//}
			//else{
				//$query = "SELECT * FROM nodes WHERE nodes.cid = '$cid'";
			//}

			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);

			foreach($result as $row)
			{
				if($level == 2)
				{
					$id = $row['nid2']; 
				}
				else
				{
					$id = $row['nid']; 
				}
				
				$top = $row['top'];
				$left = $row['left'];
				$radius = $row['radius'];
				$type = $row['type'];
				$title = $row['title'];
				$nodes[] = array('id' => $id, 'top' => $top, 'left' => $left, 'radius' => $radius, 'type' => $type, 'title' => $title);
			}
			
			echo json_encode($nodes);
		}
		catch(PDOException $e){
			echo $e->getMessage();
		}
	}
	if($map == 2)
	{
		try{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			if($level == 2)
			{
				$nid = $_SESSION["nid"];
				$query = "SELECT * FROM edges2 WHERE edges2.cid = '$cid' AND edges2.nid = '$nid'";
			}
			else
			{
				$query = "SELECT * FROM edges WHERE edges.cid = '$cid'";
			}
			
			//if ($parent){
				//$query = "SELECT * FROM edges WHERE edges.parent = 1";
			//}
			//else{
				//$query = "SELECT * FROM edges WHERE edges.cid = '$cid'";
			//}
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
			
			$edges = array();
			
			foreach($result as $row)
			{
				if($level == 2)
				{
					$eid = $row['eid2'];
				}
				else
				{
					$eid = $row['eid'];
				}
				
				$x1 = $row['x1'];
				$y1 = $row['y1'];
				$x2 = $row['x2'];
				$y2 = $row['y2'];
				$type = $row['type'];
				$edges[] = array('eid' => $eid, 'x1' => $x1, 'y1' => $y1, 'x2' => $x2, 'y2' => $y2, 'type' => $type);
			}
			
			echo json_encode($edges);
		}
		catch(PDOException $e){
			echo $e->getMessage();
		}
	}
	
	if($map == 3)
	{
		try{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			if($level == 2)
			{
				$nid = $_SESSION["nid"];
				$query = "SELECT * FROM connected2 WHERE connected2.cid = '$cid' AND connected2.nid = '$nid'";
			}
			else
			{
				$query = "SELECT * FROM connected WHERE connected.cid = '$cid'";
			}
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
			
			$connections = array();
			
			foreach($result as $row)
			{
				if($level == 2)
				{
					$nid = $row['nid2'];
					$eid = $row['eid2'];
				}
				else
				{
					$nid = $row['nid'];
					$eid = $row['eid'];
				}
				
				$connections[] = array('nid' => $nid, 'eid' => $eid);
			}
			
			echo json_encode($connections);
		}
		catch(PDOException $e){
			echo $e->getMessage();
		}
	}
}

?>