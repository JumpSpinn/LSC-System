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
    

    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $ek = $_POST['ek'];
    $percent = $_POST['percent'];
    $vk = $_POST['vk'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO prices (`name`, `ek`, `percent`, `vk`) VALUES (?,?,?,?)");
        $stmt->bind_param("sdid", $name, $ek, $percent, $vk);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }

?>