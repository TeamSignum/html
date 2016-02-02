<?php

try
{
	// Setup connection
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$DB->beginTransaction();

	$statement = $DB->prepare("TRUNCATE TABLE `grades`");
	$statement->execute();

	$statement = $DB->prepare("TRUNCATE TABLE `popupconcept`");
	$statement->execute();

	$statement = $DB->prepare("TRUNCATE TABLE `popupassignment`");
	$statement->execute();

	$statement = $DB->prepare("TRUNCATE TABLE `popupquiz`");
	$statement->execute();

	$statement = $DB->prepare("TRUNCATE TABLE `nodes`");
	$statement->execute();

	$statement = $DB->prepare("TRUNCATE TABLE `edges`");
	$statement->execute();
	$DB->commit();
}
catch(PDOException $e)
{
	echo $e->getMessage();
}

?>
