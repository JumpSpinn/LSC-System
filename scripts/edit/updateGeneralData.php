<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $type = $_POST['type'];
    $value = $_POST['value'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE bd_data_general SET `value`=? WHERE `type`=?");
        $stmt->bind_param("ii", $value, $type);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>