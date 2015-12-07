<?php

	$db_name = 'ludb';
	$email = "user1@gmail.com";
	//$email = $_POST["email"]; Nothing

	$connection = new MongoClient('mongodb://ec2-52-33-118-140.us-west-2.compute.amazonaws.com');

	//connecting to cidbase
	$db = $connection->$db_name;

	//connect to specific collection
	$collection1 = $db->users;

	$query1 = array('email'=>$email);
	
	//finding user and search what class he is taking.
	$cursor1 = $collection1->findOne($query1);

	if(count($cursor1)) {

		$classid = $cursor1["classid"];
		//var_dump($classid);
		$classname = array();

		foreach ($classid as $cid) {
			//$floatId = (float) $cid;
			$collection2 = $db->classes;
			//$query2 = array('_id'=>$floatId);
			$query2 = array('_id'=>$cid);
			$cursor2 = $collection2->findOne($query2);
			array_push($classname, $cursor2["classname"]);	
			//var_dump($classname);
		}
	}

	echo json_encode($classname);
?>
