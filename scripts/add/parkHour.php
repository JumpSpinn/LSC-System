<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
    session_start();
    

    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $value = $_POST['value'];

    if($_COOKIE['LOGGEDIN']){
        $stmt = $con->prepare("INSERT INTO parkHours (`name`, `value`) VALUES (?,?)");
        $stmt->bind_param("si", $name, $value);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }

?>