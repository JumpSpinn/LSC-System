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
    

    $id = $_POST['id'];
    $title = htmlspecialchars(stripslashes(trim($_POST['title'])));
    $lastEditMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $lastEditTimestamp = htmlspecialchars(stripslashes(trim($_POST['lastEditTimestamp'])));
    $message = htmlspecialchars(stripslashes(trim($_POST['message'])));
    $state = htmlspecialchars(stripslashes(trim($_POST['state'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE importantmessages SET `title`=?,`lastEditMember`=?,`lastEditTimestamp`=?,`message`=?,`state`=? WHERE id=?");
        $stmt->bind_param("ssisii", $title, $lastEditMember, $lastEditTimestamp, $message, $state, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>