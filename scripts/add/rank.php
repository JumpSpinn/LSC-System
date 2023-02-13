<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 14));
    session_set_cookie_params(time() + (86400 * 14));
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