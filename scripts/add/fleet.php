<?php
    require "../../config/database.inc.php";
    
    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
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