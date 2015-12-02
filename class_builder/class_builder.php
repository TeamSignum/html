<?php

session_start(); 

$title= $_POST["title"];
$description= $_POST["description"];

// Connects to local mongo db
$db = new MongoClient("mongodb://ec2-52-33-118-140.us-west-2.compute.amazonaws.com");

// Select the DB
$db = $db->ludb;

// Select a collection
$collection = $db->nodes;

// Create insert array
$in = array("title" => $title, "description" => $description); 

// Insert it into collection. 
$collection->insert($in); 

?>
