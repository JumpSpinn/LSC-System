<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
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