<?php
    require "../../config/database.inc.php";
    
    // session_set_cookie_params([
    //     'lifetime' => 60*60*60*60,
    //     'path' => '/',
    // ]);
    // session_start();
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $id = $_POST['id'];
    $resetPassword = "";

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE employees SET `pass`=? WHERE id=?");
        $stmt->bind_param("si", $resetPassword, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>