<?php

	session_start();
	// TODO: Need to get profile from POST that comes to this page
	
	// Get profile information from the database
	
	// Connects to local mongo db
	$db = new MongoClient('localhost');

	// Select the DB
	$db = $db->ludb;

	// Select a collection
	$collection = $db->users;
	
	// Query - Hard Code a user id for now
	$query1 = array('_id' => 10); 

	// find data
	$cursor = $collection->find($query1);

	/* TODO: Find profile data */
	foreach ($cursor as $data) {
	    if (true){
	    	//TODO: Set fields into php variables
	    }
	    else{
	    	//TODO: Handle error checking. 
	    }
	}
	
	$email = "joe@learninguniverse.com";
	$userName = "AverageJoe";
	$firstName = "Joe";
	$lastName = "Cottongim";
	$isProfileOwner = true; //either create a button or toggle fields as readonly/notreadonly
?>	
	
<!doctype html>
<html>
<head>
<meta charset="utf-8">
  <link rel="import" href="../imports/import.html">
  <link rel="stylesheet" type="text/css" href="profile.css"> 
  <script src="profile.js" type="text/javascript"></script>
<title>Profile</title>
</head>
<body>
  <div id="navbar:../"></div>
  	   
      <div class="col-md-4"></div>
      <div class="col-md-4">
      <h2 align="center">User Profile</h2>
      <form id="profileForm" method="post" action="profile.php">

          <label for="email">Email address</label>
          <input type="email" name="email" class="form-control" id="email" placeholder="<?php echo $email?>" readonly="readonly">
        
          <label for="username">User Name</label>
          <input type="text" name="username" class="form-control" id="nickname" placeholder="<?php echo $userName?>" readonly="readonly">          
          <label for="firstname">First Name</label>
          <input type="text" name="firstname" class="form-control" id="nickname" placeholder="<?php echo $firstName?>" readonly="readonly">
          
          <label for="lastname">Last Name</label>
          <input type="text" name="lastname" class="form-control" id="nickname" placeholder="<?php echo $firstName?>" readonly="readonly">
                
      </form>
      </div>
      <div class="col-md-4"></div>
</body>
</html>
	
</body>
</html>