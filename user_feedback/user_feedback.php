<?php

if (isset($_POST["submit"])){

	$feedback = trim($_POST["feedback"]);

    $DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
    $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $DB->beginTransaction();

    $query = "INSERT `feedback` (`feedback`) values (?)";
    $statement = $DB->prepare($query);
    $statement->bindValue (1, $feedback);
    $statement->execute();
    $DB->commit();

    header("location: ../user_feedback/user_feedback.html");
} 

?>