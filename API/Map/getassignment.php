<?php

session_start();

include '../../imports/ChromePhp.php';

try{
	$uid = $_SESSION["userid"];
	$cid = $_SESSION["classid"];
	$nid = $_SESSION["nid"];
	$nid2 = $_POST["nid2"];

	// Setup connection 
	$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$query = "SELECT assignments.filename, assignments.file FROM `assignments` 
		WHERE `idusers` = ? AND `cid` = ? AND `nid` = ? AND `nid2` = ?";

	ChromePhp::log($uid);
	ChromePhp::log($cid);
	ChromePhp::log($nid);
	ChromePhp::log($nid2);

	$statement = $DB->prepare($query);
	$statement->bindParam(1, $uid);
	$statement->bindParam(2, $cid);
	$statement->bindParam(3, $nid);
	$statement->bindParam(4, $nid2);

	$statement->execute();

	$result = $statement->fetch(PDO::FETCH_ASSOC);

	$name = $result['filename'];
	$path = $result['file'];

	$file = array('name' => $name, 'path' => $path);

	echo json_encode($file);

}
catch(PDOException $e){
	echo $e->getMessage();
}
	
?>