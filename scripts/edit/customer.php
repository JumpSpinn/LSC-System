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
    $phonenumber = $_POST['phonenumber'];
    $rabatt = $_POST['rabatt'];
    $disabled = $_POST['disabled'];
    $isState = $_POST['isState'];
    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $enterState = htmlspecialchars(stripslashes(trim($_POST['enterState'])));
    $notice = htmlspecialchars(stripslashes(trim($_POST['notice'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE customers SET `name`=?,`enterState`=?,`phonenumber`=?,`rabatt`=?,`notice`=?,`disabled`=?,`isState`=? WHERE id=?");
        $stmt->bind_param("ssiisiii", $name, $enterState, $phonenumber, $rabatt, $notice, $disabled, $isState, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>