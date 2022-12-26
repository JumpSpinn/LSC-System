<?php
    require "../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();
    

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