<?php
	session_start();
	$cid = $_SESSION['classid'];

	include '../imports/ChromePhp.php';

	if(isset($_POST["map"]))
	{
		$map = $_POST["map"];
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
			
				$query = "INSERT into `nodes` (`cid`, `nid`, `top`, `left`, `radius`, `fill`, `stroke`, `strokeWidth`, `type`, `title`) values (?,?,?,?,?,?,?,?,?,?)";

				ChromePhp::log($query);
			
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
			
				$query = "INSERT into `edges` (`cid`, `eid`, `x1`, `y1`, `x2`, `y2`, `type`) values (?,?,?,?,?,?,?)";
			
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
			catch(Exception $e)
			{
				echo $e->getMessage();
			}
		}
	}
	
	if(isset($_POST["connections"]))
	{
		$connections = $_POST['connections'];
		
		foreach($connections as $connection)
		{
			$nid = $connection['nid'];
			$con = $connection['con'];
			foreach($con as $c)
			{
				$eid = $c;
				
				try
				{
					$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
					$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
					$DB->beginTransaction();
			
					$query = "INSERT into `connected` (`cid`, `nid`, `eid`) values (?,?,?)";
					
					$statement = $DB->prepare($query);
				
					$statement->bindValue (1, $cid);
					$statement->bindValue (2, $nid);
					$statement->bindValue (3, $eid);
					
					$statement->execute();
					$DB->commit();
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
		if($id == 1)
		{
			try
			{
				$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
				$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				
				//
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
			catch(PDOException $e)
			{
				echo $e->getMessage();
			}
		}
	}
?>