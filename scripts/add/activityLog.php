<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $timestamp = $_POST['timestamp'];
    $logType = $_POST['logType'];
    $message = htmlspecialchars(stripslashes(trim($_POST['message'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO activityLog (`timestamp`, `message`, `logType`) VALUES (?,?,?)");
        $stmt->bind_param("isi", $timestamp, $message, $logType);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }
?>