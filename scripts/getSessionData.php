<?php
    require "../config/database.inc.php";
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
    session_start();

    if(isset($_COOKIE['LOGGEDIN'])){
        $stmt = $con->prepare("SELECT * FROM employees WHERE token=?");
        $stmt->bind_param("s", $_COOKIE['LOGGEDIN']);
    
        if($stmt->execute()){
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    if($row["state"] == 4){
                        setcookie("LOGGEDIN", "", time() - 3600);

                        $value = "";
                        $stmt2 = $con->prepare("UPDATE employees SET `token`=? WHERE id=?");
                        $stmt2->bind_param("si", $value, $_SESSION['accountID']);
                        if(!$stmt2->execute()){
                            echo 0;
                        }
                        $stmt2->close();
                        
                    } else {
                        $_SESSION['accountID'] = $row["id"];
                        $_SESSION['firstname'] = $row["firstname"];
                        $_SESSION['lastname'] = $row["lastname"];
                        $_SESSION['currentSidebarID'] = $row["currentSidebarID"];
                        $_SESSION['currentSubSidebarID'] = $row["currentSubSidebarID"];
                        $_SESSION['positionID'] = $row["positionID"];
                        echo $row['id'] . "_" . $row['firstname'] . "_" . $row['lastname'] . "_" . $row['currentSidebarID'] . "_" . $row['currentSubSidebarID'] . "_" . $row['positionID'];
                    }
                }
            } else {
                echo 0;
            }
        } else {
            echo 0;
        }
        $stmt->close();
    }
?>