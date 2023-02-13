<?php
    require "../../config/database.inc.php";
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 14));
    session_set_cookie_params(time() + (86400 * 14));
    session_start();

    $timestamp = $_POST['timestamp'];
    $checked = $_POST['checked'];
    $mainData = $_POST['mainData'];
    $choosedData = $_POST['choosedData'];
    $syncedTo = $_POST['syncedTo'];
    $createdBill = $_POST['createdBill'];
    $archived = $_POST['archived'];

    if($_SESSION['loggedIn']){

        $stmt = $con->prepare("INSERT INTO bh (`timestamp`, `controlled`, `mainData`, `choosedData`, `syncedTo`, `createdBill`, `archived`) VALUES (?,?,?,?,?,?,?)");
        $stmt->bind_param("iissiii", $timestamp, $checked, $mainData, $choosedData, $syncedTo, $createdBill, $archived);
    
        if(!$stmt->execute()){
            echo 0;
        } else {
            echo $stmt->insert_id;
        }
        
        $stmt->close();
    }
?>