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

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO employees (`firstname`, `lastname`, `pass`, `positionID`, `memberSince`, `phonenumber`, `iban`, `warnings`, `state`, `stateReason`, `currentSidebarID`, `currentSubSidebarID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("sssiissiisii", $firstname, $lastname, $password, $positionID, $memberSince, $phonenumber, $iban, $warnings, $state, $stateReason, $currentSidebarID, $currentSubSidebarID);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }

?>