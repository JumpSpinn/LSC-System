<?php
    require "../../config/database.inc.php";
    
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();
    

    $id = $_POST['positionID'];
    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $sidebarPermissions = json_encode($_POST['sidebarPermissions'], true);
    $pagePermissions = json_encode($_POST['pagePermissions'], true);

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE memberPositions SET `name`=?,`sidebarPermissions`=?,`pagePermissions`=? WHERE id=?");
        $stmt->bind_param("sssi", $name, $sidebarPermissions, $pagePermissions, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>