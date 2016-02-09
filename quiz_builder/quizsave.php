<?php

session_start();

$cid = $_SESSION['classid'];
$nid = 1;


if(isset($_POST["questions"]))
{
	$questions = $_POST["questions"];
	
	try
	{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();
		
		$query = "DELETE from `questions` WHERE cid='$cid' AND nid='$nid'";
		
		$statement = $DB->prepare($query);
		$statement->execute();
		$DB->commit();
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
	
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
			
			$query = "INSERT into `questions` (`cid`, `nid`, `type`, `question`, `answer`, `a`, `b`, `c`) values (?,?,?,?,?,?,?,?)";

			$statement = $DB->prepare($query);
			
			$statement->bindValue (1, $cid);
			$statement->bindValue (2, $nid);
			$statement->bindValue (3, $type);
			$statement->bindValue (4, $question);
			$statement->bindValue (5, $answer);
			$statement->bindValue (6, $a);
			$statement->bindValue (7, $b);
			$statement->bindValue (8, $c);
			
			$statement->execute();
			$DB->commit();
		}
		catch(PDOException $e2)
		{
			echo $e2->getMessage();
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