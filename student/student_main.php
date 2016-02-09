<?php
session_start();

if(isset($_POST["class"]))
{
	$role = $_SESSION["role"];
	
	// Get the node id from the session.  Currently hard coding it.
	//$uid = $_SESSION['id'];
	$userid = $_SESSION['userid'];
		
	// Set up the database connection
	$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
	// Set and prepare the database query
	if(strcmp($role, "professor") == 0)
	{
		$query = "SELECT b.classnumber, b.cid
				FROM teaching a, classes b
				WHERE a.cid = b.cid and a.idusers ='" .$userid. "'";
	}
	else
	{
		$query = "SELECT b.classnumber, b.cid
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
		$enroll[] = array('cid' => $cid, 'classnumber' => $classnumber);
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
	echo "1";
}

?>
