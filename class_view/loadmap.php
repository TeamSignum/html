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
				$top = $row['top'];
				$left = $row['left'];
				$nodes[] = array('top' => $top, 'left' => $left);
				//echo $top;
			}
			
			echo json_encode($nodes);
		}
		catch(PDOException $e){
			echo $e->getMessage();
		}
	}
}

?>