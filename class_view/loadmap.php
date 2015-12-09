<?php

if(isset($_POST["map"]))
{
	$map = $_POST["map"];
	
	if($map == 1)
	{
		//echo "y";
		
		try{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			//$DB->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
			//$DB->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
			
			$query = "SELECT * FROM nodes";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
			
			$nodes = array();
			
			foreach($result as $row)
			{
				$id = $row['nid']; 
				$top = $row['top'];
				$left = $row['left'];
				$radius = $row['radius'];
				$type = $row['type'];
				$title = $row['title'];
				$nodes[] = array('id' => $id, 'top' => $top, 'left' => $left, 'radius' => $radius, 'type' => $type, 'title' => $title);
				//echo $top;
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
			//$DB->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
			//$DB->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
			
			$query = "SELECT * FROM edges";
			
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
			
			$edges = array();
			
			foreach($result as $row)
			{
				$x1 = $row['x1'];
				$y1 = $row['y1'];
				$x2 = $row['x2'];
				$y2 = $row['y2'];
				$type = $row['type'];
				$edges[] = array('x1' => $x1, 'y1' => $y1, 'x2' => $x2, 'y2' => $y2, 'type' => $type);
			}
			
			echo json_encode($edges);
		}
		catch(PDOException $e){
			echo $e->getMessage();
		}
	}
}

?>