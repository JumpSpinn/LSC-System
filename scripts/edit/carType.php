<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
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