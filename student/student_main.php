<?php

	// Get the node id from the session.  Currently hard coding it.
	//$uid = $_SESSION['id'];
	$userid = 'user1';
		
	// Set up the database connection
	$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
	// Set and prepare the database query
	$query = "SELECT b.classnumber
				FROM enrolled a, classes b
				WHERE a.cid = b.id and a.uid ='" .$userid. "'";
	$statement = $DB->prepare($query);
		
	// Execute the database query
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($result);

?>
