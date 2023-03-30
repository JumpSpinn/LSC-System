<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
    session_start();
    

    $type = $_POST['type'];
    $value = $_POST['value'];

    if($_COOKIE['LOGGEDIN']){
        $stmt = $con->prepare("UPDATE bd_data_general SET `value`=? WHERE `type`=?");
        $stmt->bind_param("ii", $value, $type);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>