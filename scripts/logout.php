<?php
    require "../config/database.inc.php";

    if(isset($_COOKIE['LOGGEDIN'])){
        setcookie("LOGGEDIN", "", time() - 3600);

        $value = "";
        $stmt2 = $con->prepare("UPDATE employees SET `stateReason`=? WHERE id=?");
        $stmt2->bind_param("si", $value, $_SESSION['accountID']);
        if(!$stmt2->execute()){
            echo 0;
        }
        $stmt2->close();
    }
    
    session_destroy();
    echo 0;
?>