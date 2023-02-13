<?php
    require "../config/database.inc.php";
    
    ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    session_set_cookie_params(time() + (86400 * 7));
    session_start();

    $firstname = htmlspecialchars(stripslashes(trim($_POST['firstname'])));
    $lastname = htmlspecialchars(stripslashes(trim($_POST['lastname'])));
    $password = htmlspecialchars(stripslashes(trim($_POST['password'])));
    $encrypted_password = hash("sha256", $password);

    $stmt = $con->prepare("SELECT * FROM employees WHERE firstname=? AND lastname=?");
    $stmt->bind_param("ss", $firstname, $lastname);

    if($stmt->execute()){
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            if($row["pass"] == $encrypted_password){
                if($row["state"] == 4){
                    echo "failed_Du wurdest suspendiert & hast daher keinen Zugriff auf das System! Bitte melde dich bei der Führungsebene!_Begründung: " . $row["stateReason"] ;
                } else {
                    $_SESSION['loggedIn'] = true;
                    $_SESSION['accountID'] = $row["id"];
                    $_SESSION['firstname'] = $row["firstname"];
                    $_SESSION['lastname'] = $row["lastname"];
                    $_SESSION['currentSidebarID'] = $row["currentSidebarID"];
                    $_SESSION['currentSubSidebarID'] = $row["currentSubSidebarID"];
                    $_SESSION['positionID'] = $row["positionID"];

                    echo $_SESSION['firstname'] . "_" . $_SESSION['lastname'] . "_" . $_SESSION['positionID'] . "_" . $_SESSION['currentSidebarID'] . "_" . $_SESSION['currentSubSidebarID'];
                }
            } else {
                echo "failed_Benutzerdaten sind nicht korrekt!";
            }
        }
    } else {
        echo "failed_Unbekannter Fehler! #303";
    }
    $stmt->close();
?>