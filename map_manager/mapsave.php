<?php
	session_start();
	$cid = $_SESSION['classid'];

	include '../imports/ChromePhp.php';

	if(isset($_POST["map"]))
	{
		$map = $_POST["map"];
		$level = $_POST["level"];
		//$parent = $_POST["parent"];
		
		//$c = count($edges);
		//echo $c;
		$r = "";
		foreach($map as $node)
		{
			$top = $node["top"];
			$left = $node["left"];
			$radius = $node["radius"];
			$fill = $node["fill"];
			$stroke = $node["stroke"];
			$strokeWidth = $node["strokeWidth"];
			$id = $node["id"];
			$type = $node["type"];
			$title = $node["title"];

			//$r .= $top . " " . $left . " " . $radius . " " . $fill . " " . $stroke . " " . $strokeWidth . " " . $id;
			
			try
			{
				$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
				$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$DB->beginTransaction();
			
				if($level == 2)
				{
					$query = "REPLACE into `nodes2` (`cid`, `nid`, `nid2`, `top`, `left`, `radius`, `fill`, `stroke`, `strokeWidth`, `type`, `title`) values (?,?,?,?,?,?,?,?,?,?,?)";
					
					$statement = $DB->prepare($query);
				
					//test hardcode
					$nid = 1;
				
					$statement->bindValue (1, $cid);
					$statement->bindValue (2, $nid);
					$statement->bindValue (3, $id);
					$statement->bindValue (4, $top);
					$statement->bindValue (5, $left);
					$statement->bindValue (6, $radius);
					$statement->bindValue (7, $fill);
					$statement->bindValue (8, $stroke);
					$statement->bindValue (9, $strokeWidth);
					$statement->bindValue (10, $type);
					$statement->bindValue (11, $title);
				
					$statement->execute();
					$DB->commit();
				}
				else
				{
					$query = "REPLACE into `nodes` (`cid`, `nid`, `top`, `left`, `radius`, `fill`, `stroke`, `strokeWidth`, `type`, `title`) values (?,?,?,?,?,?,?,?,?,?)";
					
					$statement = $DB->prepare($query);
				
					$statement->bindValue (1, $cid);
					$statement->bindValue (2, $id);
					$statement->bindValue (3, $top);
					$statement->bindValue (4, $left);
					$statement->bindValue (5, $radius);
					$statement->bindValue (6, $fill);
					$statement->bindValue (7, $stroke);
					$statement->bindValue (8, $strokeWidth);
					$statement->bindValue (9, $type);
					$statement->bindValue (10, $title);
				
					$statement->execute();
					$DB->commit();
				}
			
				//$query = "REPLACE into `nodes` (`cid`, `nid`, `top`, `left`, `radius`, `fill`, `stroke`, `strokeWidth`, `type`, `title`) values (?,?,?,?,?,?,?,?,?,?)";

				//ChromePhp::log($query);
			
				//$statement = $DB->prepare($query);
				
				//$statement->bindValue (1, $cid);
				//$statement->bindValue (2, $id);
				//$statement->bindValue (3, $top);
				//$statement->bindValue (4, $left);
				//$statement->bindValue (5, $radius);
				//$statement->bindValue (6, $fill);
				//$statement->bindValue (7, $stroke);
				//$statement->bindValue (8, $strokeWidth);
				//$statement->bindValue (9, $type);
				//$statement->bindValue (10, $title);
				
				//$statement->execute();
				//$DB->commit();
			}
			catch(PDOException $e)
			{
				echo $e->getMessage();
			}
			//echo $r;
		}
	}
	
	if(isset($_POST["edges"]))
	{
		$edges = $_POST["edges"];
		//$parent = $_POST["parent"];
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
				
				if($level == 2)
				{
					$query = "REPLACE into `edges2` (`cid`, `nid`, `eid2`, `x1`, `y1`, `x2`, `y2`, `type`) values (?,?,?,?,?,?,?,?)";
			
					$statement = $DB->prepare($query);
					
					$nid = 1;
				
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
				else
				{
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
			
				//$query = "REPLACE into `edges` (`cid`, `eid`, `x1`, `y1`, `x2`, `y2`, `type`) values (?,?,?,?,?,?,?)";
			
				//$statement = $DB->prepare($query);
				
				//$statement->bindValue (1, $cid);
				//$statement->bindValue (2, $id);
				//$statement->bindValue (3, $x1);
				//$statement->bindValue (4, $y1);
				//$statement->bindValue (5, $x2);
				//$statement->bindValue (6, $y2);
				//$statement->bindValue (7, $type);
				//$statement->bindValue (7, $type);
				
				//$statement->execute();
				//$DB->commit();
			}
			catch(Exception $e)
			{
				echo $e->getMessage();
			}
		}
	}
	
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
				$eid = $c;
				
				try
				{
					$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
					$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
					$DB->beginTransaction();
					
					if($level == 2)
					{
						$query = "REPLACE into `connected2` (`cid`, `nid`, `nid2`, `eid2`) values (?,?,?,?)";
					
						$statement = $DB->prepare($query);
						
						$nid = 1;
					
						$statement->bindValue (1, $cid);
						$statement->bindValue (2, $nid);
						$statement->bindValue (3, $id);
						$statement->bindValue (4, $eid);
					
						$statement->execute();
						$DB->commit();
					}
					else
					{
						$query = "REPLACE into `connected` (`cid`, `nid`, `eid`) values (?,?,?)";
					
						$statement = $DB->prepare($query);
				
						$statement->bindValue (1, $cid);
						$statement->bindValue (2, $id);
						$statement->bindValue (3, $eid);
					
						$statement->execute();
						$DB->commit();
					}
			
					//$query = "REPLACE into `connected` (`cid`, `nid`, `eid`) values (?,?,?)";
					
					//$statement = $DB->prepare($query);
				
					//$statement->bindValue (1, $cid);
					//$statement->bindValue (2, $nid);
					//$statement->bindValue (3, $eid);
					
					//$statement->execute();
					//$DB->commit();
				}
				catch(Exception $e)
				{
					echo $e->getMessage();
				}
			}
		}
	}
	
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
				
				if($level == 2)
				{
					$nid = 1;
				
					$query = "SELECT MAX(nid2) as mnid FROM nodes2 WHERE cid = '$cid' AND nid = '$nid'";
				
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetch(PDO::FETCH_ASSOC);
				
					$mnid = $result['mnid'];
				
					$query = "SELECT MAX(eid2) as meid FROM edges2 WHERE cid = '$cid' AND nid = '$nid'";
				
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetch(PDO::FETCH_ASSOC);
				
					$meid = $result['meid'];
				
					$mids = array('mnid' => $mnid, 'meid' => $meid);
				
					echo json_encode($mids);
				}
				else
				{
					$query = "SELECT MAX(nid) as mnid FROM nodes WHERE cid = '$cid'";
				
					$statement = $DB->prepare($query);
					$statement->execute();
					$result = $statement->fetch(PDO::FETCH_ASSOC);
				
					$mnid = $result['mnid'];
				
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
	
	if(isset($_POST["direct"]))
	{
		$_SESSION["nid"] = $_POST["direct"];
		echo 1;
	}
?>