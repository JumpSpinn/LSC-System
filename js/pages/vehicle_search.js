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
})

function initSearchVehicle(){
    $('#search_vehicle_numberplate').val('')
    $('#modal_search_vehicle').css('display', 'flex')
    setTimeout(() => {
        $('#search_vehicle_numberplate').focus()
    }, 150);
}

function searchVehicleByNumberplate(numberplate){
    if(_requestSearch) return
    _requestSearch = true
    _searchedVehicles = []
}