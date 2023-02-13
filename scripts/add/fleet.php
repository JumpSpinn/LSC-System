<?php
    require "../../config/database.inc.php";
    
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 14));
    session_set_cookie_params(time() + (86400 * 14));
    session_start();
    

    $km = $_POST['km'];
    $oil = $_POST['oil'];
    $battery = $_POST['battery'];
    $lastService = $_POST['lastService'];
    $model = htmlspecialchars(stripslashes(trim($_POST['model'])));
    $numberplate = htmlspecialchars(stripslashes(trim($_POST['numberplate'])));
    $lastServiceMember = $_SESSION["firstname"] . " " . $_SESSION["lastname"];
    $nextService = htmlspecialchars(stripslashes(trim($_POST['nextService'])));
    $currentMember = htmlspecialchars(stripslashes(trim($_POST['currentMember'])));

    if($_SESSION['loggedIn']){
        $stmt = $con->prepare("INSERT INTO fleet (`model`, `numberplate`, `km`, `oil`, `battery`, `lastService`, `lastServiceMember`, `nextService`, `currentMember`) VALUES (?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("ssiiiisss", $model, $numberplate, $km, $oil, $battery, $lastService, $lastServiceMember, $nextService, $currentMember);
    
        if(!$stmt->execute()){
            echo 0;
        }
        
        $stmt->close();
    }
?>