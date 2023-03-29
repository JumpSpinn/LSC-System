var _buchhaltung = []
var _buchhaltungLoaded = false

var _currentEditedEntry = null

$(() => {
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

    $('#close_switch_customer').click(() => {
        closePopup()
    })

    $('#close_delete_customer').click(() => {
        closePopup()
    })

    $('.buchhaltung_list').on('click', '.switchEntry', function(){
        let entryID = $(this).parent().parent().data('id')
        let foundEntry = _buchhaltung.find(i => i.id == entryID)
        if(foundEntry != null){
            _currentEditedEntry = foundEntry
            showPopup('popup_switch_customer')
        }
    })

    $('.buchhaltung_list').on('click', '.deleteEntry', function(){
        let entryID = $(this).parent().parent().data('id')
        let foundEntry = _buchhaltung.find(i => i.id == entryID)
        if(foundEntry != null){
            _currentEditedEntry = foundEntry
            showPopup('popup_delete_customer')
        }
    })

    $('#switch_customer_confirm').click(() => {
        $.ajax({
            url: "scripts/updateBuchhaltung.php",
            type: "POST",
            data: {
                id: _currentEditedEntry.id,
                syncedTo: 0
            },
            beforeSend: function() { },
            success: function(response) {
                getData_buchhaltung(function(array){
                    _buchhaltung = JSON.parse(array)
                    _buchhaltungLoaded = true
                    closePopup()
                    showBuchhaltung()
                    updateAccountActivity(_currentUsername + " hat den Auftrag #"+_currentEditedEntry.id+" in die Buchhaltung umgetragen!", LOGTYPE.EDITED)
                    new GNWX_NOTIFY({ text: "Der Auftrag #" + _currentEditedEntry.id + " wurde erfolgreich in die Buchhaltung umgetragen!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Azubi-Buchhaltung | DELETE", LOGTYPE.ERROR)
            }
        })
    })

    $('#delete_customer_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/buchhaltung.php",
            type: "POST",
            data: {
                id: _currentEditedEntry.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_buchhaltung(function(array){
                    _buchhaltung = JSON.parse(array)
                    _buchhaltungLoaded = true
                    closePopup()
                    showBuchhaltung()
                    updateAccountActivity(_currentUsername + " hat den Auftrag #"+_currentEditedEntry.id+" gelöscht!", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: "Der Auftrag #" + _currentEditedEntry.id + " wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Azubi-Buchhaltung | DELETE", LOGTYPE.ERROR)
            }
        })
    })
})

function showBuchhaltung(array = _buchhaltung){
    if(!_buchhaltungLoaded) return
    $('.buchhaltung_list').html('')

    let filtered = array.filter(f => f.syncedTo == 1)
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
                    <div class="bh_entry_content_btn switchEntry"><em class="mdi mdi-swap-horizontal"></em></div>\
                    <div class="bh_entry_content_btn deleteEntry"><em class="mdi mdi-trash-can"></em></div>\
                </div>\
            </div>\
        '
        containers.push(container)
    })
    $('.buchhaltung_list').append(containers)
    toggleLoading(false)
}