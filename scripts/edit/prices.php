<?php
    require "../../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();
    

    $id = $_POST['id'];
    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $ek = $_POST['ek'];
    $percent = $_POST['percent'];
    $vk = $_POST['vk'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE prices SET `name`=?,`ek`=?,`percent`=?,`vk`=? WHERE id=?");
        $stmt->bind_param("sdidi", $name, $ek, $percent, $vk, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>