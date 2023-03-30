var _searchedVehicles = []
var _requestSearch = false

$(() => {
    initSearchVehicle()

    $('#search_vehicle_confirm').click(() => {
        checkSearchByNumerplate()
    })

    $("#search_vehicle_numberplate").on("keypress", $(document), function(e) {
        if (e.which == 13) {
            checkSearchByNumerplate()
        }
    })

    $('#new_searchVehicle').click(() => {
        $('.search_vehicle_result_container').css('display', 'none')
        $('#new_searchVehicle').css('display', 'none')
        $('#modal_search_vehicle').css('display', 'block')
        setTimeout(() => {
            $('#search_vehicle_numberplate').focus()
        }, 150);
    })
})

function initSearchVehicle(){
    $('#new_searchVehicle').css('display', 'none')
    $('#search_vehicle_numberplate').val('')
    $('#modal_search_vehicle').css('display', 'block')
    setTimeout(() => {
        $('#search_vehicle_numberplate').focus()
    }, 150);
}

function checkSearchByNumerplate(){
    let numberplate = $('#search_vehicle_numberplate').val()
    if(numberplate == ""){
        new GNWX_NOTIFY({ text: "Bitte gebe ein gültiges Kennzeichen an!", position: "bottom-left", class: "gnwx-warning", autoClose: 5000 });   
        return
    }
    searchVehicleByNumberplate(numberplate)
    toggleLoading(true)
}

function searchVehicleByNumberplate(numberplate){
    if(_requestSearch) return
    _requestSearch = true
    _searchedVehicles = []

    $.ajax({
        url: "scripts/searchVehicleByNumberplate.php",
        type: "POST",
        data: {
            numberplate: numberplate
        },
        beforeSend: function() { },
        success: function(response) {
            toggleLoading(false)
            _searchedVehicles = JSON.parse(response)
            if(_searchedVehicles.length == 0){
                _requestSearch = false
                new GNWX_NOTIFY({ text: "Es wurden zu diesen Kennzeichen keine Einträge gefunden!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 })
                $('#search_vehicle_numberplate').val('')
                $('.search_vehicle_result_container').css('display', 'none')
                $('#new_searchVehicle').css('display', 'none')
                $('#modal_search_vehicle').css('display', 'block')
                setTimeout(() => {
                    $('#search_vehicle_numberplate').focus()
                }, 150);
            } else {
                new GNWX_NOTIFY({ text: "Es wurden insgesamt "+_searchedVehicles.length+" Ergebnisse gefunden!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 })
                initResults()
            }
        },
        error: function(){
            updateAccountActivity("[ERROR] " + _currentUsername + " | Fahrzeugsuche | SEARCH", LOGTYPE.ERROR)
        }
    })
}

function initResults(){
    _requestSearch = false
    $('#search_vehicle_numberplate').val('')
    $('.search_vehicle_result_container').html('')
    $('#modal_search_vehicle').css('display', 'none')
    $('.search_vehicle_result_container').css('display', 'flex')
    $('#new_searchVehicle').css('display', 'block')

    let containers = []

    _searchedVehicles.forEach((entry) => {
        let mainData = JSON.parse(entry.mainData)[0]
        let container = '\
            <div class="mitarbeiter_entry" data-id="'+entry.id+'">\
                <div class="mitarbeiter_entry_header">\
                    <div class="mitarbeiter_entry_user">\
                        <span class="mitarbeiter_entry_user_title">'+mainData.customerName+'</span>\
                        <span class="mitarbeiter_entry_user_subtitle">Kundennummer: '+mainData.customerNumber+'</span>\
                        <span class="mitarbeiter_entry_user_lastAction">Fahrzeug: '+mainData.vehicleModel+'</span>\
                    </div>\
                    <div class="mitarbeiter_entry_btns"></div>\
                </div>\
                <div class="mitarbeiter_entry_details">\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Bearbeitet von:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+mainData.workerName+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Bezahlart:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+mainData.payType+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Staatlich:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(mainData.isState ? "Ja" : "Nein")+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Servicepartner:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(mainData.isServicePartner ? "Ja": "Nein")+'</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        '
        containers.push(container)
    })
    $('.search_vehicle_result_container').append(containers)
}