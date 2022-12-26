<?php
    require "../../config/database.inc.php";

    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();

    if($_SESSION['loggedIn']){
        $sql_query = "SELECT * FROM memberPositions";
        $result = mysqli_query($con, $sql_query);
        $json_array = array();
    
        while($row = mysqli_fetch_assoc($result))
        {
            $json_array[] = $row;
        }
    
        echo json_encode($json_array);
    }
?>