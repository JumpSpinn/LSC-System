var _searchedVehicles = []
var _requestSearch = false

$(() => {
    initSearchVehicle()

    $('#search_vehicle_confirm').click(() => {
        let numberplate = $('#search_vehicle_numberplate').val()
        if(numberplate == ""){
            new GNWX_NOTIFY({ text: "Bitte gebe ein gültiges Kennzeichen an!", position: "bottom-left", class: "gnwx-warning", autoClose: 5000 });   
            return
        }
        searchVehicleByNumberplate(numberplate)
        toggleLoading(true)
    })

    $("#search_vehicle_numberplate").on("keypress", $(document), function(e) {
        if (e.which == 13) {
            searchVehicleByNumberplate(numberplate)
            toggleLoading(true)
        }
    })
})

function initSearchVehicle(){
    $('#search_vehicle_numberplate').val('')
    $('#modal_search_vehicle').css('display', 'block')
    setTimeout(() => {
        $('#search_vehicle_numberplate').focus()
    }, 150);
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
            let result = JSON.parse(response)
            toggleLoading(false)
            new GNWX_NOTIFY({ text: "Es wurden insgesamt "+result.length+" Ergebnisse gefunden!", position: "bottom-left", class: "gnwx-success", autoClose: 7500 });
        },
        error: function(){
            //updateAccountActivity("[ERROR] " + _currentUsername + " | Fahrzeugsuche | SEARCH", LOGTYPE.ERROR)
        }
    })
}