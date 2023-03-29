var _mitarbeiter = []
var _positions = []

var _mitarbeiterLoaded = false
var _positionsLoaded = false

var _currentEnteredPosition = ""
var _currentEnteredState = ""
var _newMitarbeiter_posID = 0
var _newMitarbeiter_stateID = 0

var _currentEditAccount = null

$(() => {
    toggleLoading(true)
    getData_accounts(function(array){
        _mitarbeiter = JSON.parse(array)
        _mitarbeiterLoaded = true
        showMitarbeiter()
    })

    getData_positions(function(array){
        _positions = JSON.parse(array)
        _positionsLoaded = true
        showMitarbeiter()
    })

    $('#new_mitarbeiter_position').keyup(function(e) {
        _currentEnteredPosition = $(this).val().toLowerCase()
        showPosition()
    })

    $('#edit_mitarbeiter_position').keyup(function(e) {
        _currentEnteredPosition = $(this).val().toLowerCase()
        showPosition()
    })

    $('#edit_mitarbeiter_state').keyup(function(e) {
        _currentEnteredState = $(this).val().toLowerCase()
        showStates()
    })

    $('.page_popup_suggestions').on('click', '.page_popup_suggestion.changePosition', function(){
        let posID = $(this).data('id')
        let position = _positions.find(p => p.id == posID)
        if(position != null){
            $('#new_mitarbeiter_position').val(position.name)
            $('#edit_mitarbeiter_position').val(position.name)
            _newMitarbeiter_posID = position.id
            _currentEnteredPosition = ""
            showPosition()
        }
    })

    $('.page_popup_suggestions').on('click', '.page_popup_suggestion.changeState', function(){
        let stateID = $(this).data('id')
        let state = ACCOUNT_STATES.find(p => p.id == stateID)
        if(state != null){
            $('#edit_mitarbeiter_state').val(state.name)
            _newMitarbeiter_stateID = state.id
            _currentEnteredState = ""
            showStates()
        }
    })

    $('#create_mitarbeiter').click(() => {
        showPopup('popup_new_mitarbeiter')
    })

    $('#close_new_mitarbeiter').click(() => {
        closePopup()
    })

    $('#new_mitarbeiter_save').click(() => {
        let firstname = $('#new_mitarbeiter_firstname').val()
        let lastname = $('#new_mitarbeiter_lastname').val()
        let phonenumber = $('#new_mitarbeiter_phonenumber').val()
        if(firstname && lastname && _newMitarbeiter_posID){
            $.ajax({
                url: "scripts/add/mitarbeiter.php",
                type: "POST",
                data: {
                    firstname: firstname,
                    lastname: lastname,
                    positionID: _newMitarbeiter_posID,
                    memberSince: getCurrentTimestamp(),
                    phonenumber: phonenumber
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_accounts(function(array){
                        _mitarbeiter = JSON.parse(array)
                        _mitarbeiterLoaded = true
                        closePopup()
                        showMitarbeiter()
                        updateAccountActivity(_currentUsername + " hat ein neuen Mitarbeiter angelegt! (" + firstname + " " + lastname + ")", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: firstname + " " + lastname + " wurde als neuer Mitarbeiter hinterlegt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Mitarbeiter | NEW", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.mitarbeiter_content_container').on('click', '.edit_current_member', function(){
        let userID = $(this).parent().parent().parent().data('id')
        let account = _mitarbeiter.find(i => i.id == userID)
        if(account != null){
            _currentEditAccount = account
            _newMitarbeiter_posID = parseInt(_currentEditAccount.positionID)
            _newMitarbeiter_stateID = parseInt(_currentEditAccount.state)
            let position = _positions.find(i => i.id == _currentEditAccount.positionID)
            $('#edit_mitarbeiter_firstname').val(_currentEditAccount.firstname)
            $('#edit_mitarbeiter_lastname').val(_currentEditAccount.lastname)
            $('#edit_mitarbeiter_phonenumber').val(_currentEditAccount.phonenumber)
            $('#edit_mitarbeiter_position').val((position == null ? "Kein Rang gefunden!" : position.name))
            $('#edit_mitarbeiter_iban').val(_currentEditAccount.iban)
            $('#edit_mitarbeiter_state').val(getAccountStateName(_currentEditAccount.state))
            $('#edit_mitarbeiter_stateReason').val(_currentEditAccount.stateReason)
            $('#edit_mitarbeiter_warnings').val(_currentEditAccount.warnings)
            showPopup('popup_edit_mitarbeiter')
        }
    })

    $('#close_edit_mitarbeiter').click(() => {
        $('#edit_mitarbeiter_firstname').val('')
        $('#edit_mitarbeiter_lastname').val('')
        $('#edit_mitarbeiter_phonenumber').val('')
        $('#edit_mitarbeiter_position').val('')
        $('#edit_mitarbeiter_iban').val('')
        $('#edit_mitarbeiter_state').val('')
        $('#edit_mitarbeiter_stateReason').val('')
        $('#edit_mitarbeiter_warnings').val('')
        closePopup()
    })

    $('#edit_mitarbeiter_save').click(() => {
        let firstname = $('#edit_mitarbeiter_firstname').val()
        let lastname = $('#edit_mitarbeiter_lastname').val()
        let phonenumber = $('#edit_mitarbeiter_phonenumber').val()
        let iban = $('#edit_mitarbeiter_iban').val()
        let stateReason = $('#edit_mitarbeiter_stateReason').val()
        let warnings = $('#edit_mitarbeiter_warnings').val()
        if(firstname && lastname && _newMitarbeiter_posID){
            if(isNaN(warnings)){
                new GNWX_NOTIFY({ text: "Abmahnung darf nur Zahlen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/edit/mitarbeiter.php",
                type: "POST",
                data: {
                    accountID: _currentEditAccount.id,
                    firstname: firstname,
                    lastname: lastname,
                    positionID: _newMitarbeiter_posID,
                    phonenumber: phonenumber,
                    iban: iban,
                    state: _newMitarbeiter_stateID,
                    stateReason: stateReason,
                    warnings: warnings
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_accounts(function(array){
                        _mitarbeiter = JSON.parse(array)
                        _mitarbeiterLoaded = true
                        closePopup()
                        showMitarbeiter()
                        updateAccountActivity(_currentUsername + " hat ein Mitarbeiter bearbeitet! (" + firstname + " " + lastname + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: firstname + " " + lastname + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Mitarbeiter | EDIT", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.mitarbeiter_content_container').on('click', '.delete_current_member', function(){
        let userID = $(this).parent().parent().parent().data('id')
        let account = _mitarbeiter.find(i => i.id == userID)
        if(account != null){
            _currentEditAccount = account
            $('#popup_delete_mitarbeiter .page_popup_header_subtitle').html('Bist du dir sicher, dass du ' + _currentEditAccount.firstname + ' ' + _currentEditAccount.lastname + ' löschen möchtest?')
            showPopup('popup_delete_mitarbeiter')
        }
    })

    $('#close_delete_mitarbeiter').click(() => {
        closePopup()
    })

    $('#delete_mitarbeiter_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/mitarbeiter.php",
            type: "POST",
            data: {
                accountID: _currentEditAccount.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_accounts(function(array){
                    _mitarbeiter = JSON.parse(array)
                    _mitarbeiterLoaded = true
                    closePopup()
                    showMitarbeiter()
                    updateAccountActivity(_currentUsername + " hat ein Mitarbeiter entfernt! (" + _currentEditAccount.firstname + " " + _currentEditAccount.lastname + ")", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: _currentEditAccount.firstname + " " + _currentEditAccount.lastname + " wurde aus der Mitarbeiterliste entfernt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Mitarbeiter | DELETE", LOGTYPE.ERROR)
            }
        })
    })

    $('.mitarbeiter_content_container').on('click', '.resetPassword', function(){
        let accountID = $(this).parent().parent().parent().parent().parent().data('id')
        let member = _mitarbeiter.find(i => i.id == accountID)
        if(member != null){
            _currentEditAccount = member
            let fullname = _currentEditAccount.firstname + " " + _currentEditAccount.lastname
            $('#popup_resetMember_password .page_popup_header_title').html('Passwort zurücksetzen')
            $('#popup_resetMember_password .page_popup_header_subtitle').html('Bist du dir sicher, dass du das Passwort zurücksetzen möchtest?')
            showPopup('popup_resetMember_password')
        }
    })

    $('#close_resetMember_password').click(() => {
        closePopup()
    })

    $('#reset_resetMember_password').click(() => {
        $.ajax({
            url: "scripts/reset/password.php",
            type: "POST",
            data: {
                id: _currentEditAccount.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_accounts(function(array){
                    _mitarbeiter = JSON.parse(array)
                    _mitarbeiterLoaded = true
                    closePopup()
                    showMitarbeiter()
                    updateAccountActivity(_currentUsername + " hat das Passwort von " + _currentEditAccount.firstname + " " + _currentEditAccount.lastname + " zurückgesetzt!", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: "Das Passwort von " + _currentEditAccount.firstname + " " + _currentEditAccount.lastname + " wurde erfolgreich zurückgesetzt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Mitarbeiter | RESET PW", LOGTYPE.ERROR)
            }
        })
    })

    $('#search').on('input', function(){
        let searchValue = $(this).val().toLowerCase()
        let filter = _mitarbeiter.filter(f => f.firstname.toLowerCase().includes(searchValue) || f.lastname.toLowerCase().includes(searchValue))
        if(searchValue != ""){
            showMitarbeiter(filter)
        } else {
            showMitarbeiter(_mitarbeiter)
        }
    })
})

function showMitarbeiter(array = _mitarbeiter){
    if(!_mitarbeiterLoaded || !_positionsLoaded) return
    $('.mitarbeiter_content_container').html('')
    array.sort((a, b) => { return b.positionID - a.positionID; })
    let containers = []
    array.forEach((user) => {
        let diffTimestamp = getCurrentTimestamp() - user.memberSince
        let daysInDuty = (diffTimestamp / 86400).toFixed(0)
        let userPosition = _positions.find(p => p.id == user.positionID)
        var container = '\
            <div class="mitarbeiter_entry" data-id="'+user.id+'">\
                <div class="mitarbeiter_entry_header">\
                    <div class="mitarbeiter_entry_user">\
                        <span class="mitarbeiter_entry_user_title">'+user.firstname+' '+user.lastname+'</span>\
                        <span class="mitarbeiter_entry_user_subtitle">'+(userPosition == null ? 'Kein Rang zugeordnet!' : userPosition.name)+'</span>\
                        <span class="mitarbeiter_entry_user_lastAction">Letzte Aktivität: '+(user.lastAction == 0 ? "-" : convertTimestamp(user.lastAction))+'</span>\
                    </div>\
                    <div class="mitarbeiter_entry_btns">\
                        <em class="mdi mdi-lead-pencil edit_current_member"></em>\
                        <em class="mdi mdi-trash-can delete_current_member"></em>\
                    </div>\
                </div>\
                <div class="mitarbeiter_entry_details">\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Eingestellt am:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+convertTimestamp(user.memberSince)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Telefonnummer:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(user.phonenumber == "" ? "-" : user.phonenumber)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Kontoverbindung (IBAN):</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(user.iban == "" ? "-" : user.iban)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Aktueller Status:</div>\
                            <div class="mitarbeiter_entry_col_desc mitarbeiterState_'+user.state+'">'+(user.state == "" ? getAccountStateName(0) : getAccountStateName(user.state))+'</div>\
                        </div>\
                    </div>\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Passwort:</div>\
                            <div class="mitarbeiter_entry_col_desc"><em style="display: '+(user.pass == "" ? "none" : "inline-block")+'" class="mdi mdi-lock-reset resetPassword"></em><input readonly class="memberPasswordField" type="'+(user.pass == "" ? "text" : "password")+'" value="'+(user.pass == "" ? "noch kein Passwort gesetzt!" : user.pass)+'"></input></div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Diensttage:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(daysInDuty == 1 ? daysInDuty + " Tag" : daysInDuty + " Tage")+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Abmahnungen:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+user.warnings+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Begründung (Status):</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(user.stateReason == "" ? "-" : user.stateReason)+'</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        '
        containers.push(container)
    })
    $('.mitarbeiter_content_container').append(containers)
    toggleLoading(false)
}

function showPosition(){
    $('.page_popup_suggestions').html('')
    let findPositions = _positions.filter(p => p.name.toLowerCase().includes(_currentEnteredPosition.toLowerCase()))
    if(findPositions.length > 0){
        $('.page_popup_suggestions').html('')
        findPositions.forEach((pos) => {
            let container = '<div class="page_popup_suggestion changePosition" data-id="'+pos.id+'">'+pos.name+'</div>'
            $('.page_popup_suggestions.mitarbeiterRang').append(container)
        })
    }
    if(_currentEnteredPosition == ""){
        $('.page_popup_suggestions').html('')
    }
}

function showStates(){
    $('.page_popup_suggestions').html('')
    let findStates = ACCOUNT_STATES.filter(p => p.name.toLowerCase().includes(_currentEnteredState.toLowerCase()))
    if(findStates.length > 0){
        $('.page_popup_suggestions').html('')
        findStates.forEach((state) => {
            let container = '<div class="page_popup_suggestion changeState" data-id="'+state.id+'">'+state.name+'</div>'
            $('.page_popup_suggestions.mitarbeiterState').append(container)
        })
    }
    if(_currentEnteredState == ""){
        $('.page_popup_suggestions').html('')
    }
}