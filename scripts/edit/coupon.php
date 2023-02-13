<?php
    require "../../config/database.inc.php";
    
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();
    

    $id = $_POST['id'];
    $value = $_POST['value'];
    $code = htmlspecialchars(stripslashes(trim($_POST['code'])));
    $type = htmlspecialchars(stripslashes(trim($_POST['type'])));

    if($_COOKIE['LOGGEDIN']){
        $stmt = $con->prepare("UPDATE coupons SET `code`=?,`type`=?,`value`=? WHERE id=?");
        $stmt->bind_param("ssii", $code, $type, $value, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>