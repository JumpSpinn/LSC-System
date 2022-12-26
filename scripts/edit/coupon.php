<?php
    require "../../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();
    

    $id = $_POST['id'];
    $value = $_POST['value'];
    $code = htmlspecialchars(stripslashes(trim($_POST['code'])));
    $type = htmlspecialchars(stripslashes(trim($_POST['type'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE coupons SET `code`=?,`type`=?,`value`=? WHERE id=?");
        $stmt->bind_param("ssii", $code, $type, $value, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>