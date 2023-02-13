<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
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

    if($_COOKIE['LOGGEDIN']){
        $stmt = $con->prepare("UPDATE employees SET `firstname`=?,`lastname`=?,`positionID`=?,`phonenumber`=?,`iban`=?,`state`=?,`stateReason`=?,`warnings`=? WHERE id=?");
        $stmt->bind_param("ssiisisii", $firstname, $lastname, $positionID, $phonenumber, $iban, $state, $stateReason, $warnings, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>