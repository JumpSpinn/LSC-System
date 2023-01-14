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
    

    $id = $_POST['id'];
    $lastEditMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $lastEditTimestamp = $_POST['lastEditTimestamp'];
    $customerName = htmlspecialchars(stripslashes(trim($_POST['customerName'])));
    $contactName = htmlspecialchars(stripslashes(trim($_POST['contactName'])));
    $plz = $_POST['plz'];
    $rabatt = $_POST['rabatt'];
    $notice = htmlspecialchars(stripslashes(trim($_POST['notice'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE servicePartners SET `lastEditMember`=?,`lastEditTimestamp`=?,`customerName`=?,`contactName`=?,`plz`=?,`rabatt`=?,`notice`=? WHERE id=?");
        $stmt->bind_param("sissiisi", $lastEditMember,$lastEditTimestamp,$customerName,$contactName,$plz,$rabatt,$notice, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>