<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
    session_start();

    if($_COOKIE['LOGGEDIN']){
        $sql_query = "SELECT * FROM serverVehicles";
        $result = mysqli_query($con, $sql_query);
        $json_array = array();
    
        while($row = mysqli_fetch_assoc($result))
        {
            $json_array[] = $row;
        }
    
        echo json_encode($json_array);

    }
?>