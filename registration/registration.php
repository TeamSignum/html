
<?php

//session_start();

if (isset($_POST["submit"])){
	
	$uid = strip_tags($_POST["uid"]);
	$email = strip_tags($_POST["email"]);
    $password1 = strip_tags($_POST["password1"]);
    $password2 = strip_tags($_POST["password2"]);
    $type = strip_tags($_POST["usertype"]);

    $error = array();

    // empty check
    if(empty($uid)){
    	$error[] = "Please enter your uid";
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
        // Set up the database connection
        try{           
            $DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU', 'Signum', 'signumDB4');
            $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $DB->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }catch(PDOException $e){
            die($e->getMessage());
        }

        // check existed email of not
        $stmt = $DB->prepare("SELECT count(*) FROM LU.users WHERE email = '$email'");
        $stmt->execute();
        $result = $stmt->fetch();

        if($result['count(*)'] == 1){
            echo "already";
        }else{
            echo "new";
            $query = "INSERT INTO LU.users (email, password, uid) values ('$email', '$password1', '$uid')";
            $stmt = $DB->prepare($query);

            try{
                // Execute the database query
                $stmt->execute();
                header("location: ../index.html");
            }catch  (PDOException $e){
                echo $e->getMessage();
            }
        }
    }else{ 
        foreach ($error as $err) {
            echo $err. '</br>';
        }
    }
} 

?>
