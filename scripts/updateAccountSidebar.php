<?php
    require "../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $currentSidebarID = mysqli_real_escape_string($con, $_POST['currentSidebarID']);
    $currentSubSidebarID = mysqli_real_escape_string($con, $_POST['currentSubSidebarID']);
    $id = $_SESSION['accountID'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE employees SET `currentSidebarID`=?,`currentSubSidebarID`=? WHERE id=?");
        $stmt->bind_param("iii", $currentSidebarID, $currentSubSidebarID, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>