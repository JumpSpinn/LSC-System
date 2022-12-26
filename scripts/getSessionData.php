<?php
    require "../config/database.inc.php";

    session_set_cookie_params([
        'lifetime' => 60*60*60*60,
        'path' => '/' . $dir,
        'domain' => $_SERVER['HTTP_HOST'],
    ]);
    session_start();

    $stmt = $con->prepare("SELECT * FROM employees WHERE id=?");
    $stmt->bind_param("s", $_SESSION['accountID']);

    if($stmt->execute()){
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                if($row["state"] == 4){
                    echo 0;
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
?>