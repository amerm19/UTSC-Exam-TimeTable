<script>
	/* Function for displaying the rows; get the data through exams.php by passing the
	 * course code and append each row one by one.
	 */
	function tableRows(course_id){
		// Pass the course_id to exams.php and the get the result, then decode it.
		$.getJSON("exams.php?course_id=" + course_id, function(result) {
			// Loop through each index of the array result.
			$.each(result, function(i, field){
				/* Append the row to id display of the html table tag with the data gotten
				 * through exams.php.
				 */
				$("#display").append($("<tr><td>" + field.course + "</td><td>" +
					field.section + "</td><td>" + field.instructor + "</td><td>" +
						field.date + "</td><td id='time_start'>" + field.start +
							"</td><td id='time_end'>" + field.end + "</td></tr>"));
            });
		});
		// Clear the options drop menu.
		$("#courses_list").find('option').remove();
		// Clear the input textbox.
		$("#course_name").val("");
		// Add the course list dropmenu first option (description of drop menu);
		$("#courses_list").append("<option value='NULL'> Select A Course</option>");
	}
	/* Create/ populate the dropdown course list menu. Get data through exams.php by 
	 * passing valid course code and append to the course list.
	 */
	function coursesDropmenu(event){
		event.preventDefault(); // suspend submit
		var course = $("#course_name").val();
		// Pass the course code to exams.php and the get the result, then decode it.
		$.getJSON("exams.php?course=" + course, function(result) {
			// If the user gives invalid request i.e. invalid course code, alert the user.
			if(result == "Page Not Found; invalid request."){
				alert("No such course exist in the database, please try a different search.");
			}else{
				// Else, populate dropdown menu one by one.
				$.each(result, function(i, field){
					/* Loop through each index of the array result and append it to id
					 * course_list of the select tag html element.
					 */
					$("#courses_list").append($("<option value=" + field.id +
						"/>").text(field.course + ", " + field.section + ", " +
																	field.instructor));
            	});
            }
		});
	}
	/* Create/ populate the dropdown course code list menu in DB. Get data through
	 * exams.php by passing nothing and append it to the course code list.
	 */
	function courseLegend(){
		/* Declare a dictionary to see whether the unique course codes has already been
		 * encountered.
		 */
		var code_exist = {};
		// Declare an array to store all the unique course codes.
		var sorted_codes = [];
		/* Get all the course codes by passing nothing to exams.php, which returns an
		 * array of all the courses in the DB.
		 */
		$.getJSON("exams.php", function(result) {
			// Loop through each index of the array result.
			$.each(result, function(i, field){
				/* Get the first 3 substrings (parent course code) of the entire course
				 * code and store in var, i.e. CSC of CSCA08/CSCA48 etc. as all computer
				 * science courses have 'CSC' course code. Do the same for all the
				 * unique courses encountered.
				 */
				var course_code = field.course.substring(0, 3);
				/* If parent course code doesn't exist in the dictionary, added to
				 * the unique course_code array and declare as exist in the dictionary.
				 */
				if(!code_exist[course_code]){
					// Adding it to the array.
					sorted_codes.push(course_code);
					// Declaring as exist (or true) in the dictionary.
					code_exist[course_code] = true;
				}
            });
            // Sort the final array of unique parent course codes.
            sorted_codes.sort();
            /* Loop through each element in the array i.e. each parent course code and
             * append it to the id course_codes of the html select tag.
             */
            $.each(sorted_codes, function(i, element){
				$("#course_codes").append($("<option value=" + element + "/>").text(element));
			});
		});
	}
	// When document ready, apply the script.
	$(document).ready(function(){
		// Display the second row (first course row after the header row).
		var course_id = $("#course_id").val();
		/* If the retrieved hidden input course_id is not empty and table row length is 1
		 * call the tableRow function.
		 */
		if(course_id != "" && $("tr").length == 1){
			tableRows(course_id);
		}
		// Create course codes list dropdown menu
		courseLegend();
		// Select the parent course code from the menu.
		$("#course_codes").click(function(){
			// Store the selected parent course code value in a var.
			var course_code = $(this).val();
			/* If the selected option is not the first option i.e. description of drop
			 * menu, set selected parent course code as the input textbox value.
			 */ 
			if(course_code != "NULL"){
				$("#course_name").val(course_code);
			}
		});
		// Search for course code.
		$("#search_button").click(function(event){
			// Populate drop down course list menu.
			coursesDropmenu(event);
			// If an option is selected continue further.
			$("#courses_list").change(function(){
				// Get the selected courses id value.
				var course_id = $(this).val();
				/* If the selected option is not the first option i.e. description of drop
				 * menu, continue further.
				 */
				if(course_id != "NULL"){
					/* If 2 or more rows exist (i.e. column header and the first
					 * selected course), then add the next row.
					 */
					if($("tr").length >= 2){
						// Call the function to append the row to existing table.
						tableRows(course_id);
					}else{
						/* Else, if this is the first selected course row, submit form
						 * with hidden info to search.php.
						 */
						$("#form1").append(
							$("<input type='hidden' name='course_id' value=" +
																	course_id + ">"));
						$("#form1").submit();
					}
				}
			});
		});
	});
</script>