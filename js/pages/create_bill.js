var _createdBills = []
var _createdBillsLoaded = false
var _currentBill = null
var _currentBillPrice = 0

$(() => {
    toggleLoading(true)
    getData_createdBills(function(array){
        _createdBills = JSON.parse(array)
        _createdBillsLoaded = true
        showCreatedBills()
    })

    $('.mitarbeiter_content_container').on('click', '.deleteBill', function(){
        let billID = $(this).parent().parent().parent().data('billid')
        let bill = _createdBills.find(b => b.id == billID)
        if(bill != null){
            _currentBill = bill
            showPopup('popup_delete_bill')
        }
    })

    $('#close_delete_bill').click(() => {
        closePopup()
    })

    $('#delete_bill_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/bill.php",
            type: "POST",
            data: {
                id: _currentBill.id,
            },
            beforeSend: function() { toggleLoading(true) },
            success: function(response) {
                getData_createdBills(function(array){
                    _createdBills = JSON.parse(array)
                    _createdBillsLoaded = true
                    showCreatedBills()
                    closePopup()
                    updateAccountActivity(_currentUsername + " hat die Rechnung #"+_currentBill.id+" gelöscht! (" + _currentBill.createdFor + ")", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: "Rechnung (#"+_currentBill.id+") wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    _currentBill = null
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Rechnung | REMOVE", LOGTYPE.ERROR)
            }
        })
    })

    $('.mitarbeiter_content_container').on('click', '.viewBill', function(){
        let billID = $(this).parent().parent().parent().data('billid')
        let bill = _createdBills.find(b => b.id == billID)
        if(bill != null){
            _currentBill = bill
            initViewBill()
        }
    })

    $(document).keydown(function(e) {
        if (e.which == 27) {
            closePopup()
        }
    })
})

function showCreatedBills(){
    $('.mitarbeiter_content_container').html('')
    _createdBills.forEach((bill) => {
        let billEntrys = JSON.parse(bill.data)
        let container = '\
            <div class="mitarbeiter_entry" data-billid="'+bill.id+'">\
                <div class="mitarbeiter_entry_header">\
                    <div class="mitarbeiter_entry_user">\
                        <span class="mitarbeiter_entry_user_title">R-'+getCurrentYear()+'-'+getBillNumber(bill.id)+'</span>\
                    </div>\
                    <div class="mitarbeiter_entry_btns">\
                        <em class="mdi mdi-eye viewBill"></em>\
                        <em class="mdi mdi-delete deleteBill"></em>\
                    </div>\
                </div>\
                <div class="mitarbeiter_entry_details">\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Erstellt am:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+convertTimestamp(bill.createdTimestamp)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Erstellt von:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+bill.createdBy+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Erstellt für:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+bill.createdFor+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Rechnungspositionen:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+billEntrys.length+'</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        '
        $('.mitarbeiter_content_container').append(container)
    })
    toggleLoading(false)
}

function initViewBill(){
    _currentBillPrice = 0
    $('.bill_view_entrys_list').html('')
    $('#viewBill_billNumber').html('R-'+getCurrentYear()+'-'+getBillNumber(_currentBill.id))
    $('#viewBill_timestamp').html(convertTimestampDateOnly(_currentBill.createdTimestamp))
    $('#viewBill_startDate').html('<p>Start</p>: ' + _currentBill.startDate)
    $('#viewBill_endDate').html('<p>Ende</p>: ' + _currentBill.endDate)
    $('#viewBill_weekNumber').html('Kalenderwoche: ' + _currentBill.weekNumber)

    let billData = JSON.parse(_currentBill.data)
    billData.forEach((entry) => {
        let mainData = JSON.parse(entry.mainData)[0]
        let choosedData = JSON.parse(entry.choosedData)
        console.log(choosedData)
        let isState = (mainData.payType.toLowerCase() == "staatlich" ? true : false)
        let entryContainer = '\
            <div class="bill_view_entry">\
                <div class="bill_view_entrys_header_col entry_col">'+convertTimestampDateOnly(entry.timestamp)+'</div>\
                <div class="bill_view_entrys_header_col entry_col">'+mainData.customerName+'</div>\
                <div class="bill_view_entrys_header_col entry_col">coming soon..</div>\
                <div class="bill_view_entrys_header_col entry_col">$'+(isState ? parseFloat(mainData.netto).toFixed(2) : parseFloat(mainData.brutto).toFixed(2))+'</div>\
            </div>\
        '
        $('.bill_view_entrys_list').append(entryContainer)
        addBillPrice((isState ? parseFloat(mainData.netto).toFixed(2) : parseFloat(mainData.brutto).toFixed(2)))
    })
    let endingPrice = '\
        <div class="bill_view_entry endingEntry">\
            <div class="bill_view_entrys_header_col entry_col">Gesamtsumme:</div>\
            <div class="bill_view_entrys_header_col entry_col"></div>\
            <div class="bill_view_entrys_header_col entry_col"></div>\
            <div class="bill_view_entrys_header_col entry_col">$'+_currentBillPrice+'</div>\
        </div>\
    '
    $('.bill_view_entrys_list').append(endingPrice)
    showPopup('popup_view_bill')
}

function getBillNumber(billId){
    let billNumber = ""
    if(billId > 9 && billId < 100){
        billNumber = "0" + billId
    } else if(billId > 99 && billId < 1000){
        billNumber = billId
    } else if(billId < 10){
        billNumber = "00" + billId
    }
    return billNumber
}

function getCurrentYear(){
    return new Date().getFullYear()
}

function addBillPrice(value){
    console.log(value)
    console.log(parseFloat(value))
    _currentBillPrice += value
}