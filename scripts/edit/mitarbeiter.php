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
    

    $id = $_POST['accountID'];
    $positionID = $_POST['positionID'];
    $phonenumber = $_POST['phonenumber'];
    $warnings = $_POST['warnings'];
    $firstname = htmlspecialchars(stripslashes(trim($_POST['firstname'])));
    $lastname = htmlspecialchars(stripslashes(trim($_POST['lastname'])));
    $iban = htmlspecialchars(stripslashes(trim($_POST['iban'])));
    $stateReason = htmlspecialchars(stripslashes(trim($_POST['stateReason'])));
    $state = htmlspecialchars(stripslashes(trim($_POST['state'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE employees SET `firstname`=?,`lastname`=?,`positionID`=?,`phonenumber`=?,`iban`=?,`state`=?,`stateReason`=?,`warnings`=? WHERE id=?");
        $stmt->bind_param("ssiisisii", $firstname, $lastname, $positionID, $phonenumber, $iban, $state, $stateReason, $warnings, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>