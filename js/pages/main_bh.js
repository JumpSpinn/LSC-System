var _buchhaltung = []
var _buchhaltungLoaded = false

var _createBillData = []
var _customers = []
var _searchedCustomerName = ""
var _createdBillFor = ""

var _canDeleteBH = false
var _wantDeleteEntry = null

var PAYTYPES = [
    { type: "Staatlich" },
    { type: "Sammelrechnung" }
]

$(() => {
    if(hasPermission(PAGE_PERMISSION_TYPES.BUCHHALTUNG_RECHNUNG)){
        $('#createRechnung').css('display', 'flex')
        $('#archiveBuchhaltung').css('display', 'flex')
    }

    if(hasPermission(PAGE_PERMISSION_TYPES.BUCHHALTUNG_DELETE)){
        _canDeleteBH = true
    }

    toggleLoading(true)
    getData_buchhaltung(function(array){
        _buchhaltung = JSON.parse(array)
        _buchhaltungLoaded = true
        showBuchhaltung()
    })

    $('.buchhaltung_list').on('click', '.viewEntry', function(){
        $('.bh_entry_container').removeClass('active')
        $(this).parent().parent().addClass('active')
        let entryID = $(this).parent().parent().data('id')
        let foundEntry = _buchhaltung.find(i => i.id == entryID)
        if(foundEntry != null){
            let choosedDatas = JSON.parse(foundEntry.choosedData)
            let mainDatas = JSON.parse(foundEntry.mainData)[0]
            $('.buchhaltung_more_information_repaired_col').html('')
            $('.buchhaltung_more_information_header span').html('Auftrag #' + foundEntry.id + " | Informationen")
            $('#view_workerName').html(mainDatas.workerName)
            $('#view_customerName').html(mainDatas.customerName)
            $('#view_customerNumber').html(mainDatas.customerNumber)
            $('#view_customerRabatt').html(mainDatas.customerRabatt + "%")
            $('#view_vehicleModel').html(mainDatas.vehicleModel)
            $('#view_customerPayType').html(mainDatas.payType)
            $('#view_vehicleNumberplate').html(mainDatas.vehicleNumberplate.toUpperCase())
            $('#view_parkInMinutes').html(mainDatas.vehicleParkInTime + " Minuten")
            $('#view_workCost').html("$" + mainDatas.workCost)
            let append = false
            choosedDatas.forEach((data) => {
                let className = ''
                if(data.name == "Reparaturset"){ className = 'buchhaltung_green' }
                if(data.name.toLowerCase().includes('gebühren')){ className = 'buchhaltung_green' }
                if(data.name.includes('überprüft') || data.name.includes('durchgeführt')){ className = 'buchhaltung_purple' }

                let container = '\
                    <div class="buchhaltung_more_information_repaired_row '+className+'">\
                        <span>'+data.name+'</span>\
                        <span>'+data.amount+'x</span>\
                    </div>\
                '
                if(!append){
                    append = true
                    $('.buchhaltung_more_information_repaired_col.repairedList1').append(container)
                } else {
                    append = false
                    $('.buchhaltung_more_information_repaired_col.repairedList2').append(container)
                }
            })
            $('.buchhaltung_more_information_container').fadeIn(150)
        }
    })

    $('#closeView').click(() => {
        $('.bh_entry_container').removeClass('active')
        $('.buchhaltung_more_information_container').fadeOut(150)
    })

    $('#createRechnung').click(() => {
        _createBillData = []
        _customers = []
        _searchedCustomerName = ""
        toggleLoading(true)
        getData_customers(function(array){
            _customers = JSON.parse(array)
            showPopup('popup_create_bill')
            toggleLoading(false)
        })
    })

    $('#close_create_bill').click(() => {
        closePopup()
    })

    $('#create_bill_confirm').click(() => {
        let checkPayType = $('#create_bill_payType').val()
        let findPayType = PAYTYPES.find(p => p.type.toLowerCase() == checkPayType.toLowerCase())
        if(findPayType == null){
            new GNWX_NOTIFY({ text: "Bezahlart ist nicht gültig! - Bitte gebe Sammelrechnung oder Staatlich an!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
            return
        }
        createBill()
    })

    $('#create_bill_customerName').on('keyup', function(){
        let value = $(this).val()
        _searchedCustomerName = value
        getCustomerResult()
    })

    $('.mainab_search_customer_results').on('click', '.mainab_search_customer_result', function(){
        let searchCustomerID = $(this).data('id')
        let customer = _customers.find(i => i.id == searchCustomerID)
        if(customer != null){
            _searchedCustomerName = customer.name
            $('#create_bill_customerName').val(_searchedCustomerName)
            $('.mainab_search_customer_results').html('')
        }
    })

    $('#archiveBuchhaltung').click(() => {
        showPopup('popup_archive_buchhaltung')
    })

    $('#close_archive_buchhaltung').click(() => {
        closePopup()
    })

    $('#archive_confirm').click(() => {
        let start = $('#archive_start').val()
        let end = $('#archive_end').val()
        if(!start || !end){
            new GNWX_NOTIFY({ text: "Bitte fülle alle Pflichtfelder aus!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
            return
        }
        let archived = _buchhaltung.filter(b => b.id >= parseInt(start) && b.id <= parseInt(end))
        if(archived.length == 0){
            new GNWX_NOTIFY({ text: "Es wurden keine Einträge gefunden, die archiviert werden können!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
            return
        }
        let count = 0
        let failed = false
        toggleLoading(true)
        archived.forEach((entry) => {
            $.ajax({
                url: "scripts/archiveBuchhaltung.php",
                type: "POST",
                data: {
                    id: entry.id
                },
                beforeSend: function() {  },
                success: function(response) {
                    count++
                },
                error: function(){
                    if(!failed){
                        failed = true
                        updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltung | ARCHIVE", LOGTYPE.ERROR)
                    }
                }
            })

            if(count >= archived.length){
                getData_buchhaltung(function(array){
                    _buchhaltung = JSON.parse(array)
                    _buchhaltungLoaded = true
                    showBuchhaltung()
                    closePopup()
                    updateAccountActivity(_currentUsername + " hat die Buchhaltung archiviert! (von Auftrag #"+start+" bis #"+end+")", LOGTYPE.EDITED)
                    new GNWX_NOTIFY({ text: "Buchhaltung wurde erfolgreich archiviert! (von Auftrag #"+start+" bis #"+end+")", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    toggleLoading(false)
                })
            }
        })
    })

    $('.buchhaltung_list').on('click', '.deleteEntry', function(){
        let entryID = $(this).parent().parent().data('id')
        let foundEntry = _buchhaltung.find(i => i.id == entryID)
        if(foundEntry != null){
            _wantDeleteEntry = foundEntry
            showPopup('popup_delete_entry')
        }
    })

    $('#popup_delete_entry_abort').click(() => {
        closePopup()
        _wantDeleteEntry = null
    })

    $('#popup_delete_entry_confirm').click(() => {
        closePopup()
        $.ajax({
            url: "scripts/delete/bh.php",
            type: "POST",
            data: {
                id: _wantDeleteEntry.id
            },
            beforeSend: function() { toggleLoading(true) },
            success: function(response) {
                getData_buchhaltung(function(array){
                    _buchhaltung = JSON.parse(array)
                    _buchhaltungLoaded = true
                    showBuchhaltung()
                    updateAccountActivity(_currentUsername + " hat ein Auftrag aus der Buchhaltung gelöscht! (" + _wantDeleteEntry.id + ")", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: "Auftrag #" + _wantDeleteEntry.id + " wurde aus der Buchhaltung gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltung | DELETE", LOGTYPE.ERROR)
            }
        })
    })
})

function showBuchhaltung(array = _buchhaltung){
    if(!_buchhaltungLoaded) return
    $('.buchhaltung_list').html('')

    let filtered = array.filter(f => f.syncedTo == 0)
    filtered.sort((a, b) => { return b.timestamp - a.timestamp; })

    let containers = []
    filtered.forEach((bh) => {
        let mainDatas = JSON.parse(bh.mainData)[0]
        let container = '\
            <div class="bh_entry_container '+(mainDatas.isState ? 'isState' : (mainDatas.isServicePartner ? 'isServicePartner' : ''))+'" data-id="'+bh.id+'">\
                <div class="bh_entry_content_container">\
                    <div class="bh_entry_content_title">Auftrag #'+bh.id+'</div>\
                    <div class="bh_entry_content_col">\
                        <div class="bh_entry_content_row">\
                            <span>Datum:</span>\
                            <p>'+convertTimestamp(bh.timestamp)+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Mitarbeiter:</span>\
                            <p>'+mainDatas.workerName+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Kunden-Nr.:</span>\
                            <p>'+mainDatas.customerNumber+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Kunde:</span>\
                            <p>'+mainDatas.customerName+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Rabatt</span>\
                            <p>'+mainDatas.customerRabatt+'% '+(mainDatas.isServicePartner ? '(Servicevertrag)' : '')+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Fahrzeug:</span>\
                            <p>'+mainDatas.vehicleModel+'</p>\
                        </div>\
                    </div>\
                    <div class="bh_entry_content_col">\
                        <div class="bh_entry_content_row">\
                            <span>Einkaufspreis</span>\
                            <p>$'+mainDatas.summe+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Gewinnspanne</span>\
                            <p>$'+mainDatas.gewinnspanne+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Netto</span>\
                            <p>$'+mainDatas.netto+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Steuern</span>\
                            <p>$'+mainDatas.steuern+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Brutto</span>\
                            <p>$'+mainDatas.brutto+'</p>\
                        </div>\
                        <div class="bh_entry_content_row">\
                            <span>Gewinn</span>\
                            <p class="'+(mainDatas.gewinn < 0 ? 'red' : 'green')+'">$'+mainDatas.gewinn+'</p>\
                        </div>\
                    </div>\
                </div>\
                <div class="bh_entry_content_btns">\
                    <div class="bh_entry_content_btn viewEntry"><em class="mdi mdi-eye"></em></div>\
                    <div class="bh_entry_content_btn deleteEntry" style="display: '+(_canDeleteBH ? 'flex' : 'none')+'"><em class="mdi mdi-delete"></em></div>\
                </div>\
            </div>\
        '
        containers.push(container)
    })
    $('.buchhaltung_list').append(containers)
    toggleLoading(false)
}

function getAllStateEntrys(startID, endID, stateName = ""){
    let array = []
    if(stateName == ""){
        let filter = _buchhaltung.filter(f => f.id >= parseInt(startID) && f.id <= parseInt(endID))
        filter.forEach((entry) => {
            let mainData = JSON.parse(entry.mainData)[0]
            if(mainData.payType == "Staatlich"){
                array.push(entry)
            }
        })
    } else {
        let filter = _buchhaltung.filter(f => f.id >= parseInt(startID) && f.id <= parseInt(endID))
        filter.forEach((entry) => {
            let mainData = JSON.parse(entry.mainData)[0]
            if(mainData.payType == "Staatlich" && mainData.customerName == stateName){
                array.push(entry)
            }
        })
    }
    return array
}

function getAllServicepartnerEntrys(startID, endID, serviceName = ""){
    let array = []
    if(serviceName == ""){
        let filter = _buchhaltung.filter(f => f.id >= parseInt(startID) && f.id <= parseInt(endID))
        filter.forEach((entry) => {
            let mainData = JSON.parse(entry.mainData)[0]
            if(mainData.payType == "Sammelrechnung"){
                array.push(entry)
            }
        })
    } else {
        let filter = _buchhaltung.filter(f => f.id >= parseInt(startID) && f.id <= parseInt(endID))
        filter.forEach((entry) => {
            let mainData = JSON.parse(entry.mainData)[0]
            if(mainData.payType == "Sammelrechnung" && mainData.customerName == serviceName){
                array.push(entry)
            }
        })
    }
    return array
}

function getCustomerResult(){
    $('.mainab_search_customer_results').html('')
    if(_searchedCustomerName != ""){
        let filter = _customers.filter(i => i.name.toLowerCase().includes(_searchedCustomerName.toLocaleLowerCase()))
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

function createBill(){
    let createBill_start = $('#create_bill_startValue').val()
    let createBill_end = $('#create_bill_endValue').val()
    let createBill_payType = $('#create_bill_payType').val()
    let createBill_customerName = $('#create_bill_customerName').val()
    let createBill_startDate = $('#create_bill_startDate').val()
    let createBill_endDate = $('#create_bill_endDate').val()
    let createBill_weekNumber = $('#create_bill_weekNumber').val()
    if(!createBill_start || !createBill_end || !createBill_payType || !createBill_startDate || !createBill_endDate || !createBill_weekNumber){
        new GNWX_NOTIFY({ text: "Bitte fülle alle benötigten Felder aus!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        return
    }
    if(createBill_payType.toLowerCase() == "staatlich"){
        _createdBillFor = (createBill_customerName == "" ? "Staatlich" : createBill_customerName)
        _createBillData = getAllStateEntrys(createBill_start, createBill_end, createBill_customerName)
    } else if(createBill_payType.toLowerCase() == "sammelrechnung"){
        _createdBillFor = (createBill_customerName == "" ? "Servicepartner" : createBill_customerName)
        _createBillData = getAllServicepartnerEntrys(createBill_start, createBill_end, createBill_customerName)
    }
    if(_createBillData.length == 0){
        new GNWX_NOTIFY({ text: "Rechnung kann nicht erstellt werden, da keine Ergebnisse gefunden wurden!", position: "bottom-left", class: "gnwx-warning", autoClose: 5000 });
        return
    }
    initCreateBill(createBill_startDate, createBill_endDate, createBill_weekNumber)
}

function initCreateBill(startDate, endDate, weekNumber){
    toggleLoading(true)
    _createBillData.forEach((updateEntry) => {
        $.ajax({
            url: "scripts/updateBuchhaltungBill.php",
            type: "POST",
            data: {
                id: updateEntry.id
            },
            beforeSend: function() { },
            success: function(response) { },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltung | UPDATE", LOGTYPE.ERROR)
            }
        })
    })
    $.ajax({
        url: "scripts/add/bill.php",
        type: "POST",
        data: {
            createdBy: _currentUsername,
            createdTimestamp: getCurrentTimestamp(),
            createdFor: _createdBillFor,
            startDate: translateDate(startDate),
            endDate: translateDate(endDate),
            weekNumber: weekNumber,
            data: JSON.stringify(_createBillData),
            state: 0
        },
        beforeSend: function() { toggleLoading(true) },
        success: function(response) {
            getData_buchhaltung(function(array){
                _buchhaltung = JSON.parse(array)
                _buchhaltungLoaded = true
                showBuchhaltung()
                closePopup()
                updateAccountActivity(_currentUsername + " hat eine neue Rechnung (#"+response+") erstellt! (" + _createdBillFor + ")", LOGTYPE.ADDED)
                new GNWX_NOTIFY({ text: "Rechnung (#"+response+") wurde erfolgreich erstellt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                _createdBillFor = ""
            })
        },
        error: function(){
            updateAccountActivity("[ERROR] " + _currentUsername + " | Buchhaltung/Rechnung | ADD", LOGTYPE.ERROR)
        }
    })
}