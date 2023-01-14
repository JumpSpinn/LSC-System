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

    $code = htmlspecialchars(stripslashes(trim($_POST['code'])));
    $type = htmlspecialchars(stripslashes(trim($_POST['type'])));
    $createdMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $createdTimestamp = $_POST['createdTimestamp'];
    $value = $_POST['value'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO coupons (`code`, `type`, `createdMember`, `createdTimestamp`, `value`) VALUES (?,?,?,?,?)");
        $stmt->bind_param("sssii", $code, $type, $createdMember, $createdTimestamp, $value);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }
?>