<?php
    require "../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
    session_start();
    

    $id = $_POST['id'];
    $syncedTo = $_POST['syncedTo'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE customers SET `syncedTo`=? WHERE id=?");
        $stmt->bind_param("ii", $syncedTo, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>