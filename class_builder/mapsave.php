<?php
	if(isset($_POST["map"]))
	{
		$map = $_POST["map"];
		
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
			
				$query = "INSERT into `nodes` (`nid`, `top`, `left`, `radius`, `fill`, `stroke`, `strokeWidth`, `type`, `title`) values (?,?,?,?,?,?,?,?,?)";
				//$query = "INSERT into nodes (top, left) values (?,?)";
			
				$statement = $DB->prepare($query);
				
				$statement->bindValue (1, $id);
				$statement->bindValue (2, $top);
				$statement->bindValue (3, $left);
				$statement->bindValue (4, $radius);
				$statement->bindValue (5, $fill);
				$statement->bindValue (6, $stroke);
				$statement->bindValue (7, $strokeWidth);
				$statement->bindValue (8, $type);
				$statement->bindValue (9, $title);
				
				$statement->execute();
				$DB->commit();
				
				// Connects to local mongo db
				//$db = new Mongo();
				
				// Select the DB
				//$db = $db->ludb;
				
				// Select a collection
				//$collection = $db->nodes;
				
				// Create insert array
				//$in = array("top" => $top, 
								//"left" => $left, 
								//"radius" => $radius, 
								//"fill" => $fill, 
								//"stroke" => $stroke,
								//"strokeWidth" => $strokeWidth,
								//"id" => $id);

				// Insert it into collection. 
				//$collection->insert($in);
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
		
		foreach($edges as $line)
		{
			$x1 = $line["x1"];
			$y1 = $line["y1"];
			$x2 = $line["x2"];
			$y2 = $line["y2"];
			$type = $line["type"];
			$id = $line["id"];
			
			//$r .= $x1 . " " . $y1 . " " . $x2 . " " . $y2;
			
			//echo $r;
			
			try
			{
				$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
				$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$DB->beginTransaction();
			
				$query = "INSERT into `edges` (`eid`, `x1`, `y1`, `x2`, `y2`, `type`) values (?,?,?,?,?,?)";
			
				$statement = $DB->prepare($query);
				
				$statement->bindValue (1, $id);
				$statement->bindValue (2, $x1);
				$statement->bindValue (3, $y1);
				$statement->bindValue (4, $x2);
				$statement->bindValue (5, $y2);
				$statement->bindValue (6, $type);
				
				$statement->execute();
				$DB->commit();
			}
			catch(Exception $e)
			{
				echo $e->getMessage();
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
				$query = "SELECT MAX(nid) as mnid FROM nodes";
				
				$statement = $DB->prepare($query);
				$statement->execute();
				$result = $statement->fetch(PDO::FETCH_ASSOC);
				
				$mnid = $result['mnid'];
				
				//
				$query = "SELECT MAX(eid) as meid FROM edges";
				
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
	//$test = 123;
	//echo $test;
?>