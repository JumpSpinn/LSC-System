<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();

    $filterTimestamp = $_POST['filterTimestamp'];

    if($_SESSION['loggedIn']){
        $sql_query = "SELECT * FROM bh WHERE createdBill = 0 AND `timestamp` >= $filterTimestamp";
        $result = mysqli_query($con, $sql_query);
        $json_array = array();
    
        while($row = mysqli_fetch_assoc($result))
        {
            $json_array[] = $row;
        }
    
        echo json_encode($json_array);

    }
?>