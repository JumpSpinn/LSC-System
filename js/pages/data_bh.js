var _bhDataGeneral = []
var _carTypes = []
var _inspections = []
var _parkHours = []
var _prices = []

var _currentEditCarType = null
var _currentEditInspection = null
var _currentEditParkHours = null
var _currentEditPrice = null

$(() => {
    //#region bhDataGeneral
    getData_bhDataGeneral(function(array){
        _bhDataGeneral = JSON.parse(array)
        showGeneralData()
    })

    $('#editGewinnspanne').click(() => {
        let GEWINNSPANNE = _bhDataGeneral.find(i => i.type == BH_DATA_GENERAL_TYPES.GEWINNSPANNE)
        $('#edit_gewinnspanne_value').val(GEWINNSPANNE.value)
        showPopup('popup_edit_gewinnspanne')
    })

    $('#editSteuern').click(() => {
        let STEUERN = _bhDataGeneral.find(i => i.type == BH_DATA_GENERAL_TYPES.STEUERN)
        $('#edit_steuern_value').val(STEUERN.value)
        showPopup('popup_edit_steuern')
    })

    $('#editMotorschaden').click(() => {
        let MOTORSCHADEN_PROZENT = _bhDataGeneral.find(i => i.type == BH_DATA_GENERAL_TYPES.MOTORSCHADEN_PROZENT)
        $('#edit_motorschaden_value').val(MOTORSCHADEN_PROZENT.value)
        showPopup('popup_edit_motorschaden')
    })

    $('#editEinparkMin').click(() => {
        let EINPARKDAUER_MIN = _bhDataGeneral.find(i => i.type == BH_DATA_GENERAL_TYPES.EINPARKDAUER_MIN)
        $('#edit_einparkMin_value').val(EINPARKDAUER_MIN.value)
        showPopup('popup_edit_einparkMin')
    })

    $('#close_edit_gewinnspanne').click(() => {
        closePopup()
    })

    $('#close_edit_steuern').click(() => {
        closePopup()
    })

    $('#close_edit_motorschaden').click(() => {
        closePopup()
    })

    $('#close_edit_einparkMin').click(() => {
        closePopup()
    })

    $('#close_new_inspection').click(() => {
        closePopup()
    })

    $('#edit_gewinnspanne_save').click(() => {
        let value = $('#edit_gewinnspanne_value').val()
        updateGeneralData(BH_DATA_GENERAL_TYPES.GEWINNSPANNE, value)
    })

    $('#edit_steuern_save').click(() => {
        let value = $('#edit_steuern_value').val()
        updateGeneralData(BH_DATA_GENERAL_TYPES.STEUERN, value)
    })

    $('#edit_motorschaden_save').click(() => {
        let value = $('#edit_motorschaden_value').val()
        updateGeneralData(BH_DATA_GENERAL_TYPES.MOTORSCHADEN_PROZENT, value)
    })

    $('#edit_einparkMin_save').click(() => {
        let value = $('#edit_einparkMin_value').val()
        updateGeneralData(BH_DATA_GENERAL_TYPES.EINPARKDAUER_MIN, value)
    })
    //#endregion

    //#region carTypes
    getData_carTypes(function(array){
        _carTypes = JSON.parse(array)
        showCarTypes()
    })

    $('#createCarType').click(() => {
        $('#new_carType_name').val('')
        $('#new_carType_purchasingPrice').val('')
        $('#new_carType_markup').val('')
        $('#new_carType_percent').val('')
        showPopup('popup_new_carType')
    })

    $('#close_new_carType').click(() => {
        closePopup()
    })

    $('#new_carType_save').click(() => {
        let name = $('#new_carType_name').val()
        let purchasingPrice = $('#new_carType_purchasingPrice').val()
        let markup = $('#new_carType_markup').val()
        let percent = $('#new_carType_percent').val()
        if(name && purchasingPrice && markup && percent){
            if(isNaN(purchasingPrice)){
                new GNWX_NOTIFY({ text: "Einkaufspreis darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(isNaN(markup)){
                new GNWX_NOTIFY({ text: "Preisaufschlag darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(isNaN(percent)){
                new GNWX_NOTIFY({ text: "Kosten Totalschaden in Prozent darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/add/carType.php",
                type: "POST",
                data: {
                    name: name,
                    purchasingPrice: parseInt(purchasingPrice),
                    markup: parseInt(markup),
                    percent: parseInt(percent)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_carTypes(function(array){
                        _carTypes = JSON.parse(array)
                        closePopup()
                        showCarTypes()
                        updateAccountActivity(_currentUsername + " hat ein neuen Fahrzeugtyp angelegt! (" + name + ")", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: name + " wurde als neuen Fahrzeugtyp angelegt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | NEW CARTYPE", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.carTypes').on('click', '.editCarType', function(){
        let carTypeID = $(this).parent().parent().data('id')
        let carType = _carTypes.find(i => i.id == carTypeID)
        if(carType != null){
            _currentEditCarType = carType
            $('#edit_carType_name').val(_currentEditCarType.name)
            $('#edit_carType_purchasingPrice').val(_currentEditCarType.purchasingPrice)
            $('#edit_carType_markup').val(_currentEditCarType.markup)
            $('#edit_carType_percent').val(_currentEditCarType.percent)
            showPopup('popup_edit_carType')
        }
    })

    $('#close_edit_carType').click(() => {
        closePopup()
    })

    $('#edit_carType_save').click(() => {
        let name = $('#edit_carType_name').val()
        let purchasingPrice = $('#edit_carType_purchasingPrice').val()
        let markup = $('#edit_carType_markup').val()
        let percent = $('#edit_carType_percent').val()
        if(name && purchasingPrice && markup && percent){
            if(isNaN(purchasingPrice)){
                new GNWX_NOTIFY({ text: "Einkaufspreis darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(isNaN(markup)){
                new GNWX_NOTIFY({ text: "Preisaufschlag darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(isNaN(percent)){
                new GNWX_NOTIFY({ text: "Kosten Totalschaden in Prozent darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/edit/carType.php",
                type: "POST",
                data: {
                    id: _currentEditCarType.id,
                    name: name,
                    purchasingPrice: parseInt(purchasingPrice),
                    markup: parseInt(markup),
                    percent: parseInt(percent)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_carTypes(function(array){
                        _carTypes = JSON.parse(array)
                        closePopup()
                        showCarTypes()
                        updateAccountActivity(_currentUsername + " hat ein Fahrzeugtyp bearbeitet! (" + name + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: name + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | EDIT CARTYPE", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('#edit_carType_delete').click(() => {
        $.ajax({
            url: "scripts/delete/carType.php",
            type: "POST",
            data: {
                id: _currentEditCarType.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_carTypes(function(array){
                    _carTypes = JSON.parse(array)
                    closePopup()
                    showCarTypes()
                    updateAccountActivity(_currentUsername + " hat den Fahrzeugtyp ("+ _currentEditCarType.name +") gelöscht!", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: _currentEditCarType.name + " wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | DELETE CARTYPE", LOGTYPE.ERROR)
            }
        })
    })
    //#endregion

    //#region inspections
    getData_inspections(function(array){
        _inspections = JSON.parse(array)
        showInspections()
    })

    $('#createInspection').click(() => {
        $('#new_inspection_name').val('')
        $('#new_inspection_value').val('')
        showPopup('popup_new_inspection')
    })

    $('#close_new_carType').click(() => {
        closePopup()
    })

    $('#new_inspection_save').click(() => {
        let name = $('#new_inspection_name').val()
        let value = $('#new_inspection_value').val()
        if(name && value){
            if(isNaN(value)){
                new GNWX_NOTIFY({ text: "Preis darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/add/inspection.php",
                type: "POST",
                data: {
                    name: name,
                    value: parseInt(value)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_inspections(function(array){
                        _inspections = JSON.parse(array)
                        closePopup()
                        showInspections()
                        updateAccountActivity(_currentUsername + " hat eine neue Inspektion angelegt! (" + name + ")", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: name + " wurde als neue Inspektion angelegt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | NEW INSPECTION", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.inspections').on('click', '.editInspection', function(){
        let id = $(this).parent().parent().data('id')
        let elm = _inspections.find(i => i.id == id)
        if(elm != null){
            _currentEditInspection = elm
            $('#edit_inspection_name').val(_currentEditInspection.name)
            $('#edit_inspection_value').val(_currentEditInspection.value)
            showPopup('popup_edit_inspection')
        }
    })

    $('#close_edit_inspection').click(() => {
        closePopup()
    })

    $('#edit_inspection_save').click(() => {
        let name = $('#edit_inspection_name').val()
        let value = $('#edit_inspection_value').val()
        if(name && value){
            if(isNaN(value)){
                new GNWX_NOTIFY({ text: "Preis darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/edit/inspection.php",
                type: "POST",
                data: {
                    id: _currentEditInspection.id,
                    name: name,
                    value: parseInt(value)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_inspections(function(array){
                        _inspections = JSON.parse(array)
                        closePopup()
                        showInspections()
                        updateAccountActivity(_currentUsername + " hat eine Inspektion bearbeitet! (" + name + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: name + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | EDIT INSPECTION", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('#edit_inspection_delete').click(() => {
        $.ajax({
            url: "scripts/delete/inspection.php",
            type: "POST",
            data: {
                id: _currentEditInspection.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_inspections(function(array){
                    _inspections = JSON.parse(array)
                    closePopup()
                    showInspections()
                    updateAccountActivity(_currentUsername + " hat die Inspektion ("+ _currentEditInspection.name +") gelöscht!", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: _currentEditInspection.name + " wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | DELETE INSPECTION", LOGTYPE.ERROR)
            }
        })
    })
    //#endregion

    //#region parkHours
    getData_parkHours(function(array){
        _parkHours = JSON.parse(array)
        showParkHours()
    })

    $('#createParkHour').click(() => {
        $('#new_parkHour_name').val('')
        $('#new_parkHour_value').val('')
        showPopup('popup_new_parkHour')
    })

    $('#close_new_carType').click(() => {
        closePopup()
    })

    $('#new_parkHour_save').click(() => {
        let name = $('#new_parkHour_name').val()
        let value = $('#new_parkHour_value').val()
        if(name && value){
            if(isNaN(value)){
                new GNWX_NOTIFY({ text: "Minuten darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/add/parkHour.php",
                type: "POST",
                data: {
                    name: name,
                    value: parseInt(value)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_parkHours(function(array){
                        _parkHours = JSON.parse(array)
                        closePopup()
                        showParkHours()
                        updateAccountActivity(_currentUsername + " hat eine neue Einparkdauer angelegt! (" + name + ")", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: name + " wurde als neue Einparkdauer angelegt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | NEW PARKHOUR", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.parkHours').on('click', '.editParkHour', function(){
        let id = $(this).parent().parent().data('id')
        let elm = _parkHours.find(i => i.id == id)
        if(elm != null){
            _currentEditParkHours = elm
            $('#edit_parkHour_name').val(_currentEditParkHours.name)
            $('#edit_parkHour_value').val(_currentEditParkHours.value)
            showPopup('popup_edit_parkHour')
        }
    })

    $('#close_edit_parkHour').click(() => {
        closePopup()
    })

    $('#close_new_parkHour').click(() => {
        closePopup()
    })

    $('#edit_parkHour_save').click(() => {
        let name = $('#edit_parkHour_name').val()
        let value = $('#edit_parkHour_value').val()
        if(name && value){
            if(isNaN(value)){
                new GNWX_NOTIFY({ text: "Minuten darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/edit/parkHour.php",
                type: "POST",
                data: {
                    id: _currentEditParkHours.id,
                    name: name,
                    value: parseInt(value)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_parkHours(function(array){
                        _parkHours = JSON.parse(array)
                        closePopup()
                        showParkHours()
                        updateAccountActivity(_currentUsername + " hat ein Einparkdauer-Eintrag bearbeitet! (" + name + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: name + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | EDIT PARKHOUR", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('#edit_parkHour_delete').click(() => {
        $.ajax({
            url: "scripts/delete/parkHour.php",
            type: "POST",
            data: {
                id: _currentEditParkHours.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_parkHours(function(array){
                    _parkHours = JSON.parse(array)
                    closePopup()
                    showParkHours()
                    updateAccountActivity(_currentUsername + " hat die Einparkdauer ("+ _currentEditParkHours.name +") gelöscht!", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: _currentEditParkHours.name + " wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | DELETE PARKHOUR", LOGTYPE.ERROR)
            }
        })
    })
    //#endregion

    //#region prices
    getData_prices(function(array){
        _prices = JSON.parse(array)
        showPrices()
    })

    $('#createPrice').click(() => {
        $('#new_prices_name').val('')
        $('#new_prices_ek').val('')
        $('#new_prices_percent').val('')
        showPopup('popup_new_prices')
    })

    $('#close_new_prices').click(() => {
        closePopup()
    })

    $('#new_prices_save').click(() => {
        let name = $('#new_prices_name').val()
        let ek = $('#new_prices_ek').val()
        let percent = $('#new_prices_percent').val()
        let vk = ek - (ek * (percent / 100).toFixed(2))
        if(name && ek && percent){
            if(isNaN(ek)){
                new GNWX_NOTIFY({ text: "Einkaufspreis darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(isNaN(percent)){
                new GNWX_NOTIFY({ text: "Preisnachlass darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/add/prices.php",
                type: "POST",
                data: {
                    name: name,
                    ek: parseFloat(ek),
                    percent: parseInt(percent),
                    vk: parseFloat(vk)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_prices(function(array){
                        _prices = JSON.parse(array)
                        closePopup()
                        showPrices()
                        updateAccountActivity(_currentUsername + " hat ein neuen Preis-Eintrag angelegt! (" + name + ")", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: name + " wurde als neuer Preis-Eintrag angelegt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | NEW PRICES", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.prices').on('click', '.editPrice', function(){
        let id = $(this).parent().parent().data('id')
        let elm = _prices.find(i => i.id == id)
        if(elm != null){
            _currentEditPrice = elm
            $('#edit_prices_name').val(_currentEditPrice.name)
            $('#edit_prices_ek').val(_currentEditPrice.ek)
            $('#edit_prices_percent').val(_currentEditPrice.percent)
            showPopup('popup_edit_prices')
        }
    })

    $('#close_edit_prices').click(() => {
        closePopup()
    })

    $('#edit_prices_save').click(() => {
        let name = $('#edit_prices_name').val()
        let ek = $('#edit_prices_ek').val()
        let percent = $('#edit_prices_percent').val()
        let vk = ek - (ek * (percent / 100).toFixed(2))
        if(name && ek && percent){
            if(isNaN(ek)){
                new GNWX_NOTIFY({ text: "Einkaufspreis darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(isNaN(percent)){
                new GNWX_NOTIFY({ text: "Preisnachlass darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/edit/prices.php",
                type: "POST",
                data: {
                    id: _currentEditPrice.id,
                    name: name,
                    ek: parseFloat(ek),
                    percent: parseInt(percent),
                    vk: parseFloat(vk)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_prices(function(array){
                        _prices = JSON.parse(array)
                        closePopup()
                        showPrices()
                        updateAccountActivity(_currentUsername + " hat ein Preis-Eintrag bearbeitet! (" + name + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: name + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | EDIT PRICES", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('#edit_prices_delete').click(() => {
        $.ajax({
            url: "scripts/delete/prices.php",
            type: "POST",
            data: {
                id: _currentEditPrice.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_prices(function(array){
                    _prices = JSON.parse(array)
                    closePopup()
                    showPrices()
                    updateAccountActivity(_currentUsername + " hat ein Preis-Eintrag ("+ _currentEditPrice.name +") gelöscht!", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: _currentEditPrice.name + " wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | DELETE PRICES", LOGTYPE.ERROR)
            }
        })
    })
    //#endregion
})

function showGeneralData(){
    let GEWINNSPANNE = _bhDataGeneral.find(i => i.type == BH_DATA_GENERAL_TYPES.GEWINNSPANNE)
    let STEUERN = _bhDataGeneral.find(i => i.type == BH_DATA_GENERAL_TYPES.STEUERN)
    let MOTORSCHADEN_PROZENT = _bhDataGeneral.find(i => i.type == BH_DATA_GENERAL_TYPES.MOTORSCHADEN_PROZENT)
    let EINPARKDAUER_MIN = _bhDataGeneral.find(i => i.type == BH_DATA_GENERAL_TYPES.EINPARKDAUER_MIN)
    $('#bhGeneralData_gewinnspanne').html(GEWINNSPANNE.value)
    $('#bhGeneralData_steuern').html(STEUERN.value)
    $('#bhGeneralData_motorschaden').html(MOTORSCHADEN_PROZENT.value)
    $('#bhGeneralData_einparkMin').html(EINPARKDAUER_MIN.value)
}

function updateGeneralData(type, value){
    if(value == ""){
        new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        return
    }

    let typeName = ""
    let desc = ""
    switch(type){
        case 1:
            typeName = "hat die Gewinnspanne"
            desc = "%"
            break;
        case 2:
            typeName = "hat die Steuern"
            desc = "%"
            break;
        case 3:
            typeName = "hat den Motorschaden in %"
            desc = "%"
            break;
        case 4:
            typeName = "die Einparkdauer in Minuten"
            desc = " Minuten"
            break;
    }

    $.ajax({
        url: "scripts/edit/updateGeneralData.php",
        type: "POST",
        data: {
            type: type,
            value: value,
        },
        beforeSend: function() { },
        success: function(response) {
            getData_bhDataGeneral(function(array){
                _bhDataGeneral = JSON.parse(array)
                closePopup()
                showGeneralData()
                updateAccountActivity(_currentUsername + " " + typeName + " auf " + value + desc + " geändert!", LOGTYPE.EDITED)
                new GNWX_NOTIFY({ text: typeName + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
            })
        },
        error: function(){
            updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltungsdaten | EDIT GENERAL DATA", LOGTYPE.ERROR)
        }
    })
}

function showCarTypes(array = _carTypes){
    $('.carTypes').html('')
    let containers = []
    array.forEach((carType) => {
        let container = '\
            <div class="bh_table_content" data-id="'+carType.id+'">\
                <span>'+carType.name+'</span>\
                <span>$'+carType.purchasingPrice+'</span>\
                <span>'+carType.markup+'%</span>\
                <span>'+carType.percent+'%</span>\
                <div class="bh_table_btn"><em class="mdi mdi-lead-pencil editCarType"></em></div>\
            </div>\
        '
        containers.push(container)
    })
    $('.carTypes').append(containers)
}

function showInspections(array = _inspections){
    $('.inspections').html('')
    let containers = []
    array.forEach((inspection) => {
        let container = '\
            <div class="bh_table_content" data-id="'+inspection.id+'">\
                <span>'+inspection.name+'</span>\
                <span>$'+inspection.value+'</span>\
                <div class="bh_table_btn"><em class="mdi mdi-lead-pencil editInspection"></em></div>\
            </div>\
        '
        containers.push(container)
    })
    $('.inspections').append(containers)
}

function showParkHours(array = _parkHours){
    $('.parkHours').html('')
    let containers = []
    array.forEach((parkHour) => {
        let container = '\
            <div class="bh_table_content" data-id="'+parkHour.id+'">\
                <span>'+parkHour.name+'</span>\
                <span>'+parkHour.value+' Minuten</span>\
                <div class="bh_table_btn"><em class="mdi mdi-lead-pencil editParkHour"></em></div>\
            </div>\
        '
        containers.push(container)
    })
    $('.parkHours').append(containers)
}

function showPrices(array = _prices){
    $('.prices').html('')
    let containers = []
    array.forEach((price) => {
        let container = '\
            <div class="bh_table_content" data-id="'+price.id+'">\
                <span>'+price.name+'</span>\
                <span>$'+price.ek+'</span>\
                <span>'+price.percent+'%</span>\
                <span>$'+price.vk+'</span>\
                <div class="bh_table_btn"><em class="mdi mdi-lead-pencil editPrice"></em></div>\
            </div>\
        '
        containers.push(container)
    })
    $('.prices').append(containers)
}