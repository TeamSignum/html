<?php

include '../../imports/ChromePhp.php';

session_start();

$nid         = $_SESSION['nid'];
$nid2        = $_POST['nid2'];
$cid         = $_SESSION['classid'];
$idusers     = $_SESSION['userid'];
$fileName    = $_FILES['file']['name'];
$fileType    = $_FILES['file']['type'];
$fileSize    = $_FILES['file']['size'];
$fileError   = $_FILES['file']['error'];

$target_dir = "../../assignmentsub/";
$target_file = $target_dir . $idusers . "_" . basename($_FILES["file"]["name"]);
$uploadOk = 1;

// Check if file already exists
if (file_exists($target_file)) {
    //echo "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
if ($_FILES["file"]["size"] > 500000) {
    //echo "Sorry, your file is too large.";
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    //echo "Sorry, your file was not uploaded.";

// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
        //echo "The file ". basename( $_FILES["file"]["name"]). " has been uploaded.";
    } else {
        //echo "Sorry, there was an error uploading your file.";
    }
}

try {

    // Setup connection
    $DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
    $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $DB->beginTransaction();

    $query = "REPLACE INTO `assignments` (`cid`, `nid`, `nid2`, `idusers`, `file`, `filename`) values (?,?,?,?,?,?)";
    $statement = $DB->prepare($query);

    $statement->bindValue (1, $cid);
    $statement->bindValue (2, $nid);
    $statement->bindValue (3, $nid2);
    $statement->bindValue (4, $idusers);
    $statement->bindValue (5, $target_file);
    $statement->bindValue (6, $fileName);

    // Execute query
    $statement->execute();
    $DB->commit();

}
catch(PDOException $e)
{
    echo $e->getMessage();
}

?>