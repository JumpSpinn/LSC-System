<?php
    require "../../config/database.inc.php";
    
    // session_set_cookie_params([
    //     'lifetime' => 60*60*60*60,
    //     'path' => '/',
    // ]);
    // session_start();
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();

    if($_SESSION['loggedIn']){
        $sql_query = "SELECT * FROM bd_data_general";
        $result = mysqli_query($con, $sql_query);
        $json_array = array();
    
        while($row = mysqli_fetch_assoc($result))
        {
            $json_array[] = $row;
        }
    
        echo json_encode($json_array);

    }
?>