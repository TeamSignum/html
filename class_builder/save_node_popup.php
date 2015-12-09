<?php

$nid= $_POST["nid"];
$title= $_POST["title"];
$description= $_POST["description"];
$duedate= $_POST["duedate"];
$notes= $_POST["notes"];

try
{
	// Setup connection
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$DB->beginTransaction();

	// Create query 
	$query = "INSERT into `nodepopups` (`nid`, `title`, `description`, `duedate`, `notes`) values (?,?,?,?,?)";
	$statement = $DB->prepare($query);

	$statement->bindValue (1, $nid);
	$statement->bindValue (2, $title);
	$statement->bindValue (3, $description);
	$statement->bindValue (4, $duedate);
	$statement->bindValue (5, $notes);

	// Execute query
	$statement->execute();
	$DB->commit();

}
catch(PDOException $e)
{
	echo $e->getMessage();
}

?>
