<?php
    require "../../config/database.inc.php";
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();

    $createdBy = $_POST['createdBy'];
    $createdTimestamp = $_POST['createdTimestamp'];
    $data = $_POST['data'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO createdBills (`createdBy`, `createdTimestamp`, `data`) VALUES (?,?,?)");
        $stmt->bind_param("sis", $createdBy, $createdTimestamp, $data);

        if(!$stmt->execute()){
            echo 0;
        } else {
            echo $stmt->insert_id;
        }
        
        $stmt->close();
    }
?>