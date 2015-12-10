<?php

try
{
	// Setup connection
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$DB->beginTransaction();

	$statement = $DB->prepare("TRUNCATE TABLE `nodepopups`");
	$statement->execute();
	$DB->commit();

	$statement = $DB->prepare("TRUNCATE TABLE `nodes`");
	$statement->execute();
	$DB->commit();

	$statement = $DB->prepare("TRUNCATE TABLE `edges`");
	$statement->execute();
	$DB->commit();

}
catch(PDOException $e)
{
	echo $e->getMessage();
}

?>
