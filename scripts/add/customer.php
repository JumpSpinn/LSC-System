<?php
    require "../../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();
    

    if($_SESSION['loggedIn']){
        $number = $_POST['number'];
        $createdTimestamp = $_POST['createdTimestamp'];
        $phonenumber = $_POST['phonenumber'];
        $rabatt = $_POST['rabatt'];
        $disabled = $_POST['disabled'];
        $syncedTo = $_POST['syncedTo'];
        $isState = $_POST['isState'];
        $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
        $createdMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
        $notice = htmlspecialchars(stripslashes(trim($_POST['notice'])));
        $enterState = htmlspecialchars(stripslashes(trim($_POST['enterState'])));
    
        $stmt = $con->prepare("INSERT INTO customers (`name`, `number`, `createdMember`, `createdTimestamp`, `enterState`, `phonenumber`, `rabatt`, `notice`, `disabled`, `syncedTo`, `isState`) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("sisisiisiii", $name, $number, $createdMember, $createdTimestamp, $enterState, $phonenumber, $rabatt, $notice, $disabled, $syncedTo, $isState);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }
?>