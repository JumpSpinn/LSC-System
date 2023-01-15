<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $id = $_POST['id'];
    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $value = $_POST['value'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE parkHours SET `name`=?,`value`=? WHERE id=?");
        $stmt->bind_param("sii", $name, $value, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>