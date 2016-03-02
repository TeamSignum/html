<?php

session_start();
$cid = $_SESSION['classid'];
$nid = $_SESSION['nid'];
$nid2 = $_SESSION['nid2q'];

if(isset($_POST["load"]))
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

if(isset($_POST["answers"]))
{
	$iduser = $_SESSION['userid'];
	
	try
	{
		$answers = $_POST["answers"];
		
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		
		foreach($answers as $a)
		{
			$qnum = $a['qnum'];
			$answer = $a['answer'];
			
			
			$DB->beginTransaction();
			
			$query = "INSERT into `answers` (`cid`, `nid`, `nid2`, `idusers`, `qnum`, `answer`) values (?,?,?,?,?,?)";
			$statement = $DB->prepare($query);
			
			$statement->bindValue (1, $cid);
			$statement->bindValue (2, $nid);
			$statement->bindValue (3, $nid2);
			$statement->bindValue (4, $iduser);
			$statement->bindValue (5, $qnum);
			$statement->bindValue (6, $answer);
			
			$statement->execute();
			$DB->commit();
		}
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}
?>