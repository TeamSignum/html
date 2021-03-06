<?php

/* 
 * Author: Learning Universe - Joseph Cottongim and Namgi Yoon
 * Date: Spring 2016
 * 
 * Description: php file to save user profile changes on the Learning
 * Universe website.
 *
 */

session_start();

if(isset($_POST["class"]))
{
	$role = $_SESSION["role"];
	
	$userid = $_SESSION['userid'];
		
	// Set up the database connection
	$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
	// Set and prepare the database query
	if(strcmp($role, "professor") == 0)
	{
		$query = "SELECT b.classnumber, b.cid, b.classname, b.description
				FROM teaching a, classes b
				WHERE a.cid = b.cid and a.idusers ='" .$userid. "'";
	}
	else
	{
		$query = "SELECT b.classnumber, b.cid, b.classname, b.description
				FROM enrolled a, classes b
				WHERE a.cid = b.cid and a.idusers ='" .$userid. "'";
	}
		
	$statement = $DB->prepare($query);
		
	// Execute the database query
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	
	$enroll = array();
	
	foreach($result as $row)
	{
		$cid = $row['cid'];
		$classnumber = $row['classnumber'];
		$classname = $row['classname'];
		$classdesc = $row['description'];
		$enroll[] = array('cid' => $cid, 'classnumber' => $classnumber, 'classname' => $classname, 'classdesc' => $classdesc);
	}
	//$enroll[] = array('cid' => "-1", 'classnumber' => "+");
	
	echo json_encode($enroll);
}

if(isset($_POST["name"]))
{
	$userid = $_SESSION['userid'];
	try
	{
		$DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
		$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$query = "SELECT firstname,role FROM users WHERE idusers = '$userid'";
		
		$statement = $DB->prepare($query);
		$statement->execute();
		$result = $statement->fetch(PDO::FETCH_ASSOC);
		
		$t = $result['firstname'];
		$role = $result['role'];
		
		$r = array('name' => $t, 'role' => $role);
		
		echo json_encode($r);
		//echo $result['firstname'];
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}
}

if(isset($_POST['direct']))
{
	$_SESSION['classid'] = $_POST['direct'];
	$_SESSION['className'] = $_POST['className'];
	echo "1";
}

?>
