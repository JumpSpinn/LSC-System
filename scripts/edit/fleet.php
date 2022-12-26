<?php
    require "../../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();
    

    $id = $_POST['id'];
    $km = $_POST['km'];
    $oil = $_POST['oil'];
    $battery = $_POST['battery'];
    $lastService = $_POST['lastService'];
    $currentMember = $_POST['currentMember'];
    $model = htmlspecialchars(stripslashes(trim($_POST['model'])));
    $numberplate = htmlspecialchars(stripslashes(trim($_POST['numberplate'])));
    $lastServiceMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $nextService = htmlspecialchars(stripslashes(trim($_POST['nextService'])));
    $currentMember = htmlspecialchars(stripslashes(trim($_POST['currentMember'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("UPDATE fleet SET `model`=?,`numberplate`=?,`km`=?,`oil`=?,`battery`=?,`lastService`=?,`lastServiceMember`=?,`nextService`=?,`currentMember`=? WHERE id=?");
        $stmt->bind_param("ssiiiisssi", $model, $numberplate, $km, $oil, $battery, $lastService, $lastServiceMember, $nextService, $currentMember, $id);
    
        if(!$stmt->execute()){
            echo 0;
        }
    
        $stmt->close();

    }
?>