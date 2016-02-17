<?php

	/* 
	 * Author: Joseph Cottongim
	 * Date: Spring 2016
	 *
	 * Helper functions to get SESSION and POST information to javascript when necessary
	 *
	 */

	session_start();
	//session_unset();
	//session_destroy();
	
	// Check that uid is set in the Session
	if(!isset($_SESSION['uid'])){	
		echo json_encode('Login');
	}
	else	
	{	
		if(isset($_POST['GETINFO'])){
			$infoType=$_POST['GETINFO'];

			if($infoType == 'SESSION'){
				echo(json_encode($_SESSION));
			}
			elseif($infoType == 'POST'){
				echo(json_encode($_POST));
			}
			else{
				echo(json_encode("Invalid Request"));
			}
		}
		else{
			echo(json_encode("Request not found"));
		}
	}
?>