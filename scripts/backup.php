<?php
    $host = "localhost";
    $user = "wnumglnv_lsc";   
    $pw = "1DrhtBgLq!15^nen";
    $database = "lsc_buchhaltung";
    
    //$dumpfile = "./backups/" . $database . "_" . date("Y-m-d_H-i-s") . ".sql";
    $dumpfile = "/tmp/mydb_db.sql";
    
    // /tmp/mydb_db.sql

    echo "Start dump\n";
    exec("mysqldump --user=$user --password=$pw --host=$host $database > $dumpfile");
    echo "-- Dump completed -- ";
    echo $dumpfile;
?>