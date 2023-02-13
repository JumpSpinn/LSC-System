<?php
    require "../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 14));
    session_set_cookie_params(time() + (86400 * 14));
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