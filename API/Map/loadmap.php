<?php
//Learning Universe
//PHP for map_manager.js

session_start();

include '../../imports/ChromePhp.php';

//Loads the learning map
if(isset($_POST["map"]))
{
	$map = $_POST["map"];
	//$parent = $_POST["parent"];
	$cid = $_SESSION["classid"];
	$level = $_POST["level"];
	$iduser = $_SESSION["userid"];
	
	//Load the nodes
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
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);

			//Load completion data for each node
			foreach($result as $row)
			{
				if($level == 2)
				{
					$id = $row['nid2'];
					$query = "SELECT complete FROM completed where completed.idusers='$iduser' AND completed.cid='$cid' AND completed.nid='$nid' AND completed.nid2='$id'";					
				}
				else
				{
					$id = $row['nid'];
					$query = "SELECT COUNT(*) as ctotal FROM completed where completed.idusers='$iduser' AND completed.cid='$cid' AND completed.nid='$id'";
				}
				
				$statement = $DB->prepare($query);
				$statement->execute();
				$result2 = $statement->fetch(PDO::FETCH_ASSOC);
				
				if($level == 2)
				{
					//echo $result2['complete'];
					if($result2['complete'] == 1)
						$complete = 1;
					else
						$complete = 0;
				}
				else
				{
					$query = "SELECT COUNT(*) as ntotal FROM nodes2 where nodes2.cid='$cid' AND nodes2.nid='$id'";
					$statement = $DB->prepare($query);
					$statement->execute();
					$result3 = $statement->fetch(PDO::FETCH_ASSOC);
					
					$ctotal = $result2['ctotal'];
					$ntotal = $result3['ntotal'];
					
					if($ctotal == $ntotal && $ntotal != 0)
						$complete = 1;
					else
						$complete = 0;
				}
				
				//Convert node data into JSON format
				$top = $row['top'];
				$left = $row['left'];
				$radius = $row['radius'];
				$type = $row['type'];
				$title = $row['title'];
				$fill = $row['fill'];
				$availabledate = $row['availableDate'];
				$nodes[] = array('id' => $id, 'top' => $top, 'left' => $left, 'radius' => $radius, 'type' => $type, 'title' => $title, 'fill' => $fill, 'complete' => $complete, 'availabledate' => $availabledate);
			}
			
			echo json_encode($nodes);
		}
		catch(PDOException $e){
			echo $e->getMessage();
		}
	}
	//Load the lines
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
				
				//Convert node data into JSON format
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
	//Load the node/line connections
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
			
			//Convert node data into JSON format
			foreach($result as $row)
			{
				if($level == 2)
				{
					$nid = $row['nid2'];
					$eid = $row['eid2'];
					$side = $row['side'];
				}
				else
				{
					$nid = $row['nid'];
					$eid = $row['eid'];
					$side = $row['side'];
				}
				
				$connections[] = array('nid' => $nid, 'eid' => $eid, 'side' => $side);
			}
			
			echo json_encode($connections);
		}
		catch(PDOException $e){
			echo $e->getMessage();
		}
	}
}

?>