<?php
    require "../config/database.inc.php";

    if(isset($_COOKIE['LOGGEDIN'])){
        setcookie("LOGGEDIN", "", time() - 3600);
    }
    
    session_destroy();
    echo 0;
?>