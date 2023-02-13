<?php
    require "../../config/database.inc.php";
    
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();
    

    $createdMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $lastEditMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $customerName = htmlspecialchars(stripslashes(trim($_POST['customerName'])));
    $contactName = htmlspecialchars(stripslashes(trim($_POST['contactName'])));
    $notice = htmlspecialchars(stripslashes(trim($_POST['notice'])));
    $createdTimestamp = $_POST['createdTimestamp'];
    $lastEditTimestamp = $_POST['lastEditTimestamp'];
    $plz = $_POST['plz'];
    $rabatt = $_POST['rabatt'];

    if($_SESSION['loggedIn']){

        $stmt = $con->prepare("INSERT INTO servicePartners (`createdMember`, `createdTimestamp`, `lastEditMember`, `lastEditTimestamp`, `customerName`, `contactName`, `plz`, `rabatt`, `notice`) VALUES (?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("sisissiis", $createdMember, $createdTimestamp, $lastEditMember, $lastEditTimestamp, $customerName, $contactName, $plz, $rabatt, $notice);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }

?>