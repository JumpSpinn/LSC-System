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
    

    $rankName = htmlspecialchars(stripslashes(trim($_POST['rankName'])));
    $sidebarPermissions = json_encode($_POST['sidebarPermissions'], true);
    $pagePermissions = json_encode($_POST['pagePermissions'], true);

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO memberPositions (`name`,`sidebarPermissions`,`pagePermissions`) VALUES (?,?,?)");
        $stmt->bind_param("sss", $rankName, $sidebarPermissions, $pagePermissions);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }
?>