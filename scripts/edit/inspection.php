<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
    session_start();
    

    $id = $_POST['id'];
    $value = $_POST['value'];
    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));

    if($_COOKIE['LOGGEDIN']){
        $stmt = $con->prepare("UPDATE inspectionPrice SET `name`=?,`value`=? WHERE id=?");
        $stmt->bind_param("sii", $name, $value, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>