<?php
	/*
  	 * Name: Amer.Mohammed
  	 * Student ID: 1002254552
  	 * Course code: CSCB20S
  	 * Single PHP file for retrieving all the data from the MySQL server online, that are
  	 * used in assignment 3; Exam timetable webpage.
  	 */
  	 // Including the config.php file to log in to the mysql server with given username and pass.
	include "config.php";
	
	// connect to the database
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	if (!$conn) {
		// Die if connection fails.
    	die("Connection failed: " . mysqli_connect_error());
	}
	// Request for course_code, if given.
	$course_code = $_REQUEST["course"];
	// Request for course_id, if given.
	$course_id = $_REQUEST["course_id"];
	// Select query, based on the request given.
	if($course_id != ""){
		/* Get the exams course code, section, instructor, date, start time, end time
		 * from the natural jointed courses and time table where the id is one given
		 * by the user.
		 */
		$query = "Select course, section, instructor, date, start, end from courses 
												natural join time where id=$course_id";
	}
	else{
		/* Get all the columns in the courses table where the parent course is like the
		 * given by the user.
		 */
		$query = "Select * from courses where course like '$course_code%'";
	}
	// Connect and get the result form the provided query.
	$get_result = mysqli_query($conn, $query);
	
	// Declare an array to store result
	$return_result = array();
	while ($row = mysqli_fetch_assoc($get_result)) {
		// Store result in declared array
        $return_result[] = $row;
    }
    
    // If the given query return nothing, die and display HTTP 4040 error code, i.e. page not found.
    if($return_result == []){
		header("HTTP 404 Page Not Found");
        die("Page Not Found; invalid request.");
    }else{
    	// Else json encode the result and print it
    	print json_encode($return_result);
    	//close mysql connection.
		mysqli_close($conn);
	}
?>