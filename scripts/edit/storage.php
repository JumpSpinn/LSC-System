<?php
    require "../../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
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