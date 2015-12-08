<?php
	if(isset($_POST["map"]) && isset($_POST["edges"]))
	{
		$map = $_POST["map"];
		$edges = $_POST["edges"];
		$c = count($edges);
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
			
			//$r .= $top . " " . $left . " " . $radius . " " . $fill . " " . $stroke . " " . $strokeWidth . " " . $id;
			
			try
			{
				$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
				$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$DB->beginTransaction();
			
				$query = "INSERT into `nodes` (`top`, `left`, `radius`, `fill`, `stroke`, `strokeWidth`) values (?,?,?,?,?,?)";
				//$query = "INSERT into nodes (top, left) values (?,?)";
			
				$statement = $DB->prepare($query);
				
				$statement->bindValue (1, $top);
				$statement->bindValue (2, $left);
				$statement->bindValue (3, $radius);
				$statement->bindValue (4, $fill);
				$statement->bindValue (5, $stroke);
				$statement->bindValue (6, $strokeWidth);
				
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
			catch(Exception $e)
			{
				echo $e->getMessage();
			}
			echo $r;
		}
		
		foreach($edges as $line)
		{
			$x1 = $line["x1"];
			$y1 = $line["y1"];
			$x2 = $line["x2"];
			$y2 = $line["y2"];
			$type = $line["type"];
			
			//$r .= $x1 . " " . $y1 . " " . $x2 . " " . $y2;
			
			//echo $r;
			
			try
			{
				$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
				$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$DB->beginTransaction();
			
				$query = "INSERT into `edges` (`x1`, `y1`, `x2`, `y2`, `type`) values (?,?,?,?,?)";
			
				$statement = $DB->prepare($query);
				
				$statement->bindValue (1, $x1);
				$statement->bindValue (2, $y1);
				$statement->bindValue (3, $x2);
				$statement->bindValue (4, $y2);
				$statement->bindValue (5, $type);
				
				$statement->execute();
				$DB->commit();
			}
			catch(Exception $e)
			{
				echo $e->getMessage();
			}
		}
		
	}
	//$test = 123;
	//echo $test;
?>