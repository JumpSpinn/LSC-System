<?php
    require "../../config/database.inc.php";
    
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();
    

    $id = $_POST['id'];
    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $ek = $_POST['ek'];
    $percent = $_POST['percent'];
    $vk = $_POST['vk'];

    if($_COOKIE['LOGGEDIN']){
        $stmt = $con->prepare("UPDATE prices SET `name`=?,`ek`=?,`percent`=?,`vk`=? WHERE id=?");
        $stmt->bind_param("sdidi", $name, $ek, $percent, $vk, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>