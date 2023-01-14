<?php
    require "../config/database.inc.php";
    
    // session_set_cookie_params([
    //     'lifetime' => 60*60*60*60,
    //     'path' => '/',
    // ]);
    // session_start();
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