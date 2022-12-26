<?php
    require "../../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
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