<?php
    require "../../config/database.inc.php";
    
    // session_set_cookie_params([
    //     'lifetime' => 60*60*60*60,
    //     'path' => '/',
    // ]);
    // session_start();
    ini_set('session.gc_maxlifetime', 3600);
    session_set_cookie_params(3600);
    session_start();
    

    $type = $_POST['type'];
    $value = $_POST['value'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE bd_data_general SET `value`=? WHERE `type`=?");
        $stmt->bind_param("ii", $value, $type);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>