<?php

session_start(); 

$name= $_POST["title"];
$description= $_POST["description"];

echo $name; 
echo $description; 

// Connects to local mongo db
$db = new Mongo();

// Select the DB
$db = $db->ludb;

// Select a collection
$collection = $db->nodes;

// Create insert array
$in = array("title" => $name, "description" => $description); 

// Insert it into collection. 
$collection->insert($in); 

?>