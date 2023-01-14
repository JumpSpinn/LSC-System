<?php
    require "../config/database.inc.php";
    
    // session_set_cookie_params([
    //     'lifetime' => 60*60*60*60,
    //     'path' => '/',
    // ]);
    // session_start();
    ini_set('session.gc_maxlifetime', 86400);
    session_set_cookie_params(86400);
    session_start();
    

    $number = $_POST['number'];

    if($_SESSION['loggedIn']){

        $stmt = $con->prepare("SELECT * FROM customers WHERE number=?");
        $stmt->bind_param("i", $number);
    
        if($stmt->execute()){
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                // Eintrag ist vorhanden
                while ($row = $result->fetch_assoc()) {
                    echo $row["name"] . "_" . $row["number"] . "_" . $row["rabatt"] . "_" . $row["enterState"] . "_" . $row["disabled"] . "_" . $row["isState"];
                }
            } else {
                // Eintrag ist nicht vorhanden
                echo 1;
            }
        } else {
            echo 1;
        }
    
        $stmt->close();

    }
?>