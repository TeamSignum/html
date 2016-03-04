<?php

session_start(); 

if (isset($_POST["submit"])){

	$email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

	// checking the empty error
	$error = array();

    // empty check
    if(empty($email)){
    	$error[] = "Please enter your email";
		$errm = "Please enter your email";
		require "../login/login.html";
		exit();
    }
    if(empty($password)){
    	$error[] = "Please enter your password";
		$errm = "Please enter your password";
		require "../login/login.html";
		exit();
    }
    
    // no error then
    if(count($error) == 0){
        // connection the db
    	try{           
            $DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
            $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $DB->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }catch(PDOException $e){
            die($e->getMessage());
        }

        $stmt = $DB->prepare("SELECT  email,password,idusers,uid,role FROM LU.users WHERE email = '$email'");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        // Use php's password_verify function to authenicate the user provided password
        if (count($result) > 0 && password_verify($password, $result['password'])){
            $_SESSION['email'] = $result['email'];
			$_SESSION['userid'] = $result['idusers'];
			$_SESSION['uid'] = $result['uid'];
			$_SESSION['role'] = $result['role'];
			
			//Navigate to account home
            header("location: ../student/student.php");
        }
        else{
            $error[] = "Email and password are no found <br>";
			$errm = "Wrong email or password.";
			require "../login/login.html";
			exit();
        }

    }
    else{
	  	foreach ($error as $err) {
        	echo $err. '</br>';
        }
    }

} 
?>
