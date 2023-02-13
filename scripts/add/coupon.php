<?php
    require "../../config/database.inc.php";
    
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();

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