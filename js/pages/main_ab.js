var STATES = {
    SERACH_CUSTOMER: 0,
    LOADING: 1,
    CANTFIND_WANTTOADD: 2,
    AUFTRAGSBLATT: 3,
    ADD_NEW_CUSTOMER: 4
}

var HIGHLIGHT_NAMES = [
    { name: "Reparaturset" },
    { name: "CarConnect-Kit" },
    { name: "Wireless-Charger" },
    { name: "Taxamter" },
    { name: "GPS" },
    { name: "Speedlimiter" },
    { name: "Freisprechanlage" },
    { name: "Alarmsystem" },
    { name: "Kickstarter-Umbaukit" },
    { name: "Abschlepp/ Anfahrt/ Umdrehen Gebühren" },
]

var _searchedCustomerName = ""
var _searchedCustomerNumber = ""
var _redeemedGutschein = false
var _currentEnteredVehicle = ""

// Customer Data
var _currentCustomerName = ""
var _currentCustomerNumber = 0
var _currentCustomerRabatt = 0
var _currentCustomerEnterState = ""
var _currentCustomerIsState = false
var _currentCustomerIsServicePartner = false
var _currentCustomerPayType = ""

// Vehicle Data
var _currentVehicleModel = ""
var _currentVehicleTypeName = ""
var _currentVehicleTypeMarkup = 0
var _currentVehicleTypePercent = 0
var _currentVehicleEinparkdauer = 0
var _currentVehicleNumberplate = ""

// Price Data
var _currentPrice_summe = 0
var _currentPrice_gewinnspanne = 0
var _currentPrice_arbeitszeit = 0
var _currentPrice_netto = 0
var _currentPrice_steuern = 0
var _currentPrice_brutto = 0

// Data
var _serverVehicles = []
var _prices = []
var _parkHours = []
var _inspections = []
var _carTypes = []
var _generalData = []
var _servicePartner = []
var _allCustomers = []
var _serverVehiclesLoaded = false
var _pricesLoaded = false
var _parkHoursLoaded = false
var _inspectionsLoaded = false
var _carTypesLoaded = false
var _generalDataLoaded = false
var _servicePartnerLoaded = false

// Dev
var debug = false

// Buchhaltung Arrays
var _mainDatas = []
var _choosedDatas = []

$(() => {
    if(debug){
        reset()
        _searchedCustomerName = "Max Mustermann"
        getDatas()
    } else {
        // switch to search customer
        switchState(STATES.SERACH_CUSTOMER)
    }

    //switchState(STATES.AUFTRAGSBLATT)
    $('#auftrag_vehicle_model').val('')
    $('#auftrag_vehicle_numberplate').val('')

    $('#search_customer').click(() => {
        reset()
        searchCustomer()
    })

    $("#search_customer_name").on("keypress", $(document), function(e) {
        if (e.which == 13) {
            reset()
            searchCustomer()
        }
    })

    $('#search_customer_name').on('keyup', function(){
        let value = $(this).val()
        _searchedCustomerName = value
        getSerachCustomerResults()
    })

    $("#search_customer_number").on("keypress", $(document), function(e) {
        if (e.which == 13) {
            reset()
            searchCustomer()
        }
    })

    $('#restart_search_customer').click(() => {
        _searchedCustomerName = ""
        _searchedCustomerNumber = ""
        $('#cant_find_customer').css('display', 'none')
        switchState(STATES.SERACH_CUSTOMER)
    })

    $('#request_new_customer').click(() => {
        switchState(STATES.ADD_NEW_CUSTOMER)
    })

    $('#add_new_customer_abort').click(() => {
        switchState(STATES.SERACH_CUSTOMER)
    })

    $('#create_new_customer').click(() => {
        let customerName = $('#add_new_customer_name').val()
        if(customerName == ""){
            new GNWX_NOTIFY({ text: "Kundenname muss angegeben sein!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
            return
        }
        if(!isNaN(customerName)){
            new GNWX_NOTIFY({ text: "Kundenname darf keine Zahl enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
            return
        }
        let enterState = $('#add_new_customer_number').val()
        if(enterState == ""){
            new GNWX_NOTIFY({ text: "Eintrittsdatum muss angegeben sein!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
            return
        }
        let customerEnterState = translateDate(enterState)
        ADD_NEW_CUSTOMER(customerName, customerEnterState, 0, 0, "", 0, 0, 0)
    })

    $('#exitAuftrag').click(() => {
        showPopup('popup_cancel_auftrag')
    })

    $('#close_cancel_auftrag').click(() => {
        closePopup()
    })

    $('#cnacel_auftrag_confirm').click(() => {
        reset()
        switchState(STATES.SERACH_CUSTOMER)
        closePopup()
    })

    $('#requestGutschein').click(() => {
        if(_redeemedGutschein){
            new GNWX_NOTIFY({ text: "Es wurde bereits ein Gutscheincode eingelöst!", position: "bottom-left", class: "gnwx-warning", autoClose: 3500 });
            return
        }
        showPopup('popup_search_gutschein')
    })

    $('#close_search_gutschein').click(() => {
        closePopup()
    })

    $('#search_gutschein_confirm').click(() => {
        let enteredCode = $('#search_gutschein_code').val()
        if(enteredCode == ""){
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
            return
        }
        if(!enteredCode.includes('-')){
            new GNWX_NOTIFY({ text: "Das ist kein gültiger Gutscheincode!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
            return
        }
        $.ajax({
            url: "scripts/requestGutschein.php",
            type: "POST",
            data: {
                code: enteredCode
            },
            beforeSend: function() {
                closePopup()
                switchState(STATES.LOADING)
            },
            success: function(response) {
                if(response == 0){
                    switchState(STATES.AUFTRAGSBLATT)
                    _redeemedGutschein = false
                    new GNWX_NOTIFY({ text: "Gutscheincode ["+enteredCode+"] ist nicht vorhanden oder konnte nicht gefunden werden!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                    updateAccountActivity(_currentUsername + " hat versucht Gutscheincode "+enteredCode+" für Kunden "+_currentCustomerName+" einzulösen!", LOGTYPE.ERROR)
                } else {
                    split = response.split('_')
                    if(parseInt(split[2]) != 0){
                        _redeemedGutschein = false
                        new GNWX_NOTIFY({ text: "Gutscheincode ["+split[0]+"] wurde bereits von ["+split[4]+"] für Kunde ["+split[3]+"] eingelöst!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                    } else {
                        _redeemedGutschein = true
                        _currentCustomerRabatt = parseInt(split[1])
                        new GNWX_NOTIFY({ text: "Gutscheincode ["+split[0]+"] ist gültig & wurde soeben eingelöst!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                        updateAccountActivity(_currentUsername + " hat den Gutscheincode "+split[0]+" für Kunden "+_currentCustomerName+" eingelöst (Rabatthöhe: "+split[1]+"%)!", LOGTYPE.EDITED)
                        calcPrices()
                        $.ajax({
                            url: "scripts/redeemedGutschein.php",
                            type: "POST",
                            data: {
                                code: split[0],
                                redeemedCustomer: _currentCustomerName,
                                redeemedMember: _currentUsername,
                                redeemedTimestamp: getCurrentTimestamp()
                            },
                            success: function(response){},
                            error: function(){
                                _redeemedGutschein = false
                                updateAccountActivity("[ERROR] " + _currentUsername + " | Auftragsblatt | Redeemed Gutschein", LOGTYPE.ERROR)
                            }
                        })
                    }
                }
                switchState(STATES.AUFTRAGSBLATT)
            },
            error: function(){
                _redeemedGutschein = false
                updateAccountActivity("[ERROR] " + _currentUsername + " | Auftragsblatt | Search Gutschein", LOGTYPE.ERROR)
            }
        })
    })

    $('#auftrag_vehicle_model').keyup(function(e) {
        _currentEnteredVehicle = $(this).val().toLowerCase()
        showVehicles()
    })
    
    $('.mainab_vehicle_search_container').on('click', '.mainab_vehicle_search', function(){
        let vehicleID = $(this).data('id')
        let vehicle = _serverVehicles.find(i => i.id == vehicleID)
        if(vehicle != null){
            let carType = getCarType(vehicle)
            _currentVehicleModel = vehicle.model
            _currentVehicleTypeName = carType.name
            _currentVehicleTypeMarkup = parseInt(carType.markup)
            _currentVehicleTypePercent = parseInt(carType.percent)
            $('#auftragsblatt_vehicle_type').html(_currentVehicleTypeName)
            $('#auftragsblatt_vehicle_markup').html(_currentVehicleTypeMarkup + "%")
            $('#auftragsblatt_vehicle_percent').html(_currentVehicleTypePercent + "%")
            $('#auftrag_vehicle_model').val(_currentVehicleModel)
            initAuftragsblatt()
            _currentEnteredVehicle = ""
            showVehicles()
        }
    })

    $('#customer_free_repair_confirm').click(() => {
        reset()
        switchState(STATES.SERACH_CUSTOMER)
        closePopup()
    })

    $('.mainab_auftragsblatt_row').on('input', '.auftragsblatt_input_change', function(){
        $(this).val($(this).val().replace(/[^a-z0-9]/gi, ''))
    })

    $('.mainab_auftragsblatt_row').on('input', '.auftragsblatt_input_change', function(){
        let elmID = $(this).parent().data('id')
        let elmPrice = $(this).parent().data('price')
        let withMarkup = $(this).parent().data('markup')
        let elmAmount = $(this).val()
        
        let priceElm = _prices.find(i => i.id == elmID)
        if(priceElm != null){
            if(elmAmount != ""){
                let exist = _choosedDatas.find(i => i.name == priceElm.name)
                if(exist == null){
                    let parkHourMinutes = 0
                    let parkHour = _parkHours.find(i => i.name == priceElm.name)
                    if(parkHour != null){
                        parkHourMinutes = parkHour.value
                        if(parkHour.name == "Totalschaden"){
                            let vehicle = _serverVehicles.find(i => i.model == _currentVehicleModel)
                            if(vehicle != null){
                                priceElm.vk = ((vehicle.price / 100) * (_currentVehicleTypePercent / 100))
                            }
                        }
                        if(parkHour.name == "Motorschaden"){
                            let vehicle = _serverVehicles.find(i => i.model == _currentVehicleModel)
                            if(vehicle != null){
                                let data = _generalData.find(i => i.type == BH_DATA_GENERAL_TYPES.MOTORSCHADEN_PROZENT)
                                if(data != null){
                                    priceElm.vk = ((vehicle.price / 100) * (data.value / 100))
                                }
                            }
                        }
                    }
                    let vkPrice = priceElm.vk
                    if(withMarkup && _currentVehicleTypeMarkup != 0){ // preisaufschlag
                        let markup = (priceElm.vk * (_currentVehicleTypeMarkup / 100))
                        vkPrice = (parseFloat(priceElm.vk) + markup)
                    }
                    _choosedDatas.push({
                        name: priceElm.name,
                        amount: parseInt(elmAmount),
                        price: parseFloat(vkPrice),
                        parkInMinutes: parseInt(parkHourMinutes)
                    })
                } else {
                    let find = _choosedDatas.find(i => i.name == priceElm.name)
                    if(find != null){
                        find.amount = parseInt(elmAmount)
                    }
                }
            } else {
                let find = _choosedDatas.find(i => i.name == priceElm.name)
                if(find != null){
                    let ind = _choosedDatas.indexOf(find)
                    if(ind > -1){
                        _choosedDatas.splice(ind, 1)
                    }
                }
            }
        }
        calcPrices()
    })

    $('.mainab_auftragsblatt_row').on('input', '.auftragsblatt_checkbox_change', function(){
        let elmID = $(this).parent().data('id')
        let elmPrice = $(this).parent().data('price')
        let isChecked = $(this)[0].checked
        let inspection = _inspections.find(i => i.id == elmID)
        if(inspection != null){
            if(isChecked){
                $(this).parent().addClass('active')
                _choosedDatas.push({
                    name: inspection.name,
                    amount: 1,
                    price: parseFloat(inspection.value),
                    parkInMinutes: 0
                })
            } else {
                $(this).parent().removeClass('active')
                let find = _choosedDatas.find(i => i.name == inspection.name)
                if(find != null){
                    let ind = _choosedDatas.indexOf(find);
                    if (ind > -1) {
                        _choosedDatas.splice(ind, 1);
                    }
                }
            }
        }
        calcPrices()
    })

    $('#sendAuftrag').click(() => {
        if(_currentVehicleModel == ""){
            new GNWX_NOTIFY({ text: "Auftrag kann noch nicht abgeschickt werden!", position: "bottom-left", class: "gnwx-warning", autoClose: 5000 });        
            return
        }
        let vehicleNumberplate = $('#auftrag_vehicle_numberplate').val()
        if(vehicleNumberplate == ""){
            new GNWX_NOTIFY({ text: "Auftrag kann noch nicht abgeschickt werden!", position: "bottom-left", class: "gnwx-warning", autoClose: 5000 });      
            return
        }
        _currentVehicleNumberplate = vehicleNumberplate
        if(_choosedDatas.length == 0){
            new GNWX_NOTIFY({ text: "Auftrag kann noch nicht abgeschickt werden!", position: "bottom-left", class: "gnwx-warning", autoClose: 5000 });      
            return
        }
        if(_currentCustomerIsState){
            _currentCustomerPayType= "Staatlich"
            sendAuftragSuccess()
        } else {
            $('#popup_confirm_abholung .page_popup_header_title').html(_currentCustomerName)
            showPopup('popup_confirm_abholung')
        }
    })

    $('#popup_confirm_abholung_close').click(() => {
        _currentCustomerPayType= ""
        closePopup()
    })

    $('#popup_confirm_abholung_no').click(() => {
        closePopup()
        $('#popup_confirm_rechnung .page_popup_header_title').html(_currentCustomerName)
        $('#popup_confirm_rechnung .page_popup_header_subtitle').html('Hat dieser Kunde die Rechnung in Höhe von $'+parseFloat(_currentPrice_brutto).toFixed(2)+' bezahlt?')
        showPopup('popup_confirm_rechnung')
    })

    $('#popup_confirm_abholung_yes').click(() => {
        closePopup()
        _currentCustomerPayType = "bei Abholung"
        sendAuftragSuccess()
    })

    $('#popup_confirm_rechnung_close').click(() => {
        _currentCustomerPayType= ""
        closePopup()
    })

    $('#popup_confirm_rechnung_no').click(() => {
        _currentCustomerPayType= ""
        closePopup()
        new GNWX_NOTIFY({ text: "Auftrag noch nicht bereit um abgeschickt zu werden!", position: "bottom-left", class: "gnwx-warning", autoClose: 5000 });
    })

    $('#popup_confirm_rechnung_yes').click(() => {
        _currentCustomerPayType= "via Rechnung"
        closePopup()
        sendAuftragSuccess()
    })

    $('.mainab_search_customer_results').on('click', '.mainab_search_customer_result', function(){
        let searchCustomerID = $(this).data('id')
        let customer = _allCustomers.find(i => i.id == searchCustomerID)
        if(customer != null){
            _searchedCustomerName = customer.name
            $('#search_customer_name').val(_searchedCustomerName)
            $('.mainab_search_customer_results').html('')
        }
    })

    $(document).keydown(function(e){
        if(e.ctrlKey){
            if(e.keyCode == 65){
                return false
            }
        }
    })
})

function showVehicles(){
    $('.mainab_vehicle_search_container').html('')
    let findVehicles = _serverVehicles.filter(p => p.model.toLowerCase().includes(_currentEnteredVehicle.toLowerCase()))
    if(findVehicles.length > 0){
        $('.mainab_vehicle_search_container').html('')
        findVehicles.forEach((veh) => {
            let container = '<div class="mainab_vehicle_search" data-id="'+veh.id+'">'+veh.model+'</div>'
            $('.mainab_vehicle_search_container').append(container)
        })
    }
    if(_currentEnteredVehicle == ""){
        $('.mainab_vehicle_search_container').html('')
    }
}

function switchState(state){
    _main_ab_isLoading = false
    $('.lds-ellipsis').css('display', 'none')
    $('#search_customer_modal').css('display', 'none')
    $('#cant_find_customer').css('display', 'none')
    $('.mainab_auftragsblatt_container').css('display', 'none')
    $('#sendAuftrag').css('display', 'none')
    $('#requestGutschein').css('display', 'none')
    $('#exitAuftrag').css('display', 'none')
    $('#add_new_customer').css('display', 'none')

    _allCustomers = []
    getData_customers(function(array){
        _allCustomers = JSON.parse(array)
    })

    switch(state){
        case STATES.SERACH_CUSTOMER:
            $('#search_customer_name').val('')
            $('#search_customer_number').val('')
            $('#search_customer_modal').css('display', 'block')
            setTimeout(() => {
                $('#search_customer_name').focus()
            }, 100);
            break;
        case STATES.LOADING:
            _main_ab_isLoading = true
            $('.lds-ellipsis').css('display', 'inline-block')
            break;
        case STATES.CANTFIND_WANTTOADD:
            $('#cant_find_customer_name').val(_searchedCustomerName)
            $('#cant_find_customer_number').val(_searchedCustomerNumber)
            $('#cant_find_customer').css('display', 'block')
            break;
        case STATES.AUFTRAGSBLATT:
            let enterStateTimestamp = getTimestampFromDateString(_currentCustomerEnterState)
            if((enterStateTimestamp + 604800) >= getCurrentTimestamp()){
                showPopup('popup_customer_free_repair')
            }
            $('#auftragsblatt_customer_rabatt').removeClass('redeemedCode')
            if(_redeemedGutschein || _currentCustomerIsServicePartner){
                $('#auftragsblatt_customer_rabatt').addClass('redeemedCode')
            }
            $('#requestGutschein').css('display', (_redeemedGutschein ? 'none' : 'flex'))
            $('#auftragsblatt_customer_rabatt').html(_currentCustomerRabatt + "%" + (_redeemedGutschein ? " (Gutschein)" : (_currentCustomerIsServicePartner ? " (Servicevertrag)" : "")))
            $('#auftragsblatt_customer_name').html(_currentCustomerName)
            $('#auftragsblatt_customer_number').html(_currentCustomerNumber)
            $('#auftragsblatt_customer_enterState').html(_currentCustomerEnterState)
            $('#sendAuftrag').css('display', 'flex')
            $('#exitAuftrag').css('display', 'flex')
            $('.mainab_auftragsblatt_container').css('display', 'flex')
            break;
        case STATES.ADD_NEW_CUSTOMER:
            $('#add_new_customer_name').val(_searchedCustomerName)
            $('#add_new_customer').css('display', 'block')
            break;
    }
}

function searchCustomer(){
    let customerName = $('#search_customer_name').val()
    let customerNumber = $('#search_customer_number').val()
    if(!customerName && !customerNumber){
        new GNWX_NOTIFY({ text: "Bitte fülle eins der beiden Felder aus!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
        return
    }
    if(customerName && customerNumber){
        new GNWX_NOTIFY({ text: "Du kannst entweder nach den Kundennamen oder nach der Kundennummer suchen!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
        return
    }
    if(customerNumber != "" && isNaN(customerNumber)){
        new GNWX_NOTIFY({ text: "Kundennummer darf nur aus Zahlen bestehen sowie keine Leerzeichen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
        return
    }
    if(customerName != "" && !isNaN(customerName)){
        new GNWX_NOTIFY({ text: "Kundenname darf nur aus Buchstaben bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
        return
    }

    _searchedCustomerName = customerName
    _searchedCustomerNumber = customerNumber
    switchState(STATES.LOADING)
    getDatas()
}

function getSearchedCustomer(){
    if(!_serverVehiclesLoaded || !_pricesLoaded || !_parkHoursLoaded || !_inspectionsLoaded || !_carTypesLoaded || !_generalDataLoaded) return
    if(_searchedCustomerName != ""){
        $.ajax({
            url: "scripts/searchCustomer_name.php",
            type: "POST",
            data: {
                name: _searchedCustomerName
            },
            beforeSend: function() { },
            success: function(response) {
                if(response == 1){
                    switchState(STATES.CANTFIND_WANTTOADD)
                } else {
                    let split = response.split('_')
                    _currentCustomerName = split[0]
                    _currentCustomerNumber = parseInt(split[1])
                    _currentCustomerRabatt = parseInt(split[2])
                    _currentCustomerEnterState = split[3]
                    _currentCustomerIsState = (split[5] == '0' ? false : true)
                    if(split[4] == 1){
                        switchState(STATES.SERACH_CUSTOMER)
                        new GNWX_NOTIFY({ text: _currentCustomerName + " ist bei uns im System gesperrt & wird nicht mehr bearbeitet!", position: "bottom-left", class: "gnwx-danger", autoClose: 7500 });
                    } else {
                        let checkServicePartner = _servicePartner.find(i => i.customerName == _currentCustomerName)
                        if(checkServicePartner != null){
                            _currentCustomerRabatt = parseFloat(checkServicePartner.rabatt)
                            _currentCustomerIsServicePartner = true
                        }
                        switchState(STATES.AUFTRAGSBLATT)
                    }
                }
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Auftragsblatt | Search Customer by Name", LOGTYPE.ERROR)
            }
        })

    // search by number
    } else if(_searchedCustomerNumber != ""){
        $.ajax({
            url: "scripts/searchCustomer_number.php",
            type: "POST",
            data: {
                number: parseInt(_searchedCustomerNumber)
            },
            beforeSend: function() { },
            success: function(response) {
                if(response == 1){
                    switchState(STATES.CANTFIND_WANTTOADD)
                } else {
                    let split = response.split('_')
                    _currentCustomerName = split[0]
                    _currentCustomerNumber = split[1]
                    _currentCustomerRabatt = split[2]
                    _currentCustomerEnterState = split[3]
                    _currentCustomerIsState = (split[5] == '0' ? false : true)
                    if(split[4] == 1){
                        switchState(STATES.SERACH_CUSTOMER)
                        new GNWX_NOTIFY({ text: _currentCustomerName + " ist bei uns im System gesperrt & wird nicht mehr bearbeitet!", position: "bottom-left", class: "gnwx-danger", autoClose: 7500 });
                    } else {
                        let checkServicePartner = _servicePartner.find(i => i.customerName == _currentCustomerName)
                        if(checkServicePartner != null){
                            _currentCustomerRabatt = parseFloat(checkServicePartner.rabatt)
                            _currentCustomerIsServicePartner = true
                        }
                        switchState(STATES.AUFTRAGSBLATT)
                    }
                }
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Auftragsblatt | Search Customer by Number", LOGTYPE.ERROR)
            }
        })
    }
}

function getDatas(){
    getData_serverVehicles(function(array){
        _serverVehicles = JSON.parse(array)
        _serverVehiclesLoaded = true
        getSearchedCustomer()
    })

    getData_prices(function(array){
        _prices = JSON.parse(array)
        _pricesLoaded = true
        getSearchedCustomer()
    })

    getData_parkHours(function(array){
        _parkHours = JSON.parse(array)
        _parkHoursLoaded = true
        getSearchedCustomer()
    })

    getData_inspections(function(array){
        _inspections = JSON.parse(array)
        _inspectionsLoaded = true
        getSearchedCustomer()
    })

    getData_carTypes(function(array){
        _carTypes = JSON.parse(array)
        _carTypesLoaded = true
        getSearchedCustomer()
    })

    getData_bhDataGeneral(function(array){
        _generalData = JSON.parse(array)
        _generalDataLoaded = true
        getSearchedCustomer()
    })

    getData_servicePartners(function(array){
        _servicePartner = JSON.parse(array)
        _servicePartnerLoaded = true
        getSearchedCustomer()
    })
}

function getCarType(vehicle){
    let foundType = false
    let type = "-"
    let vehiclePrice = vehicle.price / 100 // EK
    _carTypes.sort((a, b) => { return a.purchasingPrice - b.purchasingPrice; })
    _carTypes.forEach((cType) => {
        if(!foundType){
            if(cType.purchasingPrice >= vehiclePrice){
                foundType = true
                type = cType
            }
        }
    })
    return type
}

function getTimestampFromDateString(dateString){
    let split = dateString.split('.')
    const dateStr1 = split[2] + "." + split[1] + "." + split[0]
    const date1 = new Date(dateStr1)
    const timestamp = date1.getTime()
    const inSeconds = Math.round(date1.getTime() / 1000)
    return inSeconds
}

function calcPrices(){
    _currentPrice_summe = 0
    _currentVehicleEinparkdauer = 0
    _currentPrice_arbeitszeit = 0

    // get values
    let gewinnspanneValue = parseFloat(_generalData.find(i => i.type == BH_DATA_GENERAL_TYPES.GEWINNSPANNE).value)
    let steuernValue = parseFloat(_generalData.find(i => i.type == BH_DATA_GENERAL_TYPES.STEUERN).value)
    let parkHourCosts = parseInt(_generalData.find(i => i.type == BH_DATA_GENERAL_TYPES.EINPARKDAUER_MIN).value)
    
    _choosedDatas.forEach((cPrices) => {
        _currentPrice_summe += (cPrices.price * cPrices.amount)
        _currentVehicleEinparkdauer += (cPrices.parkInMinutes * cPrices.amount)
        _currentPrice_arbeitszeit += (cPrices.parkInMinutes * parkHourCosts)
    })

    // calc prices
    _currentPrice_gewinnspanne = parseFloat((_currentPrice_summe * (gewinnspanneValue / 100)))
    _currentPrice_netto = (_currentPrice_summe + _currentPrice_gewinnspanne + _currentPrice_arbeitszeit)
    _currentPrice_steuern = (_currentPrice_netto * (steuernValue / 100))
    _currentPrice_brutto = (_currentPrice_netto + _currentPrice_steuern)

    // customer rabatt
    let markup = _currentPrice_netto * (_currentCustomerRabatt / 100)
    _currentPrice_netto = _currentPrice_netto - markup

    // show prices
    $('#auftrag_pricelist_einparkdauer').html((_currentVehicleEinparkdauer == 0 ? '-' : _currentVehicleEinparkdauer + " Minuten"))
    $('#auftrag_pricelist_summe').html((_currentPrice_summe == 0 ? '-' : "$" + parseFloat(_currentPrice_summe).toFixed(2)))
    $('#auftrag_pricelist_gewinnspanne').html((_currentPrice_gewinnspanne == 0 ? '-' : "$" + parseFloat(_currentPrice_gewinnspanne).toFixed(2)))
    $('#auftrag_pricelist_arbeitszeit').html((_currentPrice_arbeitszeit == 0 ? '-' : "$" + parseFloat(_currentPrice_arbeitszeit).toFixed(2)))
    $('#auftrag_pricelist_netto').html((_currentPrice_netto == 0 ? '-' : "$" + parseFloat(_currentPrice_netto).toFixed(2)))
    $('#auftrag_pricelist_steuern').html((_currentPrice_steuern == 0 ? '-' : "$" + parseFloat(_currentPrice_steuern).toFixed(2)))
    $('#auftrag_pricelist_brutto').html((_currentPrice_brutto == 0 ? '-' : "$" + parseFloat(_currentPrice_brutto).toFixed(2)))
}

function initAuftragsblatt(){
    _choosedDatas = []
    calcPrices()
    $('.mainab_auftragsblatt_row').html('')
    let appendCount = 0
    let withMarkup = false
    _prices.forEach((price) => {
        appendCount++
        if(price.name == "Frontscheibe" && !withMarkup){ withMarkup = true }
        var container = '\
            <div class="mainab_auftragsblatt_input '+(highlightAuftragsblatt(price.name) ? 'highlight' : '')+'" data-id="'+price.id+'" data-price="'+price.vk+'" data-markup="'+withMarkup+'">\
                <div class="mainab_auftragsblatt_input_name">'+price.name+'<p style="display: '+(price.percent == 0 ? "none" : "inline-block")+'" class="brutto">('+price.percent+'% Preisnachlass)</p></div>\
                <input class="auftragsblatt_input_change" type="number" placeholder="0" autocomplete="off">\
            </div>\
        '

        if(appendCount > 15){
            $('.mainab_auftragsblatt_row.auftragsblatt_prices_2').append(container)
        } else {
            $('.mainab_auftragsblatt_row.auftragsblatt_prices_1').append(container)
        }
    })

    _inspections.forEach((insp) => {
        var container = '\
            <div class="mainab_auftragsblatt_input" data-id="'+insp.id+'" data-price="'+insp.value+'">\
                <label>'+insp.name+'</label>\
                <input class="auftragsblatt_checkbox_change" type="checkbox">\
            </div>\
        '
        $('.mainab_auftragsblatt_row.auftragsblatt_inspektion').append(container)
    })
}

function highlightAuftragsblatt(name){
    let result = false
    let find = HIGHLIGHT_NAMES.find(i => i.name.toLowerCase() == name.toLowerCase())
    if(find != null){ result = true }
    return result
}

function reset(){
    _serverVehicles = []
    _prices = []
    _parkHours = []
    _inspections = []
    _carTypes = []
    _generalData = []
    _choosedDatas = []
    _mainDatas = []
    _servicePartner = []
    _allCustomers = []
    _serverVehiclesLoaded = false
    _pricesLoaded = false
    _parkHoursLoaded = false
    _inspectionsLoaded = false
    _carTypesLoaded = false
    _generalDataLoaded = false
    _servicePartnerLoaded = false
    _currentCustomerIsServicePartner = false
    _searchedCustomerName = ""
    _searchedCustomerNumber = ""
    _redeemedGutschein = false
    _currentEnteredVehicle = ""
    _currentCustomerName = ""
    _currentCustomerNumber = 0
    _currentCustomerRabatt = 0
    _currentCustomerEnterState = ""
    _currentVehicleModel = ""
    _currentVehicleTypeName = ""
    _currentVehicleTypeMarkup = 0
    _currentVehicleTypePercent = 0
    _currentPrice_summe = 0
    _currentPrice_gewinnspanne = 0
    _currentPrice_arbeitszeit = 0
    _currentPrice_netto = 0
    _currentPrice_steuern = 0
    _currentPrice_brutto = 0
    _currentCustomerPayType = ""

    $('.mainab_auftragsblatt_row').html('')
    $('.mainab_auftragsblatt_row.auftragsblatt_inspektion').append('<div class="ab_notice">Bitte zuerst das Fahrzeugmodel auswählen!</div>')
    $('.mainab_auftragsblatt_row.auftragsblatt_prices_1').append('<div class="ab_notice">Bitte zuerst das Fahrzeugmodel auswählen!</div>')
    $('.mainab_auftragsblatt_row.auftragsblatt_prices_2').append('<div class="ab_notice">Bitte zuerst das Fahrzeugmodel auswählen!</div>')

    $('#auftragsblatt_customer_name').html('-')
    $('#auftragsblatt_customer_number').html('-')
    $('#auftragsblatt_customer_enterState').html('-')
    $('#auftragsblatt_customer_rabatt').html('-')
    $('#auftragsblatt_vehicle_type').html('-')
    $('#auftragsblatt_vehicle_markup').html('-')
    $('#auftragsblatt_vehicle_percent').html('-')
    $('#auftrag_pricelist_summe').html('-')
    $('#auftrag_pricelist_gewinnspanne').html('-')
    $('#auftrag_pricelist_arbeitszeit').html('-')
    $('#auftrag_pricelist_netto').html('-')
    $('#auftrag_pricelist_steuern').html('-')
    $('#auftrag_pricelist_brutto').html('-')
    $('#auftrag_pricelist_einparkdauer').html('-')
    $('#auftrag_vehicle_model').val('')
    $('#auftrag_vehicle_numberplate').val('')
}

function addMainData(){
    let checkServicePartner = _servicePartner.find(i => i.customerName == _currentCustomerName)
    let _gewinn = parseFloat((_currentPrice_netto - _currentPrice_summe).toFixed(2))
    _mainDatas.push({
        payType: _currentCustomerPayType,
        isServicePartner: (checkServicePartner == null ? false : true),
        isState: _currentCustomerIsState,
        workerName: _currentUsername,
        customerName: _currentCustomerName,
        customerNumber: _currentCustomerNumber,
        customerRabatt: _currentCustomerRabatt,
        customerEnterState: _currentCustomerEnterState,
        vehicleModel: _currentVehicleModel,
        vehicleNumberplate: _currentVehicleNumberplate,
        vehicleParkInTime: _currentVehicleEinparkdauer,
        summe: parseFloat(_currentPrice_summe.toFixed(2)),
        gewinnspanne: parseFloat(_currentPrice_gewinnspanne.toFixed(2)),
        workCost: parseFloat(_currentPrice_arbeitszeit.toFixed(2)),
        netto: parseFloat(_currentPrice_netto.toFixed(2)),
        steuern: parseFloat(_currentPrice_steuern.toFixed(2)),
        brutto: parseFloat(_currentPrice_brutto.toFixed(2)),
        gewinn: _gewinn
    })
}

function sendAuftragSuccess(){
    addMainData()
    $.ajax({
        url: "scripts/add/buchhaltung.php",
        type: "POST",
        data: {
            timestamp: getCurrentTimestamp(),
            checked: 0,
            mainData: JSON.stringify(_mainDatas),
            choosedData: JSON.stringify(_choosedDatas),
            syncedTo: 0
        },
        beforeSend: function() {
            switchState(STATES.LOADING)
        },
        success: function(response) {
            updateAccountActivity(_currentUsername + " hat den Auftrag #"+response+" mit dem Kunden "+_currentCustomerName+" in die Buchhaltung eingetragen!", LOGTYPE.ADDED)
            new GNWX_NOTIFY({ text: "Auftrag #"+response+" wurde erfolgreich in die Buchhaltung eingetragen", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
            switchState(STATES.SERACH_CUSTOMER)
        },
        error: function(){
            _redeemedGutschein = false
            updateAccountActivity("[ERROR] " + _currentUsername + " | Auftragsblatt | Add Auftrag", LOGTYPE.ERROR)
        }
    })
}

function getSerachCustomerResults(){
    $('.mainab_search_customer_results').html('')
    if(_searchedCustomerName != ""){
        let filter = _allCustomers.filter(i => i.name.toLowerCase().includes(_searchedCustomerName.toLocaleLowerCase()))
        if(filter.length > 0){
            filter.forEach((result) => {
                let container = '<div class="mainab_search_customer_result" data-id="'+result.id+'">'+result.name+'</div>'
                $('.mainab_search_customer_results').append(container)
            })
        }
    } else {
        $('.mainab_search_customer_results').html('')
    }
}