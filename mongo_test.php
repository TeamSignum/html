<?php

// IMPORTANT: from command line run "mongo" to open up mongodb command line interface. Type "help" to get instructions on viewing the db. 
// Notice I'm connecting to test and selecting restaurants as the collection. 

// Connects to local mongo db
$db = new Mongo();

// Select the DB
$db = $db->test;

// Select a collection
$collection = $db->restaurants;

// find data
$cursor = $collection->find();

// iterate through the results
foreach ($cursor as $data) {
    echo $data["address"]["street"] . "\n";
}

?>
