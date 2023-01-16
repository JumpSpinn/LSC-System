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
            _searchedVehicles = JSON.parse(response)
            new GNWX_NOTIFY({ text: "Es wurden insgesamt "+_searchedVehicles.length+" Ergebnisse gefunden!", position: "bottom-left", class: "gnwx-success", autoClose: 7500 })
            toggleLoading(false)
            initResults()
        },
        error: function(){
            //updateAccountActivity("[ERROR] " + _currentUsername + " | Fahrzeugsuche | SEARCH", LOGTYPE.ERROR)
        }
    })
}

function initResults(){
    _requestSearch = false
    $('#search_vehicle_numberplate').val('')
    $('#modal_search_vehicle').css('display', 'none')
    $('.search_vehicle_result_container').css('display', 'flex')
    $('#new_searchVehicle').css('display', 'block')

    console.log(_searchedVehicles)
}