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
    

    $lastEditMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $createdMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $title = htmlspecialchars(stripslashes(trim($_POST['title'])));
    $createdTimestamp = htmlspecialchars(stripslashes(trim($_POST['createdTimestamp'])));
    $lastEditTimestamp = htmlspecialchars(stripslashes(trim($_POST['lastEditTimestamp'])));
    $message = htmlspecialchars(stripslashes(trim($_POST['message'])));
    $state = htmlspecialchars(stripslashes(trim($_POST['state'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO importantmessages (`title`, `createdMember`, `createdTimestamp`, `lastEditMember`, `lastEditTimestamp`, `message`, `state`) VALUES (?,?,?,?,?,?,?)");
        $stmt->bind_param("ssisisi", $title, $createdMember, $createdTimestamp, $lastEditMember, $lastEditTimestamp, $message, $state);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }

?>