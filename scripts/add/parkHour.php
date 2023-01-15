<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $value = $_POST['value'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO parkHours (`name`, `value`) VALUES (?,?)");
        $stmt->bind_param("si", $name, $value);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }

?>