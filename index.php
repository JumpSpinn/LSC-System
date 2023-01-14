<?php
    header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header('Cache-Control: no-cache');
    header('Pragma: no-cache');
    header("X-XSS-Protection: 1; mode=block");
?>
<html>
    <head>
        <!-- TITLE -->
        <title>Buchhaltungssystem2 | Los Santos Customs</title>

        <!-- META -->
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/assets/favicon/ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff">
        <meta http-equiv="cache-control" content="no-cache" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="-1" />

        <!-- FAVICON -->
        <link rel="apple-touch-icon" sizes="57x57" href="/assets/favicon/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/assets/favicon/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/assets/favicon/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/assets/favicon/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/assets/favicon/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/assets/favicon/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/assets/favicon/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/favicon/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="/assets/favicon/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png">

        <!-- jQUERY -->
        <script src="/assets/js/jquery.js"></script>
        <script src="/assets/js/jquery-ui.js"></script>

        <!-- SCRIPTS -->
        <script src="/js/helper.js"></script>
        <script src="/js/main.js"></script>
        <script src="/js/login.js"></script>
        <script src="/js/sidebar.js"></script>
        <script src="/js/getData.js"></script>
        <script src="/js/enums.js"></script>
        <script src="/js/generalFunctions.js"></script>
        <script src="/js/notifications.js"></script>
        <script src="/js/search.js"></script>

        <!-- CSS -->
        <link rel="stylesheet" href="/assets/materialicons/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="/css/base.css?<?php echo rand(0, 1000); ?>">

        <!-- OTHER STUFF -->
        <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js" integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==" crossorigin=""></script>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==" crossorigin="" /> 
    
        <?php

            // session_set_cookie_params([
            //     'lifetime' => 60*60*60*60,
            //     'path' => '/',
            // ]);
            // session_start();
            ini_set('session.gc_maxlifetime', 86400);
            session_set_cookie_params(86400);
            session_start();

            $loggedIn = false;
            $version = file_get_contents('version.txt');

            if (isset($_SESSION['loggedIn']) && $_SESSION['loggedIn'] == true) {
                $loggedIn = true;
                echo "<script>getSessionData();</script>";
            } else {
                $loggedIn = false;
            }

        ?>
    </head>
    <body>
        <div class="wrapper">
            
            <div class="login_container" id="requestLogin" style="display: <?php echo ($loggedIn ? "none" : "flex"); ?>;">
                <div class="login_brand">
                    <img src="/assets/img/logo_transparent.png">
                    <span class="brand_title">Buchhaltungssystem2</span>
                </div>
                <div class="login_form">
                    <div class="login_input">
                        <span>Vorname</span>
                        <input type="text" placeholder="Vorname eingeben.." id="login_firstname">
                    </div>
                    <div class="login_input">
                        <span>Nachname</span>
                        <input type="text" placeholder="Nachname eingeben.." id="login_lastname">
                    </div>
                    <div class="login_btn" id="requestLoginData">Einloggen</div>
                </div>
                <div class="login_warning"></div>
            </div>

            <div class="login_container" id="setPassword" style='display: none'>
                <div class="login_brand">
                    <img src="/assets/img/logo_transparent.png">
                    <span class="brand_title">Buchhaltungssystem</span>
                </div>
                <div class="login_form">
                    <div class="login_input">
                        <span>Neues Passwort setzen:</span>
                        <input type="password" placeholder=".." id="login_setPassword">
                    </div>
                    <div class="login_input">
                        <span>Neues Passwort wiederholen:</span>
                        <input type="password" placeholder=".." id="login_setPasswordWdh">
                    </div>
                    <div class="login_btn" id="setPasswordConfirm">Neues Passwort festlegen</div>
                </div>
                <div class="login_warning"></div>
            </div>

            <div class="login_container" id="checkPassword" style='display: none'>
                <div class="login_brand">
                    <img src="/assets/img/logo_transparent.png">
                    <span class="brand_title">Buchhaltungssystem</span>
                </div>
                <div class="login_form">
                    <div class="login_input">
                        <span>Passwort:</span>
                        <input type="password" placeholder="Passwort eingeben.." id="login_checkPassword">
                    </div>
                    <div class="login_btn" id="checkPasswordConfirm">Einloggen</div>
                </div>
                <div class="login_warning"></div>
                <!-- Sperrgrund -->
                <div class="login_blocked_container"></div>
            </div>

            <!-- SYSTEM -->
            <div class="system_container" style="display: <?php echo ($loggedIn ? "flex" : "none"); ?>;">
                <!-- GLOBAL LOADING -->
                <div class="global_loading_container">
                    <em class="mdi mdi-wrench" id="wrench_icon"></em>
                    <em class="mdi mdi-cog" id="cog_icon"></em>
                    <p>Anfrage wird bearbeitet..</p>
                </div>
                <!-- SIDEBAR -->
                <div class="sidebar_container">
                    <div class="sidebar_header_container">
                        <div class="sidebar_header_brand">
                            <img src="/assets/img/logo_transparent.png">
                        </div>
                        <div class="sidebar_header_details">
                            <span class="sidebar_header_title"><span>Buchhaltungssystem</span></span>
                            <span class="sidebar_header_subtitle"><span>Hallo, </span><p id="currentLoggedInUser">-</p></span>
                            <span class="sidebar_header_rang"><span>Position:</span><p id="currentLoggedInUserPosition">-</p></span>
                        </div>
                    </div>
                    <div class="sidebar_elements">
                        <ul class="sidebar_links"></ul>
                    </div>
                    <div class="sidebar_discord_server_container"><a href="https://discord.gg/yDBvWPMW" target="_blank">Internes System (Discord) beitreten</a></div>
                    <div class="sidebar_system_version">Version <?php echo $version; ?></div>
                </div>
                <!-- PAGES -->
                <div class="system_page_container">
                    <div class="system_page"></div>
                </div>
            </div>
        </div>
    </body>
</html>