<?php
    require "../../config/database.inc.php";
    
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();
    

    $positionID = $_POST['positionID'];
    $memberSince = $_POST['memberSince'];
    $phonenumber = $_POST['phonenumber'];
    $firstname = htmlspecialchars(stripslashes(trim($_POST['firstname'])));
    $lastname = htmlspecialchars(stripslashes(trim($_POST['lastname'])));
    $iban = "";
    $warnings = 0;
    $state = 0;
    $stateReason = "";
    $currentSidebarID = 1;
    $currentSubSidebarID = 0;
    $password = "";

    if($_COOKIE['LOGGEDIN']){
        $stmt = $con->prepare("INSERT INTO employees (`firstname`, `lastname`, `pass`, `positionID`, `memberSince`, `phonenumber`, `iban`, `warnings`, `state`, `stateReason`, `currentSidebarID`, `currentSubSidebarID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("sssiissiisii", $firstname, $lastname, $password, $positionID, $memberSince, $phonenumber, $iban, $warnings, $state, $stateReason, $currentSidebarID, $currentSubSidebarID);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }

?>