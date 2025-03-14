<?php
    require "../../config/database.inc.php";
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
    session_start();

    $lastEditMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $createdMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $title = $_POST['title'];
    $createdTimestamp = htmlspecialchars(stripslashes(trim($_POST['createdTimestamp'])));
    $lastEditTimestamp = htmlspecialchars(stripslashes(trim($_POST['lastEditTimestamp'])));
    $message = $_POST['message'];
    $state = htmlspecialchars(stripslashes(trim($_POST['state'])));

    if($_COOKIE['LOGGEDIN']){
        $stmt = $con->prepare("INSERT INTO importantmessages (`title`, `createdMember`, `createdTimestamp`, `lastEditMember`, `lastEditTimestamp`, `message`, `state`) VALUES (?,?,?,?,?,?,?)");
        $stmt->bind_param("ssisisi", $title, $createdMember, $createdTimestamp, $lastEditMember, $lastEditTimestamp, $message, $state);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }

?>