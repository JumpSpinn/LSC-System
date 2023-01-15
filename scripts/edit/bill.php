<?php
    require "../../config/database.inc.php";
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();

    $id = $_POST['id'];
    $newState = 1;

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE createdBills SET `state`=? WHERE id=?");
        $stmt->bind_param("ii", $newState, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>