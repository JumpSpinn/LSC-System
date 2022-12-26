<?php
    require "../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();
    

    $code = htmlspecialchars(stripslashes(trim($_POST['code'])));
    $redeemedCustomer = htmlspecialchars(stripslashes(trim($_POST['redeemedCustomer'])));
    $redeemedMember = htmlspecialchars(stripslashes(trim($_POST['redeemedMember'])));
    $redeemedTimestamp = $_POST['redeemedTimestamp'];

    if($_SESSION['loggedIn']){

        $stmt = $con->prepare("UPDATE coupons SET `redeemedCustomer`=?,`redeemedMember`=?,`redeemedTimestamp`=? WHERE code=?");
        $stmt->bind_param("ssis", $redeemedCustomer, $redeemedMember, $redeemedTimestamp, $code);
    
        $stmt->execute();
        $stmt->close();

    }
?>