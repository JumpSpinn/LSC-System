<?php
    require "../../config/database.inc.php";
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();

    $createdBy = $_POST['createdBy'];
    $createdTimestamp = $_POST['createdTimestamp'];
    $createdFor = $_POST['createdFor'];
    $startDate = $_POST['startDate'];
    $endDate = $_POST['endDate'];
    $weekNumber = $_POST['weekNumber'];
    $data = $_POST['data'];
    $state = $_POST['state'];

    if($_COOKIE['LOGGEDIN']){
        $stmt = $con->prepare("INSERT INTO createdBills (`createdBy`, `createdTimestamp`, `createdFor`, `startDate`, `endDate`, `weekNumber`, `data`, `state`) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->bind_param("sisssssi", $createdBy, $createdTimestamp, $createdFor, $startDate, $endDate, $weekNumber, $data, $state);

        if(!$stmt->execute()){
            echo 0;
        } else {
            echo $stmt->insert_id;
        }
        
        $stmt->close();
    }
?>