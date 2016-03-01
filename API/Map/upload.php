<?php

include '../../imports/ChromePhp.php';

$nid         = $_POST['nid'];
$cid         = $_SESSION['classid'];
$fileName    = $_FILES['file']['name'];
$fileType    = $_FILES['file']['type'];
$fileSize    = $_FILES['file']['size'];
$fileError   = $_FILES['file']['error'];
$fileContent = file_get_contents($_FILES['file']['tmp_name']);

try {

    // Setup connection
    $DB = new PDO("mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU", 'Signum', 'signumDB4');
    $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $DB->beginTransaction();

    $query = "INSERT `lecturenotes` (`nid`, `cid`, `name`, `type`, `size`, `content`) values (?,?,?,?,?,?)";
    $statement = $DB->prepare($query);

    $statement->bindValue (1, $nid);
    $statement->bindValue (2, $cid);
    $statement->bindValue (3, $fileName);
    $statement->bindValue (4, $fileType);
    $statement->bindValue (5, $fileSize);
    $statement->bindValue (6, $fileContent);

    // Execute query
    $statement->execute();
    $DB->commit();

}
catch(PDOException $e)
{
    echo $e->getMessage();
}

?>