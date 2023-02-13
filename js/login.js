var _storedFirstname = ""
var _storedLastname = ""
var _setNewPassword = false

$(() => {
    $('#requestLoginData').click(() => { checkLoginData() })
    $('#setPasswordConfirm').click(() => { setNewPassword() })
    $('#checkPasswordConfirm').click(() => { checkPassword() })

    $("input").on("keypress", $(document), function(e) {
        if (e.which == 13) {
            if(_storedFirstname == "" && _storedLastname == ""){
                checkLoginData()
            } else if(_setNewPassword){
                setNewPassword()
            } else{
                checkPassword()
            }
        }
    })

    $('#login_firstname').focus()
})

function checkLoginData(){
    if($('#requestLoginData').hasClass('disabled')) return

    let firstname = $('#login_firstname').val()
    let lastname = $('#login_lastname').val()
    _storedFirstname = firstname
    _storedLastname = lastname

    if(!firstname || !lastname){
        _storedFirstname = ""
        _storedLastname = ""
        _setNewPassword = false
        warning('Bitte fülle alle Felder aus!')
        return
    }
    toggleLoading(true)
    $.ajax({
        url: "scripts/requestLogin.php",
        type: "POST",
        data: {
            firstname: firstname,
            lastname: lastname
        },
        beforeSend: function(){
            warning('')
            $('#requestLoginData').addClass('disabled')
            $('#requestLoginData').html('Bitte warten..')
        },
        success: function(response){
            if(response == 0){
                _storedFirstname = ""
                _storedLastname = ""
                _setNewPassword = false
                $('#login_firstname').val('')
                $('#login_lastname').val('')
                $('#login_firstname').focus()
                warning('Zugriff verweigert!')
                toggleLoading(false)
            } else {
                $('#requestLogin').css('display', 'none')
                if(response == 1){ // Passwort existiert
                    _setNewPassword = false
                    $('#checkPassword').css('display', 'flex')
                    $('#login_checkPassword').focus()
                    toggleLoading(false)
                } else if(response == 2){ // Passwort muss gesetzt werden
                    _setNewPassword = true
                    $('#setPassword').css('display', 'flex')
                    $('#login_setPassword').focus()
                    toggleLoading(false)
                }
            }
        }
    })
}

function checkPassword(){
    if($('#checkPasswordConfirm').hasClass('disabled')) return
    let password = $('#login_checkPassword').val()
    if(!password){
        warning('Bitte fülle alle Felder aus!')
        return
    }
    toggleLoading(true)
    $.ajax({
        url: "scripts/requestLoginPassword.php",
        type: "POST",
        data: {
            firstname: _storedFirstname,
            lastname: _storedLastname,
            password: password
        },
        beforeSend: function(){
            warning('')
            $('#checkPasswordConfirm').addClass('disabled')
            $('#checkPasswordConfirm').html('Bitte warten..')
        },
        success: function(response){
            $('.login_blocked_container').css('display', 'none')
            if(response.includes('failed')){
                let split = response.split('_')
                let failedMessage = split[1]
                warning(failedMessage)
                if(split[2] != ""){
                    $('.login_blocked_container').html(split[2])
                    $('.login_blocked_container').css('display', 'block')
                }
                toggleLoading(false)
            } else {
                let resSplit = response.split('_')
                _currentSidebarID = parseInt(resSplit[3])
                _currentSidebarSubMenuID = parseInt(resSplit[4])
                _currentUsername = resSplit[0] + " " + resSplit[1]

                console.log(resSplit)
                console.log(_currentSidebarID)
                console.log(_currentSidebarSubMenuID)
                console.log(_currentUsername)

                updateAccountActivity(_currentUsername + " hat sich eingeloggt!", LOGTYPE.LOGGEDIN)
                $('#checkPassword').css('display', 'none')

                getData_positions(function(array){
                    let positions = JSON.parse(array)
                    let position = positions.find(p => p.id == resSplit[2])
                    if(position != null){
                        _currentUserPosition = position
                        $('#currentLoggedInUserPosition').html(position.name)
                    }
                    $('#currentLoggedInUser').html(resSplit[0])

                    initSidebar()
                    $('.system_container').css('display', 'flex')
                    toggleLoading(false)
                })
            }
        }
    })
}

function setNewPassword(){
    if($('#setPasswordConfirm').hasClass('disabled')) return
    let password = $('#login_setPassword').val()
    let passwordWdh = $('#login_setPasswordWdh').val()
    if(!password || !passwordWdh){
        warning('Bitte fülle alle Felder aus!')
        return
    }
    if(password != passwordWdh){
        warning('Passwörter stimmen nicht überein!')
        return
    }
    toggleLoading(true)
    $.ajax({
        url: "scripts/setNewPassword.php",
        type: "POST",
        data: {
            firstname: _storedFirstname,
            lastname: _storedLastname,
            password: password
        },
        beforeSend: function(){
            warning('')
            $('#setPasswordConfirm').addClass('disabled')
            $('#setPasswordConfirm').html('Bitte warten..')
        },
        success: function(response){
            if(response == 0){
                warning("Unbekannter Fehler! #304")
                toggleLoading(false)
            } else {
                $('#setPassword').css('display', 'none')
                $('#checkPassword').css('display', 'flex')
                toggleLoading(false)
            }
        }
    })
}

function warning(message){
    $('.login_warning').html(message)
    if(message != ""){
        $('.login_btn').removeClass('disabled')
        $('#requestLoginData').html('Einloggen')
        $('#checkPasswordConfirm').html('Einloggen')
        $('#setPasswordConfirm').html('Neues Passwort festlegen')
    }
}

function getSessionData(){
    $.ajax({
        url: "scripts/getSessionData.php",
        type: "POST",
        data: { },
        success: function(response) {
            if(response == 0){
                $.ajax({
                    url: "scripts/logout.php",
                    type: "POST",
                    data: { },
                    success: function(response){
                        if(response == 1){
                            reloadPage()
                        }
                    }
                })
            } else {
                let resSplit = response.split('_')
                _currentSidebarID = parseInt(resSplit[3])
                _currentSidebarSubMenuID = parseInt(resSplit[4])
                _currentUsername = resSplit[1] + " " + resSplit[2]

                getData_positions(function(array){
                    let positions = JSON.parse(array)
                    let position = positions.find(p => p.id == resSplit[5])
                    if(position != null){
                        _currentUserPosition = position
                        $('#currentLoggedInUserPosition').html(position.name)
                    }
                    $('#currentLoggedInUser').html(resSplit[1])

                    initSidebar()
                    $('.system_container').css('display', 'flex')
                })
            }
        }
    })
}

function reloadPage() {
    location.reload()
}

function checkCurrentUserState(){
    $.ajax({
        url: "scripts/getSessionData.php",
        type: "POST",
        data: { },
        success: function(response) {
            if(response == 0){
                $.ajax({
                    url: "scripts/logout.php",
                    type: "POST"
                })
                reloadPage()
            }
        }
    })
}