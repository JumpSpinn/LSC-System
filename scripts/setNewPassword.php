<?php
    require "../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();
    
    
    $firstname = htmlspecialchars(stripslashes(trim($_POST['firstname'])));
    $lastname = htmlspecialchars(stripslashes(trim($_POST['lastname'])));
    $password = htmlspecialchars(stripslashes(trim($_POST['password'])));
    $encrypted_password = hash("sha256", $password);

    $stmt = $con->prepare("UPDATE employees SET `pass`=? WHERE firstname=? AND lastname=?");
    $stmt->bind_param("sss", $encrypted_password, $firstname, $lastname);

    if($stmt->execute()){
        echo 1;
    } else {
        echo 0;
    }

    $stmt->close();
?>