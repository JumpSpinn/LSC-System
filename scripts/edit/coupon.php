<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $id = $_POST['id'];
    $value = $_POST['value'];
    $code = htmlspecialchars(stripslashes(trim($_POST['code'])));
    $type = htmlspecialchars(stripslashes(trim($_POST['type'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE coupons SET `code`=?,`type`=?,`value`=? WHERE id=?");
        $stmt->bind_param("ssii", $code, $type, $value, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>