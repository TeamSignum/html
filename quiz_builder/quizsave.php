<?php
//Learning Universe
//PHP for quiz_builder.js

session_start();

$cid = $_SESSION['classid'];
$nid = $_SESSION['nid'];
$nid2 = $_SESSION['nid2q'];

//Saves quiz questions to the database
if(isset($_POST["questions"]))
{
	$questions = $_POST["questions"];
	
	//If we have duplicate questions for a quiz delete them first
	try
	{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();
		
		$query = "DELETE from `questions` WHERE cid='$cid' AND nid='$nid' AND nid2='$nid2'";
		
		$statement = $DB->prepare($query);
		$statement->execute();
		$DB->commit();
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
	
	//Loop through all the questions and insert them into the database
	foreach($questions as $q)
	{
		$qnum = $q["qnum"];
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
			
			$query = "INSERT into `questions` (`cid`, `nid`, `nid2`, `qnum`, `type`, `question`, `answer`, `a`, `b`, `c`) values (?,?,?,?,?,?,?,?,?,?)";

			$statement = $DB->prepare($query);
			
			$statement->bindValue (1, $cid);
			$statement->bindValue (2, $nid);
			$statement->bindValue (3, $nid2);
			$statement->bindValue (4, $qnum);
			$statement->bindValue (5, $type);
			$statement->bindValue (6, $question);
			$statement->bindValue (7, $answer);
			$statement->bindValue (8, $a);
			$statement->bindValue (9, $b);
			$statement->bindValue (10, $c);
			
			$statement->execute();
			$DB->commit();
		}
		catch(PDOException $e2)
		{
			echo $e2->getMessage();
		}
	}
}

//Load quiz questions from the database
if(isset($_POST['load']))
{
	try
	{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$DB->beginTransaction();
			
		$query = "SELECT * FROM questions WHERE cid='$cid' AND nid='$nid' AND nid2='$nid2'";
		
		$statement = $DB->prepare($query);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		$questions = array();
		
		//Convert questions to JSON format
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