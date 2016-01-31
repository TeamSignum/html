<?php
session_start();
if(isset($_SESSION['email']))
{
	require 'class_view.html';
}
else
{
	header("location: ../login/login.html");
}
?>