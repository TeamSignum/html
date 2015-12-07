<?php

// IMPORTANT: from command line run "mongo" to open up mongodb command line interface. Type "help" to get instructions on viewing the db. 
// Notice I'm connecting to test and selecting restaurants as the collection. 

// Connects to local mongo db
$db = new MongoClient("mongodb://ec2-52-33-118-140.us-west-2.compute.amazonaws.com");

// Select the DB
$db = $db->ludb;
var_dump($db);

// Select a collection
$collection = $db->users;
var_dump($collection);

// find data
$cursor = $collection->findOne(array("email"=>"user1@gmail.com"));
var_dump($cursor);
echo $cursor["email"];



?>
