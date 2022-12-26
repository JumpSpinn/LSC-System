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
    $value = $_POST['value'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE parkHours SET `name`=?,`value`=? WHERE id=?");
        $stmt->bind_param("sii", $name, $value, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>