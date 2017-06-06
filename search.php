<!DOCTYPE html>
<html>
	<?php
		header("Content-type: text/html");
		include "top.html";
		include "bottom.html"; 
		include "myexams.js";
	
		$course_id = $_REQUEST["course_id"];
	?>
	
    <body>
    
    <?php if($course_id != ""){ ?>
    	<input type='hidden' id='course_id' value='<?= $course_id ?>'>
    <?php } ?>
    
    </body>
</html>