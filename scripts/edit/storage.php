<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 14));
    session_set_cookie_params(time() + (86400 * 14));
    session_start();
    

    $id = $_POST['id'];
    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $minAmount = $_POST['minAmount'];
    $currentAmount = $_POST['currentAmount'];
    $lastEditMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $lastEditTimestamp = $_POST['lastEditTimestamp'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE stockpile SET `name`=?,`minAmount`=?,`currentAmount`=?,`lastEditMember`=?,`lastEditTimestamp`=? WHERE id=?");
        $stmt->bind_param("siisii", $name,$minAmount,$currentAmount,$lastEditMember,$lastEditTimestamp,$id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>