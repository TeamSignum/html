<?php
	if(isset($_POST["map"]) && isset($_POST["edges"]))
	{
		$map = $_POST["map"];
		$edges = $_POST["edges"];
		$c = count($edges);
		echo $c;
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
			
			$r .= $x1 . " " . $y1 . " " . $x2 . " " . $y2;
			
			echo $r;
		}
		
	}
	//$test = 123;
	//echo $test;
?>