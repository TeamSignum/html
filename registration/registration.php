<!DOCTYPE html>
<html>
<head> 
  <link rel="import" href="../imports/import.html">
  <link rel="stylesheet" type="text/css" href="Registration.css"> 
  <script src="Registration.js" type="text/javascript"></script>
  <title> Registration </title>  
</head> 
<body>
	<form method="post" action="registration.jsp">
            <center>
            <table border="1" width="30%" cellpadding="5">
                <thead>
                    <tr>
                        <th colspan="2">Registration</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Who are you</td>
                        <td><input type="radio" name="who_are_you" value="student"> Student <input type="radio" name="who_are_you" value="professor"> Professor</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input type="text" name="email" value="" /></td>
                    </tr>
                    <tr>
                        <td>User Name</td>
                        <td><input type="text" name="uname" value="" /></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input type="password" name="pass" value="" /></td>
                    </tr>
                    <tr>
                        <td>Confirmed Password</td>
                        <td><input type="password" name="cpass" value="" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><input type="submit" value="Submit" />&emsp;<input type="reset" value="Reset" /></td>
                    </tr>
                    <tr>
                        <td colspan="2">Already registered!! <a href="login.jsp">Login Here</a></td>
                    </tr>
                    
                </tbody>
            </table>
            </center>
        </form>
</body>
</html>