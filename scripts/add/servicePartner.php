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