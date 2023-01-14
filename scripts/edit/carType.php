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
    $id = $_POST['id'];
    $purchasingPrice = $_POST['purchasingPrice'];
    $markup = $_POST['markup'];
    $percent = $_POST['percent'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE carTypes SET `name`=?,`purchasingPrice`=?,`markup`=?,`percent`=? WHERE id=?");
        $stmt->bind_param("siiii", $name, $purchasingPrice, $markup, $percent, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }

?>