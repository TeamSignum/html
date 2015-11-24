
<?php

if (isset($_POST["submit"])){
	
	$nickname = strip_tags($_POST["nickname"]);
	$email = strip_tags($_POST["email"]);
    $password1 = strip_tags($_POST["password1"]);
    $password2 = strip_tags($_POST["password2"]);
    $type = strip_tags($_POST["usertype"]);

    $error = array();

    if(empty($nickname)){
    	$error[] = "Please enter your nickname";
    }
    if(empty($email)){
    	$error[] = "Please enter your email";
    }
    if(empty($password1)){
    	$error[] = "Please enter your password";
    }
    if(empty($password2)){
    	$error[] = "Please enter Confirm password";
    }
    if($password1 != $password2){
    	$error[] = "Password and Confirm password are not matching";
    }

    if(count($error) == 0){
    	// datahase configuration
    	$host = 'localhost';
    	$db_name = 'ludb';

    	$connection = new Mongo('localhost');

    	if(connection){
    		//connecting to database
    		$db = $connection->$db_name;

    		//connect to specific collection
    		$collection = $db->users;

    		$query = array('email'=>$email);

    		//checking for existing user
    		$count=$collection->findOne($query);

    		if(!count($count)){
    			//save the new user
    			$user = array('email'=>$email,'password'=>md5($password1),'type'=>$type);
    			$collection->save($user);
    			echo "Success!";
    			header("location: ../index.html");
    		}
    		else{
    			echo "Existed!";
    			header("location: registration.html");
    		}
    	}
    	else{
    		die("Databese are not connected");
    	}
    }
    else{
    	foreach ($error as $err) {
    		echo $err. '</br>';
    	}
    }

} 

?>
