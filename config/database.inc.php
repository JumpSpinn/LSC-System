<?php
    $host = "localhost";
    $user = "wnumglnv_lsc";   
    $pw = "W3YA5Wt]+yb)zkqH22Y-vKshR=P~LT~eVpBF13njhG)FejEy4yrH-xjas7hE4Fds";
    $database = "lsc_buchhaltung";

    $con = new mysqli($host, $user, $pw, $database);
    if(!$con){
        die("Connection failed: " . mysqli_connect_error());
    }

    mysqli_set_charset($con, "utf8");
?>