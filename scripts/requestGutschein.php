<?php
    require "../config/database.inc.php";
    
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();
    

    $code = htmlspecialchars(stripslashes(trim($_POST['code'])));

    if($_COOKIE['LOGGEDIN']){

        $stmt = $con->prepare("SELECT * FROM coupons WHERE code=?");
        $stmt->bind_param("s", $code);
    
        if($stmt->execute()){
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                // Eintrag ist vorhanden
                while ($row = $result->fetch_assoc()) {
                    echo $row["code"] . "_" . $row["value"] . "_" . $row["redeemedTimestamp"] . "_" . $row["redeemedCustomer"] . "_" . $row["redeemedMember"];
                }
            } else {
                // Eintrag ist nicht vorhanden
                echo 0;
            }
        } else {
            echo 0;
        }
    
        $stmt->close();
    }
?>