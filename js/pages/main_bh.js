var _buchhaltung = []
var _buchhaltungLoaded = false

$(() => {
    if(hasPermission(PAGE_PERMISSION_TYPES.BUCHHALTUNG_CHECK)){
        $('#checkBuchhaltung').css('display', 'flex')
    }
    if(hasPermission(PAGE_PERMISSION_TYPES.BUCHHALTUNG_RECHNUNG)){
        $('#createRechnung').css('display', 'flex')
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
        // TODO
    })
})

function showBuchhaltung(array = _buchhaltung){
    if(!_buchhaltungLoaded) return
    $('.buchhaltung_list').html('')

    let filtered = array.filter(f => f.syncedTo == 0)
    filtered.sort((a, b) => { return b.timestamp - a.timestamp; })
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
                </div>\
            </div>\
        '
        $('.buchhaltung_list').append(container)
    })
    toggleLoading(false)
}