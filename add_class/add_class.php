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
		case 'getMyClasses':
			$query = "SELECT  enrolled.cid, classnumber
     						FROM LU.enrolled
     						INNER JOIN LU.classes
     						ON enrolled.cid = classes.cid
     						WHERE enrolled.idusers = '$userid';";
			$statement = $DB->prepare($query);
			$statement->execute();
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
			echo json_encode($result);
			break;
		case 'deleteMyClass':
			$cid = $_POST['cid'];
			$query = "delete from LU.enrolled where idusers = '$userid' and cid = '$cid';";
			$statement = $DB->prepare($query);
			$statement->execute();
		default:
			# code...
			break;
	}
}
?>