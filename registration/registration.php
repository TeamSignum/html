
<?php

session_start();

if (isset($_POST["submit"])){
	
	$uid = strip_tags($_POST["uid"]);
	$email = strip_tags($_POST["email"]);
    $password1 = strip_tags($_POST["pass"]);
    $password2 = strip_tags($_POST["cpass"]);
    $usertype = strip_tags($_POST["identity"]);
    $fname = strip_tags($_POST["firstname"]);
    $lname = strip_tags($_POST["lastname"]);

    // Hash the password for storage in the DB
    // Set the bcrypt cost
    $options=['cost' => 12,];
    $passwordHash = password_hash($password1, PASSWORD_BCRYPT, $options);
    
    // $target_dir = "profile_images/";
    // $target_file = $target_dir . basename($_FILES["upload"]["name"]);

    // $uploadOk = 1;

    // $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

    // var_dump($imageFileType);

    // $check = getimagesize($_FILES["upload"]["tmp_name"]);

    // if($check !== false) {
    //     echo "File is an image - " . $check["mime"] . ".";
    //     $uploadOk = 1;
    // } else {
    //     echo "File is not an image.";
    //     $uploadOk = 0;
    // }
    // if ($uploadOk == 0) {
    // echo "Sorry, your file was not uploaded.";
    // // if everything is ok, try to upload file
    // } else {
    //     if (move_uploaded_file($_FILES["upload"]["tmp_name"], $target_file)) {
    //         echo "The file ". basename( $_FILES["upload"]["name"]). " has been uploaded.";
    //     } else {
    //         echo "Sorry, there was an error uploading your file.";
    //     }
    // }

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
        $query = "INSERT INTO LU.users (email, password, uid, firstname, lastname, role) 
                  values ('$email', '$passwordHash', '$uid','$fname', '$lname', '$usertype')";
        $stmt = $DB->prepare($query);

        try{
            // Execute the database query
            $stmt->execute();
            
            // Log the user in(need to query the db to get idusers/userid for the session)

            $stmt = $DB->prepare("SELECT  email,idusers,uid,role 
                                  FROM LU.users WHERE email = '$email'");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $_SESSION['email'] = $result['email'];
            $_SESSION['userid'] = $result['idusers'];
            $_SESSION['uid'] = $result['uid'];
            $_SESSION['role'] = $result['role'];
            
            //Navigate to account home
            header("location: ../student/student.php");

        }catch  (PDOException $e){
            echo $e->getMessage();
        }
    }

} 

?>
