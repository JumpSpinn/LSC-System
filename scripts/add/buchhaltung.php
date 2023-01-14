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
    

    $timestamp = $_POST['timestamp'];
    $checked = $_POST['checked'];
    $mainData = $_POST['mainData'];
    $choosedData = $_POST['choosedData'];
    $syncedTo = $_POST['syncedTo'];

    if($_SESSION['loggedIn']){

        $stmt = $con->prepare("INSERT INTO bh (`timestamp`, `controlled`, `mainData`, `choosedData`, `syncedTo`) VALUES (?,?,?,?,?)");
        $stmt->bind_param("iissi", $timestamp, $checked, $mainData, $choosedData, $syncedTo);
    
        if(!$stmt->execute()){
            echo 0;
        } else {
            echo $stmt->insert_id;
        }
        
        $stmt->close();
    }
?>