<?php

session_start(); 

// Connects to local mongo db
$db = new Mongo();

// Select the DB
$db = $db->ludb;

// Select a collection
$collection = $db->nodes;

$name = "Node 1"; 

// query
$query1 = array('name' => $name); 

// find data
$cursor = $collection->findOne($query1);

echo $cursor; 

$data = array(
	'name'	      => $cursor["name"]; 
	'description' => $cursor["description"]; 
); 

echo (json_encode($data)); 

?>
