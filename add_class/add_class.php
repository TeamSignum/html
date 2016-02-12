<?php

/* 
 * Author: Namgi Yoon
 * Date: February 11, 2016
 *
 */
session_start();
//print_r($_SESSION);
if(isset($_SESSION['userid'])){
	$userid = $_SESSION['userid'];	
}

if(isset($_POST['function'])){
	$function=$_POST['function'];

	$query=null;
	
	// Set include path and require appropriate files
	set_include_path( "../");
	require_once ('db.php');
	
	// Login to the database	
	$DB=openDB();
		
	switch ($function) {
		case 'getallclasses':
			$query = "SELECT cid, classnumber FROM classes;";
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($result);
			break;	
		case 'enroll':
			$cid = $_POST['cid'];
			$ekey = $_POST['ekey'];
			
			$query = "SELECT count(*) FROM classes WHERE cid= '$cid' and ekey='$ekey';";
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetch();
			
			if($result[0] == 1){
				$query = "insert into LU.enrolled value ('$userid' ,'$cid');";
				$statement = $DB->prepare($query);
				$statement->execute();

			}else{
				echo "cannot find it";
			}
			
			break;	
		default:
			# code...
			break;
	}
}

/*
 if(isset($_POST['idusers']) && isset($_POST['cid']) && isset($_POST['ekey'])) {
	$idusers = $_POST['idusers'];
	$cid  = $_POST['cid'];
	$ekey = $_POST['ekey'];
	
	enrolled($ekey, $idusers, $cid);
}
function enrolled($idusers, $cid){
	try
	{
		$usersclass = [];
		$query=null;
		
		// Set include path and require appropriate files
		set_include_path( "../");
		require_once ('db.php');
		
		// Login to the database	
		$DB=openDB();

		//
		$query = "INSERT into LU.enrolled (idusers, cid) Value ('$idusers','$cid');";
		$statement = $DB->prepare($query);


		$query = "INSERT into LU.enrolled (idusers, cid) Value ('$idusers','$cid');";
		$statement = $DB->prepare($query);
		$statement->execute();

		$query = "SELECT cid FROM LU.enrolled Where idusers='$idusers';";
		$statement = $DB->prepare($query);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		
		foreach($result as $row)
		{
			$cid = $row['cid']; 
			$usersclass[] = array('cid' => $cid);
		}

		echo json_encode($usersclass);
	}
	catch(PDOException $e)
	{
		echo $e->getMessage();
	}*/
//} 
	/* if(isset($_POST['function']))
	// {
	// 	$function=$_POST['function'];
	// 	$query=null;
		
	// 	// Set include path and require appropriate files
	// 	set_include_path( "../");
	// 	require_once ('db.php');
		
	// 	// Login to the database	
	// 	$DB=openDB();
		
	// 	// Functions
	// 	switch($function) 
	// 	{
	// 		case 'getClasses':
	// 			$query = "SELECT * FROM classes:";
	// 			$statement = $DB->prepare($query);
	// 			$statement->execute();
	// 			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	// 			break;
				
	// 		case 'enroll':
	// 			// Check if enrollment key matches (will all classes have an ekey?)
	// 			if(isset($_POST['ekey']) && isset($_POST['cid']) && isset($_POST['uid'])){
	// 				$ekey=$_POST['ekey'];
	// 				$cid=$_POST['cid'];
	// 				$uid=$_POST['uid'];
	// 			}
	// 			else{
	// 				die("Enrollment Key or Class was not found");
	// 			}
				
	// 			$query = "SELECT c.ekey FROM classes c
	// 								WHERE c.cid=?;";
				
	// 			// Prepare and execute the database query
	// 			$statement = $DB->prepare($query);
	// 			$statement->bindValue (1, $cid);
	// 			$statement->execute();
	// 			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
				
	// 			// Compare enrollment key
	// 			if($_ekey=result.ekey){
	// 				// Enroll student in the class
	// 				$query = "INSERT INTO enrolled (id, cid, uid) VALUES (?,?,?)";
	// 				$statement = $DB->prepare($query);
	// 				$statement->bindValue (1, $userid);
	// 				$statement->bindValue (2, $cid);
	// 				$statement->bindValue (3, $cid);
	// 				$statement->execute();
	// 				// Verify that insert succeeded
	// 			}
	// 				else
	// 			{
	// 				die("Enrollment key is invalid");
	// 			}
	// 			break;
				
	// 		default:
	// 			die("Invalid function selection");
	// 	}
	 }*/
?>