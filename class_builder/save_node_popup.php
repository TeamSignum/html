<?php

$nid= $_POST["nid"];
$title= $_POST["title"];
$description= $_POST["description"];
$duedate= $_POST["duedate"];

try
{
	// Setup connection
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$DB->beginTransaction();

	// Create query 
	$query = "INSERT into `nodepopups` (`nid`, `title`, `description`, `duedate`) values (?,?,?,?)";
	$statement = $DB->prepare($query);

	$statement->bindValue (1, $nid);
	$statement->bindValue (2, $title);
	$statement->bindValue (3, $description);
	$statement->bindValue (4, $duedate);

	// Execute query
	$statement->execute();
	$DB->commit();

}
catch(PDOException $e)
{
	echo $e->getMessage();
}

?>
