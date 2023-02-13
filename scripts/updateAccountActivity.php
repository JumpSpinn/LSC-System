<?php
    require "../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 14));
    session_set_cookie_params(time() + (86400 * 14));
    session_start();
    

    $lastAction = mysqli_real_escape_string($con, $_POST['lastAction']);

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE employees SET `lastAction`=? WHERE id=?");
        $stmt->bind_param("si", $lastAction, $_SESSION['accountID']);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>