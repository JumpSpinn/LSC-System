<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $timestamp = $_POST['timestamp'];
    $checked = $_POST['checked'];
    $mainData = $_POST['mainData'];
    $choosedData = $_POST['choosedData'];
    $syncedTo = $_POST['syncedTo'];
    $createdBill = $_POST['createdBill'];

    if($_SESSION['loggedIn']){

        $stmt = $con->prepare("INSERT INTO bh (`timestamp`, `controlled`, `mainData`, `choosedData`, `syncedTo`, `createdBill`) VALUES (?,?,?,?,?,?)");
        $stmt->bind_param("iissii", $timestamp, $checked, $mainData, $choosedData, $syncedTo, $createdBill);
    
        if(!$stmt->execute()){
            echo 0;
        } else {
            echo $stmt->insert_id;
        }
        
        $stmt->close();
    }
?>