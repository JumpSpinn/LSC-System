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
    

    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $purchasingPrice = $_POST['purchasingPrice'];
    $markup = $_POST['markup'];
    $percent = $_POST['percent'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO carTypes (`name`, `purchasingPrice`, `markup`, `percent`) VALUES (?,?,?,?)");
        $stmt->bind_param("siii", $name, $purchasingPrice, $markup, $percent);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }
?>