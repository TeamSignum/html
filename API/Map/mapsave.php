<?php
//Learning Universe
//PHP for map_manager.js

	session_start();
	$cid = $_SESSION['classid'];

	include '../../imports/ChromePhp.php';

	//Save the learning map
	//Save the nodes
	if(isset($_POST["map"]))
	{
		$map = $_POST["map"];
		$level = $_POST["level"];
		
		$r = "";
		foreach($map as $node)
		{
			$top = $node["top"];
			$left = $node["left"];
			//$radius = $node["radius"];
			//$fill = $node["fill"];
			//$stroke = $node["stroke"];
			//$strokeWidth = $node["strokeWidth"];
			$id = $node["id"];
			$type = $node["type"];
			$title = $node["title"];
			//$availabledate = $node["availabledate"];
			
			try
			{
				$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
				$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$DB->beginTransaction();
			
				//Level 2 of the learning map
				if($level == 2)
				{
					//Insert the node into the database
					//$query = "REPLACE into `nodes2` (`cid`, `nid`, `nid2`, `top`, `left`, `radius`, `fill`, `stroke`, `strokeWidth`, `type`, `title`) values (?,?,?,?,?,?,?,?,?,?,?)";
					//$query = "REPLACE into `nodes2` (`cid`, `nid`, `nid2`, `top`, `left`, `type`, `title`) values (?,?,?,?,?,?,?)";
					$query = "INSERT into `nodes2` (`cid`, `nid`, `nid2`, `top`, `left`, `type`, `title`) values (:cid,:nid,:nid2,:top,:left,:type,:title)
								ON DUPLICATE KEY UPDATE `top`=:top2, `left`=:left2, `title`=:title2";
					
					$statement = $DB->prepare($query);
				
					//test hardcode
					$nid = $_SESSION['nid'];
				
					$statement->bindParam (':cid', $cid);
					$statement->bindParam (':nid', $nid);
					$statement->bindParam (':nid2', $id);
					$statement->bindParam (':top', $top);
					$statement->bindParam (':left', $left);
					//$statement->bindValue (6, $radius);
					//$statement->bindValue (7, $fill);
					//$statement->bindValue (8, $stroke);
					//$statement->bindValue (9, $strokeWidth);
					$statement->bindParam (':type', $type);
					$statement->bindParam (':title', $title);
					$statement->bindParam (':top2', $top);
					$statement->bindParam (':left2', $left);
					$statement->bindParam (':title2', $title);
					//$statement->bindValue (8, $availableDate);
				
					$statement->execute();
					$DB->commit();
				}
				//Level 1 of the learning map
				else
				{
					//Insert the node into the database
					//$query = "REPLACE into `nodes` (`cid`, `nid`, `top`, `left`, `radius`, `fill`, `stroke`, `strokeWidth`, `type`, `title`) values (?,?,?,?,?,?,?,?,?,?)";
					//$query = "REPLACE into `nodes` (`cid`, `nid`, `top`, `left`, `type`, `title`) values (?,?,?,?,?,?)";
					$query = "INSERT into `nodes` (`cid`, `nid`, `top`, `left`, `type`, `title`) values (:cid,:nid,:top,:left,:type,:title) 
							ON DUPLICATE KEY UPDATE `top`=:top2, `left`=:left2, `title`=:title2";
					
					$statement = $DB->prepare($query);
				
					$statement->bindParam (':cid', $cid);
					$statement->bindParam (':nid', $id);
					$statement->bindParam (':top', $top);
					$statement->bindParam (':left', $left);
					//$statement->bindValue (5, $radius);
					//$statement->bindValue (6, $fill);
					//$statement->bindValue (7, $stroke);
					//$statement->bindValue (8, $strokeWidth);
					$statement->bindParam (':type', $type);
					$statement->bindParam (':title', $title);
					$statement->bindParam (':top2', $top);
					$statement->bindParam (':left2', $left);
					$statement->bindParam (':title2', $title);
					//$statement->bindValue (7, $availableDate);
				
					$statement->execute();
					$DB->commit();
				}
			}
			catch(PDOException $e)
			{
				echo $e->getMessage();
			}
		}
	}
	
	//Save the edges
	if(isset($_POST["edges"]))
	{
		$edges = $_POST["edges"];
		$level = $_POST["level"];
		
		foreach($edges as $line)
		{
			$x1 = $line["x1"];
			$y1 = $line["y1"];
			$x2 = $line["x2"];
			$y2 = $line["y2"];
			$type = $line["type"];
			$id = $line["id"];
			
			try
			{
				$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
				$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$DB->beginTransaction();
				
				//Level 2 of the learning map
				if($level == 2)
				{
					//Insert line into the DB
					$query = "REPLACE into `edges2` (`cid`, `nid`, `eid2`, `x1`, `y1`, `x2`, `y2`, `type`) values (?,?,?,?,?,?,?,?)";
			
					$statement = $DB->prepare($query);
					
					$nid = $_SESSION['nid'];
				
					$statement->bindValue (1, $cid);
					$statement->bindValue (2, $nid);
					$statement->bindValue (3, $id);
					$statement->bindValue (4, $x1);
					$statement->bindValue (5, $y1);
					$statement->bindValue (6, $x2);
					$statement->bindValue (7, $y2);
					$statement->bindValue (8, $type);
				
					$statement->execute();
					$DB->commit();
				}
				//Level 1 of the learning map
				else
				{
					//Insert line into the DB
					$query = "REPLACE into `edges` (`cid`, `eid`, `x1`, `y1`, `x2`, `y2`, `type`) values (?,?,?,?,?,?,?)";
			
					$statement = $DB->prepare($query);
				
					$statement->bindValue (1, $cid);
					$statement->bindValue (2, $id);
					$statement->bindValue (3, $x1);
					$statement->bindValue (4, $y1);
					$statement->bindValue (5, $x2);
					$statement->bindValue (6, $y2);
					$statement->bindValue (7, $type);
					//$statement->bindValue (7, $type);
				
					$statement->execute();
					$DB->commit();
				}
			}
			catch(Exception $e)
			{
				echo $e->getMessage();
			}
		}
	}
	
	//Save node/line connections
	if(isset($_POST["connections"]))
	{
		$connections = $_POST['connections'];
		$level = $_POST["level"];
		
		foreach($connections as $connection)
		{
			$id = $connection['nid'];
			$con = $connection['con'];
			foreach($con as $c)
			{
				$eid = $c['eid'];
				$side = $c['side'];
				
				try
				{
					$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
					$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
					$DB->beginTransaction();
					
					//Level 2 of the learning map
					if($level == 2)
					{
						//Insert connection into the DB
						$query = "REPLACE into `connected2` (`cid`, `nid`, `nid2`, `eid2`, `side`) values (?,?,?,?,?)";
					
						$statement = $DB->prepare($query);
						
						$nid = $_SESSION['nid'];
					
						$statement->bindValue (1, $cid);
						$statement->bindValue (2, $nid);
						$statement->bindValue (3, $id);
						$statement->bindValue (4, $eid);
						$statement->bindValue (5, $side);
					
						$statement->execute();
						$DB->commit();
					}
					//Level 1 of the learning map
					else
					{
						//Insert connection into the DB
						$query = "REPLACE into `connected` (`cid`, `nid`, `eid`, `side`) values (?,?,?,?)";
					
						$statement = $DB->prepare($query);
				
						$statement->bindValue (1, $cid);
						$statement->bindValue (2, $id);
						$statement->bindValue (3, $eid);
						$statement->bindValue (4, $side);
					
						$statement->execute();
						$DB->commit();
					}
				}
				catch(Exception $e)
				{
					echo $e->getMessage();
				}
			}
		}
	}
	
	//Get the last id for nodes and lines
	if(isset($_POST["id"]))
	{
		$id = $_POST["id"];
		$level = $_POST["level"];
		
		if($id == 1)
		{
			try
			{
				$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
				$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				
				//Level 2 of the learning map
				if($level == 2)
				{
					$nid = $_SESSION['nid'];
				
					//Select the last node id
					$query = "SELECT MAX(nid2) as mnid FROM nodes2 WHERE cid = '$cid' AND nid = '$nid'";
				
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetch(PDO::FETCH_ASSOC);
				
					$mnid = $result['mnid'];
				
					//Select the last line id
					$query = "SELECT MAX(eid2) as meid FROM edges2 WHERE cid = '$cid' AND nid = '$nid'";
				
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetch(PDO::FETCH_ASSOC);
				
					$meid = $result['meid'];
				
					$mids = array('mnid' => $mnid, 'meid' => $meid);
				
					echo json_encode($mids);
				}
				//Level 1 of the learning map
				else
				{
					//Select the last node id
					$query = "SELECT MAX(nid) as mnid FROM nodes WHERE cid = '$cid'";
				
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetch(PDO::FETCH_ASSOC);
				
					$mnid = $result['mnid'];
				
					//Select the last line id
					$query = "SELECT MAX(eid) as meid FROM edges WHERE cid = '$cid'";
				
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetch(PDO::FETCH_ASSOC);
				
					$meid = $result['meid'];
				
					$mids = array('mnid' => $mnid, 'meid' => $meid);
				
					echo json_encode($mids);
				}
				
			}
			catch(PDOException $e)
			{
				echo $e->getMessage();
			}
		}
	}
	
	//Set node id for navigation
	if(isset($_POST["direct"]))
	{
		$_SESSION["nid"] = $_POST["direct"];
		$role = $_SESSION["role"];
		if(strcmp($role, "professor") == 0)
		{
			echo 1;
		}
		else
		{
			echo 2;
		}
	}
	
	//Set node as completed for the student
	if(isset($_POST["complete"]))
	{
		if($_POST["complete"] == 1)
		{
			$iduser = $_SESSION["userid"];
			$nid = $_SESSION["nid"];
			$nid2 = $_POST["nid2"];
			
			$date = date("Y-m-d H:i:s", time());
			
			//echo $date;
			
			try
			{
				$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
				$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$DB->beginTransaction();
				
				//Insert the completed node
				$query = "INSERT into completed (idusers,cid,nid,nid2,complete,cdate) values (?,?,?,?,?,?)";
				
				$statement = $DB->prepare($query);
					
				$statement->bindValue (1, $iduser);
				$statement->bindValue (2, $cid);
				$statement->bindValue (3, $nid);
				$statement->bindValue (4, $nid2);
				$statement->bindValue (5, 1);
				$statement->bindValue (6, $date);
					
				$statement->execute();
				$DB->commit();
			}
			catch(PDOException $e)
			{
				echo $e->getMessage();
			}
		}
	}
	
	//Deletes the node from the database
	if(isset($_POST["deleten"]))
	{
		$level = $_POST["level"];
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
			//Level 2 of the learning map
			if($level == 2)
			{
				$nid = $_SESSION["nid"];
				if(isset($_POST["cons"]))
				{
					$cons = $_POST["cons"];
					//Loop the the node's line connections
					foreach($cons as $c)
					{
						$nid2 = $c['nid'];
						$eid2 = $c['eid'];
						
						//Delete the connection
						$DB->beginTransaction();
						$query = "DELETE FROM connected2 WHERE cid='$cid' AND nid='$nid' AND nid2='$nid2' AND eid2='$eid2'";
					
						$statement = $DB->prepare($query);
						$statement->execute();
						$DB->commit();
					}
				}
				
				if(isset($_POST["dedges"]))
				{
					$dedges = $_POST["dedges"];
					//Loop the the node's lines
					foreach($dedges as $e)
					{
						//Delete the line
						$DB->beginTransaction();
						$query = "DELETE FROM edges2 WHERE cid='$cid' AND nid='$nid' AND eid2='$e'";
					
						$statement = $DB->prepare($query);
						$statement->execute();
						$DB->commit();
					}
				}
				if(isset($_POST["dnid"]))
				{
					$nid2 = $_POST["dnid"];
					
					//Delete the node
					$DB->beginTransaction();
					$query = "DELETE FROM nodes2 WHERE cid='$cid' AND nid='$nid' AND nid2='$nid2'";
					
					$statement = $DB->prepare($query);
					$statement->execute();
					$DB->commit();
				}
			}
			//Level 1 of the learning map
			if($level == 1)
			{
				if(isset($_POST["cons"]))
				{
					//Loop the the node's line connections
					$cons = $_POST["cons"];
					foreach($cons as $c)
					{
						$nid = $c['nid'];
						$eid = $c['eid'];
						
						//Delete the connection
						$DB->beginTransaction();
						$query = "DELETE FROM connected WHERE cid='$cid' AND nid='$nid' AND eid='$eid'";
					
						$statement = $DB->prepare($query);
						$statement->execute();
						$DB->commit();
					}
				}
				if(isset($_POST["dedges"]))
				{
					$dedges = $_POST["dedges"];
					//Loop the the node's lines
					foreach($dedges as $e)
					{
						//Delete the line
						$DB->beginTransaction();
						$query = "DELETE FROM edges WHERE cid='$cid' AND eid='$e'";
					
						$statement = $DB->prepare($query);
						$statement->execute();
						$DB->commit();
					}
				}
				if(isset($_POST["dnid"]))
				{
					$nid = $_POST["dnid"];
					
					//Delete connected2
					$DB->beginTransaction();
					$query = "DELETE FROM connected2 WHERE cid='$cid' AND nid='$nid'";
					
					$statement = $DB->prepare($query);
					$statement->execute();
					$DB->commit();
					
					//Delete nodes2
					$DB->beginTransaction();
					$query = "DELETE FROM nodes2 WHERE cid='$cid' AND nid='$nid'";
					
					$statement = $DB->prepare($query);
					$statement->execute();
					$DB->commit();
					
					//Delete edges2
					$DB->beginTransaction();
					$query = "DELETE FROM edges2 WHERE cid='$cid' AND nid='$nid'";
					
					$statement = $DB->prepare($query);
					$statement->execute();
					$DB->commit();
					
					//Delete node
					$DB->beginTransaction();
					$query = "DELETE FROM nodes WHERE cid='$cid' AND nid='$nid'";
					
					$statement = $DB->prepare($query);
					$statement->execute();
					$DB->commit();
				}
			}
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}
	
	//Set node id to naviagte to quiz
	if(isset($_POST["directq"]))
	{
		$_SESSION["nid2q"] = $_POST["directq"];
		$role = $_SESSION["role"];
		if(strcmp($role, "professor") == 0)
		{
			echo 1;
		}
		else
		{
			echo 2;
		}
	}
?>