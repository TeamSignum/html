<?php

	$db_name = 'ludb';
	$email = "test2@gmail.com";
	//$email = $_POST["email"];

	$connection = new MongoClient('localhost');

	//connecting to cidbase
	$db = $connection->$db_name;

	//connect to specific collection
	$collection1 = $db->users;

	$query1 = array('email'=>$email);
	
	//finding user and search what class he is taking.
	$cursor1 = $collection1->findOne($query1);

	if(count($cursor1)) {

		$classid = $cursor1["classes"];
		$classname = array();

		foreach ($classid as $cid) {
			$floatId = (float) $cid;
			$collection2 = $db->class;
			$query2 = array('_id'=>$floatId);
			$cursor2 = $collection2->findOne($query2);
			array_push($classname, $cursor2["classname"]);	
		}
	}

	echo json_encode($classname);
?>
