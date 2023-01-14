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
    
    $id = $_POST['id'];
    $syncedTo = $_POST['syncedTo'];

    if($_SESSION['loggedIn']){
        
        $stmt = $con->prepare("UPDATE bh SET `syncedTo`=? WHERE id=?");
        $stmt->bind_param("ii", $syncedTo, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>