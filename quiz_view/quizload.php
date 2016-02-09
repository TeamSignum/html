<?php

session_start();
$cid = $_SESSION['classid'];
$nid = 1;

if(isset($_POST["load"]))
{
	try
	{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();
		
		$query = "SELECT * FROM questions WHERE cid='$cid' AND nid='$nid'";
		
		$statement = $DB->prepare($query);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		$questions = array();
		
		foreach($result as $row)
		{
			$type = $row["type"];
			$question = $row["question"];
			if(strcmp($type, "mc") == 0)
			{
				$a = $row["a"];
				$b = $row["b"];
				$c = $row["c"];
				$questions[] = array('type' => $type, 'question' => $question, 'a' => $a, 'b' => $b, 'c' => $c);
			}
			else
			{
				$questions[] = array('type' => $type, 'question' => $question);
			}
		}
		
		echo json_encode($questions);
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}
?>