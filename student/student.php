<?php
session_start();

if(isset($_SESSION['email']))
{
	require 'student_main.html';
}
else
{
	header("location: ../login/login.html");
}
?>