<?php
    require "../../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();

    $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
    $lastEditMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $minAmount = $_POST['minAmount'];
    $currentAmount = $_POST['currentAmount'];
    $lastEditTimestamp = $_POST['lastEditTimestamp'];

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO stockpile (`name`, `minAmount`, `currentAmount`, `lastEditMember`, `lastEditTimestamp`) VALUES (?,?,?,?,?)");
        $stmt->bind_param("siisi", $name, $minAmount, $currentAmount, $lastEditMember, $lastEditTimestamp);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();

    }
?>