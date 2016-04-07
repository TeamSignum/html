<?php
session_start();
$uid = $_SESSION['userid'];
$cid = $_POST['classid'];
$mid = $_POST['message'];

print($mid);

// Set include path and require appropriate files
set_include_path( "../");
require_once ('db.php');

// Login to the database	
$DB=openDB();

// insert the data
$query = "INSERT INTO `LU`.`professor_notification` (`idusers`, `cid`, `message`) VALUES ('$uid', '$cid', '$mid');";
$statement = $DB->prepare($query);
$statement->execute();

?>