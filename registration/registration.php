
<?php

if (isset($_POST["submit"])){
	
	$uid = strip_tags($_POST["uid"]);
	$email = strip_tags($_POST["email"]);
    $password1 = strip_tags($_POST["pass"]);
    $password2 = strip_tags($_POST["cpass"]);
    $usertype = strip_tags($_POST["identity"]);
    $fname = strip_tags($_POST["firstname"]);
    $lname = strip_tags($_POST["lastname"]);

    if(isset($_FILES["upload"]){
        if(move_uploaded_file($_FILES["upload"]['test1'], "./profile_images/{$_FILES['upload']['test1']}")){
            echo "hello";
        }
    }

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
        $query = "INSERT INTO LU.users (email, password, uid, firstname, lastname, role) values ('$email', '$password1', '$uid','$fname', '$lname', '$usertype')";
        $stmt = $DB->prepare($query);

        try{
            // Execute the database query
            $stmt->execute();
            header("location: ../index.html");
        }catch  (PDOException $e){
            echo $e->getMessage();
        }
    }

} 

?>
