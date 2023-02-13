<?php
    require "../config/database.inc.php";
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();

    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("SELECT * FROM customers WHERE name=?");
        $stmt->bind_param("s", $name);
    
        if($stmt->execute()){
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                // Eintrag ist vorhanden
                echo 0;
            } else {
                // Eintrag ist nicht vorhanden
                echo 1;
            }
        } else {
            echo 2;
        }
    
        $stmt->close();

    }
?>