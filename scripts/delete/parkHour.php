<?php
    require "../../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();
    

    $id = $_POST['id'];
    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("DELETE FROM parkHours WHERE id=?");
        $stmt->bind_param("i", $id);
        if(!$stmt->execute()){
            echo 0;
        }
        $stmt->close();

    }
?>