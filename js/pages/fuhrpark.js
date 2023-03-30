var _members = []
var _membersLoaded = false

var _fleet = []
var _fleetLoaded = false

var _serverVehicles = []
var _serverVehiclesLoaded = false

var _currentEditFleet = null

var _currentEnteredMember = ""
var _currentEnteredServerVehicle = ""

var _selectedServerVehicle = ""

$(() => {
    if(hasPermission(PAGE_PERMISSION_TYPES.FUHRPARK_CREATE)){
        $('#create_fleet').css('display', 'flex')
    }

    toggleLoading(true)
    getData_accounts(function(array){
        _members = JSON.parse(array)
        _membersLoaded = true
        showFleets()
    })

    getData_fleets(function(array){
        _fleet = JSON.parse(array)
        _fleetLoaded = true
        showFleets()
    })

    getData_serverVehicles(function(array){
        _serverVehicles = JSON.parse(array)
        _serverVehiclesLoaded = true
        showFleets()
    })

    $('#create_fleet').click(() => {
        $('#new_fleet_model').val('')
        $('#new_fleet_numberplate').val('')
        $('#new_fleet_km').val('')
        $('#new_fleet_oil').val('')
        $('#new_fleet_battery').val('')
        $('#new_fleet_nextService').val('')
        $('#new_fleet_currentMember').val('')
        $('.page_popup_suggestions').html('')
        showPopup('popup_new_fleet')
    })

    $('#close_new_fleet').click(() => {
        closePopup()
    })

    $('#new_fleet_save').click(() => {
        var model = $('#new_fleet_model').val()
        var numberplate = $('#new_fleet_numberplate').val()
        var km = $('#new_fleet_km').val()
        var oil = $('#new_fleet_oil').val()
        var battery = $('#new_fleet_battery').val()
        var nextService = $('#new_fleet_nextService').val()
        var currentMember = $('#new_fleet_currentMember').val()
        if(model && numberplate){
            let checkVehicle = _serverVehicles.find(i => i.model.toLowerCase() == model.toLowerCase())
            if(checkVehicle == null){
                new GNWX_NOTIFY({ text: model + " ist kein zulässiges Fahrzeug!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            let splitCurrentMember = currentMember.split(' ')
            let checkMember = _members.find(i => i.firstname.toLowerCase() == splitCurrentMember[0].toLowerCase() && i.lastname.toLowerCase() == splitCurrentMember[1].toLowerCase())
            if(checkMember == null){
                new GNWX_NOTIFY({ text: "Es existiert kein Mitarbeiter mit diesen Namen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/add/fleet.php",
                type: "POST",
                data: {
                    model: model,
                    numberplate: numberplate,
                    km: (km == "" ? 0 : parseInt(km)),
                    oil: (oil == "" ? 0 : parseInt(oil)),
                    battery: (battery == "" ? 0 : parseInt(battery)),
                    lastService: getCurrentTimestamp(),
                    nextService: translateDate(nextService),
                    currentMember: currentMember
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_fleets(function(array){
                        _fleet = JSON.parse(array)
                        _fleetLoaded = true
                        closePopup()
                        showFleets()
                        updateAccountActivity(_currentUsername + " hat ein neues Fahrzeug im Fuhrpark angelegt! (" + model + ", Kennzeichen: " + numberplate + ")", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: "Fahrzeug ("+model+") wurde im Fuhrpark angelegt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Fuhrpark | NEW", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.mitarbeiter_content_container').on('click', '.editFleet', function(){
        let fleetID = $(this).parent().parent().parent().data('id')
        let fleet = _fleet.find(i => i.id == fleetID)
        if(fleet != null){
            _currentEditFleet = fleet
            $('.page_popup_suggestions').html('')
            $('#edit_fleet_model').val(_currentEditFleet.model)
            $('#edit_fleet_numberplate').val(_currentEditFleet.numberplate)
            $('#edit_fleet_km').val((_currentEditFleet.km == 0 ? "" : _currentEditFleet.km))
            $('#edit_fleet_oil').val((_currentEditFleet.oil == 0 ? "" : _currentEditFleet.oil))
            $('#edit_fleet_battery').val((_currentEditFleet.battery == 0 ? "" : _currentEditFleet.battery))
            let dateSplit = _currentEditFleet.nextService.split('.')
            $('#edit_fleet_nextService').val(dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0])
            $('#edit_fleet_currentMember').val(_currentEditFleet.currentMember)
            showPopup('popup_edit_fleet')
        }
    })

    $('#close_edit_fleet').click(() => {
        closePopup()
    })

    $('#edit_fleet_save').click(() => {
        var model = $('#edit_fleet_model').val()
        var numberplate = $('#edit_fleet_numberplate').val()
        var km = $('#edit_fleet_km').val()
        var oil = $('#edit_fleet_oil').val()
        var battery = $('#edit_fleet_battery').val()
        var nextService = $('#edit_fleet_nextService').val()
        var currentMember = $('#edit_fleet_currentMember').val()
        if(model && numberplate){
            let checkVehicle = _serverVehicles.find(i => i.model.toLowerCase() == model.toLowerCase())
            if(checkVehicle == null){
                new GNWX_NOTIFY({ text: model + " ist kein zulässiges Fahrzeug!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            let splitCurrentMember = currentMember.split(' ')
            let checkMember = _members.find(i => i.firstname.toLowerCase() == splitCurrentMember[0].toLowerCase() && i.lastname.toLowerCase() == splitCurrentMember[1].toLowerCase())
            if(checkMember == null){
                new GNWX_NOTIFY({ text: "Es existiert kein Mitarbeiter mit diesen Namen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/edit/fleet.php",
                type: "POST",
                data: {
                    id: _currentEditFleet.id,
                    model: model,
                    numberplate: numberplate,
                    km: (km == "" ? 0 : parseInt(km)),
                    oil: (oil == "" ? 0 : parseInt(oil)),
                    battery: (battery == "" ? 0 : parseInt(battery)),
                    lastService: getCurrentTimestamp(),
                    nextService: translateDate(nextService),
                    currentMember: currentMember
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_fleets(function(array){
                        _fleet = JSON.parse(array)
                        _fleetLoaded = true
                        closePopup()
                        showFleets()
                        updateAccountActivity(_currentUsername + " hat ein Fahrzeug im Fuhrpark bearbeitet! (" + model + ", Kennzeichen: " + numberplate + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: "Fahrzeug ("+model+") wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Fuhrpark | EDIT", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.mitarbeiter_content_container').on('click', '.deleteFleet', function(){
        let fleetID = $(this).parent().parent().parent().data('id')
        let fleet = _fleet.find(i => i.id == fleetID)
        if(fleet != null){
            _currentEditFleet = fleet
            showPopup('popup_delete_fleet')
        }
    })

    $('#close_delete_fleet').click(() => {
        closePopup()
    })

    $('#delete_fleet_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/fleet.php",
            type: "POST",
            data: {
                id: _currentEditFleet.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_fleets(function(array){
                    _fleet = JSON.parse(array)
                    _fleetLoaded = true
                    closePopup()
                    showFleets()
                    updateAccountActivity(_currentUsername + " hat ein Fahrzeug im Fuhrpark entfernt! (" + _currentEditFleet.model + ", Kennzeichen: " + _currentEditFleet.numberplate + ")", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: "Fahrzeug ("+_currentEditFleet.model+") wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Fuhrpark | DELETE", LOGTYPE.ERROR)
            }
        })
    })

    $('#new_fleet_currentMember').keyup(function(e) {
        _currentEnteredMember = $(this).val().toLowerCase()
        showMembers()
    })

    $('#edit_fleet_currentMember').keyup(function(e) {
        _currentEnteredMember = $(this).val().toLowerCase()
        showMembers()
    })

    $('.page_popup_suggestions').on('click', '.changeMember', function(){
        let membersID = $(this).data('id')
        let member = _members.find(i => i.id == membersID)
        if(member != null){
            $('#new_fleet_currentMember').val(member.firstname + " " + member.lastname)
            $('#edit_fleet_currentMember').val(member.firstname + " " + member.lastname)
            _currentEnteredMember = ""
            showMembers()
        }
    })

    $('#new_fleet_model').keyup(function(e) {
        _currentEnteredServerVehicle = $(this).val().toLowerCase()
        showServerVehicles()
    })

    $('#edit_fleet_model').keyup(function(e) {
        _currentEnteredServerVehicle = $(this).val().toLowerCase()
        showServerVehicles()
    })

    $('.page_popup_suggestions').on('click', '.page_popup_suggestion.changeServerVehicle', function(){
        let serverVehicleId = $(this).data('id')
        let serverVehicle = _serverVehicles.find(p => p.id == serverVehicleId)
        if(serverVehicle != null){
            $('#new_fleet_model').val(serverVehicle.model)
            $('#edit_fleet_model').val(serverVehicle.model)
            _selectedServerVehicle = serverVehicle.model
            _currentEnteredServerVehicle = ""
            showServerVehicles()
        }
    })

    $('#search').on('input', function(){
        let searchValue = $(this).val().toLowerCase()
        let filter = _fleet.filter(f => f.model.toLowerCase().includes(searchValue) || f.numberplate.toLowerCase().includes(searchValue))
        if(searchValue != ""){
            showFleets(filter)
        } else {
            showFleets(_fleet)
        }
    })
})

function showServerVehicles(){
    $('.page_popup_suggestions').html('')
    let findServerVehicles = _serverVehicles.filter(p => p.model.toLowerCase().includes(_currentEnteredServerVehicle.toLowerCase()))
    if(findServerVehicles.length > 0){
        $('.page_popup_suggestions').html('')
        findServerVehicles.forEach((vehicle) => {
            let container = '<div class="page_popup_suggestion changeServerVehicle" data-id="'+vehicle.id+'">'+vehicle.model+'</div>'
            $('.page_popup_suggestions.serverVehicle').append(container)
        })
    }
    if(_currentEnteredServerVehicle == ""){
        $('.page_popup_suggestions').html('')
    }
}

function showMembers(){
    $('.page_popup_suggestions').html('')
    let findMembers = _members.filter(p => (p.firstname.toLowerCase().includes(_currentEnteredMember.toLowerCase()) || p.lastname.toLowerCase().includes(_currentEnteredMember.toLowerCase())))
    if(findMembers.length > 0){
        $('.page_popup_suggestions').html('')
        findMembers.forEach((member) => {
            let container = '<div class="page_popup_suggestion changeMember" data-id="'+member.id+'">'+member.firstname+' '+member.lastname+'</div>'
            $('.page_popup_suggestions.foundMembers').append(container)
        })
    }
    if(_currentEnteredMember == ""){
        $('.page_popup_suggestions').html('')
    }
}

function showFleets(array = _fleet){
    if(!_fleetLoaded || !_membersLoaded || !_serverVehiclesLoaded) return
    $('.mitarbeiter_content_container').html('')

    let canEdit = hasPermission(PAGE_PERMISSION_TYPES.FUHRPARK_EDIT)
    let canDelete = hasPermission(PAGE_PERMISSION_TYPES.FUHRPARK_DELETE)

    array.sort((a, b) => { return a.id - b.id; })
    let containers = []
    array.forEach((fleet) => {
        let container = '\
            <div class="mitarbeiter_entry" data-id="'+fleet.id+'">\
                <div class="mitarbeiter_entry_header">\
                    <div class="mitarbeiter_entry_user">\
                        <span class="mitarbeiter_entry_user_title">'+fleet.model+'</span>\
                        <span class="mitarbeiter_entry_user_subtitle">'+fleet.numberplate+'</span>\
                        <span class="mitarbeiter_entry_user_lastAction">Letzte Bearbeitung von '+fleet.lastServiceMember+' am '+convertTimestamp(fleet.lastService)+'</span>\
                    </div>\
                    <div class="mitarbeiter_entry_btns">\
                        <em class="mdi mdi-lead-pencil editFleet" style="display: '+(canEdit ? 'flex' : 'none')+'"></em>\
                        <em class="mdi mdi-trash-can deleteFleet" style="display: '+(canDelete ? 'flex' : 'none')+'"></em>\
                    </div>\
                </div>\
                <div class="mitarbeiter_entry_details">\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Kilometerstand</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(fleet.km == 0 ? "-" : fleet.km + " KM")+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Aktueller Ölstand:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(fleet.oil == 0 ? "-" : fleet.oil + " Liter")+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Aktuelle Batterie:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(fleet.battery == 0 ? "-" : fleet.battery + " KM")+'</div>\
                        </div>\
                    </div>\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Letzte Wartung:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+convertTimestamp(fleet.lastService)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Nächste Wartung:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(fleet.nextService == "" ? "nächste Wartung offen" : fleet.nextService)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Zugewiesener Mitarbeiter:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(fleet.currentMember == "" ? "kein Mitarbeiter zugewiesen" : fleet.currentMember)+'</div>\
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