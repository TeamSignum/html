<?php

function openDB()
{
	$DB = new PDO('mysql:host=ec2-52-33-118-140.us-west-2.compute.amazonaws.com;dbname=LU;charset=utf8', 'Signum', 'signumDB4');
	$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $DB;
}

?>