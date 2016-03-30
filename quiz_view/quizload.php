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
		
		$query = "SELECT answer FROM questions WHERE cid='$cid' AND nid='$nid' AND nid2='$nid2'";
		
		$statement = $DB->prepare($query);
		$statement->execute();
		$resultques = $statement->fetchAll(PDO::FETCH_ASSOC);
		$quesvals = array_values($resultques);
		
		//echo $resultques;
		//print_r(array_values($resultques));
		
		$correct = 0;
		$ind = 0;
		
		foreach($answers as $a)
		{
			$qnum = $a['qnum'];
			$answer = $a['answer'];
			
			$ans = $a["answer"];
			
			$quest = $quesvals[$ind]["answer"];

			if(strcmp($ans, $quest) == 0)
			{
				$correct++;
			}
			$ind++;
			
			$DB->beginTransaction();
			
			$query = "REPLACE into `answers` (`cid`, `nid`, `nid2`, `idusers`, `qnum`, `answer`) values (?,?,?,?,?,?)";
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
		
		$score = $correct/count($resultques);
		$perc = round($score * 100);
		//echo $perc;
		
		$DB->beginTransaction();
		
		$date = date("Y-m-d H:i:s", time());
		
		$query = "REPLACE into completed (idusers,cid,nid,nid2,complete,cdate) values (?,?,?,?,?,?)";
		
		$statement = $DB->prepare($query);
					
		$statement->bindValue (1, $iduser);
		$statement->bindValue (2, $cid);
		$statement->bindValue (3, $nid);
		$statement->bindValue (4, $nid2);
		$statement->bindValue (5, 1);
		$statement->bindValue (6, $date);
		
		$statement->execute();
		$DB->commit();
		
		$DB->beginTransaction();
		
		$query = "REPLACE into quizzes (cid,nid,nid2,idusers,tdate,grade) values (?,?,?,?,?,?)";
		
		$statement = $DB->prepare($query);
		
		$statement->bindValue (1, $cid);
		$statement->bindValue (2, $nid);
		$statement->bindValue (3, $nid2);
		$statement->bindValue (4, $iduser);
		$statement->bindValue (5, $date);
		$statement->bindValue (6, $perc);
		
		$statement->execute();
		$DB->commit();
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}
?>