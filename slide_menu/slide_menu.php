<html>
<head>
	<title>slide menu</title>
	<link href="slide_menu.css" rel="stylesheet">
	<link rel="import" href="../imports/import.html">
    <script src="http://thecodeplayer.com/uploads/js/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="../API/Notifications/notifications.js" type="text/javascript"></script>
    <?php session_start(); $userid = $_SESSION('userid'); ?>
</head>
<body>

	<div id="navbar:../"></div>

	<div class="container-slide">
    <div id="sidebar">
        
    </div>
    <div class="main-content">
        <a href="#" data-toggle=".container-slide" id="sidebar-toggle">
            <span>Toggle nav</span>
        </a>
    </div>
    </div>
</body>
</html>