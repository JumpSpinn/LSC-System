<?php
    require "../config/database.inc.php";
    
    // session_set_cookie_params([
    //     'lifetime' => 60*60*60*60,
    //     'path' => '/',
    // ]);
    // session_start();
    ini_set('session.gc_maxlifetime', 3600);
    session_set_cookie_params(3600);
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