<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 14));
    session_set_cookie_params(time() + (86400 * 14));
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