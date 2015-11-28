<?php

session_start(); 

if (isset($_POST["submit"])){

	$email = $_POST["email"];
    $password = $_POST["password"];

	// Connects to local mongo db
	$db = new Mongo();

	// Select the DB
	$db = $db->ludb;

	// Select a collection
	$collection = $db->users;

	// query
	$query1 = array('email' => $email); 

	// find data
	$cursor = $collection->find($query1);

	// iterate through the results
	foreach ($cursor as $data) {
	    if ($data["password"] == $password){
	    	header("location: ../index.html");
	    }
	    else{
	    	//TODO: Handle error checking. 
	    }
	}
} 

?>
