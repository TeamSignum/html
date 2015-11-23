/**
 * Learning Universe Registration
 * Authors: Namgi Yoon
 * Date: 11/22/15 
 */ 

<%@ page import ="java.sql.*" %>
<%
    String user = request.getParameter("uname");
    String email = request.getParameter("email");    
    String pwd = request.getParameter("pass");
    String cpwd = request.getParameter("cpass")
    
    //Class.forName("com.mysql.jdbc.Driver");
    //Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/dbname", "root", "dbpass");
    Statement st = con.createStatement();
    //ResultSet rs;
    //int i = st.executeUpdate("insert into members(email, uname, pass, regdate) values (email + "','" + user + "','" + pwd + "', CURDATE())");
    if (i > 0) {
        //session.setAttribute("userid", user);
        response.sendRedirect("welcome.jsp");
        //out.print("Registration Successfull!"+"<a href='index.jsp'>Go to Login</a>");
    } else {
        response.sendRedirect("index.jsp");
    }
%>