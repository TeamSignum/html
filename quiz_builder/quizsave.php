<?php

if(isset($_POST["questions"]))
{
	$questions = $_POST["questions"];
	
	foreach($questions as $q)
	{
		$type = $q["type"];
		$question = $q["question"];
		$answer = $q["answer"];
		
		try
		{
			$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
			$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$DB->beginTransaction();
			
			$query = "INSERT into `questions` (`type`, `question`, `answer`) values (?,?,?)";

			$statement = $DB->prepare($query);
			
			$statement->bindValue (1, $type);
			$statement->bindValue (2, $question);
			$statement->bindValue (3, $answer);
			
			$statement->execute();
			$DB->commit();
		}
		catch(PDOException $e)
		{
			echo $e->getMessage();
		}
	}
}

?>