<?php
    require "../config/database.inc.php";
    
    // session_set_cookie_params([
    //     'lifetime' => 60*60*60*60,
    //     'path' => '/',
    // ]);
    // session_start();
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $firstname = htmlspecialchars(stripslashes(trim($_POST['firstname'])));
    $lastname = htmlspecialchars(stripslashes(trim($_POST['lastname'])));

    $stmt = $con->prepare("SELECT * FROM employees WHERE firstname=? AND lastname=?");
    $stmt->bind_param("ss", $firstname, $lastname);

    if($stmt->execute()){
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            if($row["pass"] == ""){
                echo 2;
            } else {
                echo 1;
            }
        }
    } else {
        echo 0;
    }
    $stmt->close();
?>