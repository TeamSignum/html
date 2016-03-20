<?php

   	$file = basename($_GET['filename']);
	$file = '../../lecturenotes/'.$file;

    header("Cache-Control: public");
    header("Content-Description: File Transfer");
    header("Content-Disposition: attachment; filename=".$file."");
    header("Content-Transfer-Encoding: binary");
    header("Content-Type: binary/octet-stream");
    readfile($file);

?>