<?php

if(isset($_POST["questions"]))
{
	$questions = $_POST["questions"];
	
	foreach($questions as $q)
	{
		$type = $q["type"];
		$question = $q["question"];
		$answer = $q["answer"];
		$a = $q["a"];
		$b = $q["b"];
		$c = $q["c"];
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$DB->beginTransaction();
			
			$query = "INSERT into `questions` (`type`, `question`, `answer`, `a`, `b`, `c`) values (?,?,?,?,?,?)";

			$statement = $DB->prepare($query);
			
			$statement->bindValue (1, $type);
			$statement->bindValue (2, $question);
			$statement->bindValue (3, $answer);
			$statement->bindValue (4, $a);
			$statement->bindValue (5, $b);
			$statement->bindValue (6, $c);
			
			$statement->execute();
			$DB->commit();
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}
}

if(isset($_POST['load']))
{
	try
	{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();
			
		$query = "SELECT * FROM questions";
		
		$statement = $DB->prepare($query);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		$questions = array();
		
		foreach($result as $row)
		{
			$type = $row["type"];
			$question = $row["question"];
			$answer = $row['answer'];
			if(strcmp($type, "mc") == 0)
			{
				$a = $row["a"];
				$b = $row["b"];
				$c = $row["c"];
				$questions[] = array('type' => $type, 'question' => $question, 'answer' => $answer, 'a' => $a, 'b' => $b, 'c' => $c);
			}
			else
			{
				$questions[] = array('type' => $type, 'question' => $question, 'answer' => $answer);
			}
		}
		
		echo json_encode($questions);
	}
	catch(PDOException $e)
	{
		echo $e-getMessage();
	}
}

?>