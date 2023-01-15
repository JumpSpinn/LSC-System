var _createdBills = []
var _createdBillsLoaded = false
var _currentBill = null
var _currentBillPrice = 0
var _viewBillAppendCount = 42
var _viewBillAppendStartCount = 0
var _viewBillAppendStartMaxCount = 0

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
            showPopup('popup_view_bill')
        }
    })

    $(document).keydown(function(e) {
        if (e.which == 27) {
            closePopup()
        }
    })

    $('#search').on('input', function(){
        let searchValue = $(this).val().toLowerCase()
        let filter = _createdBills.filter(f => f.createdBy.toLowerCase().includes(searchValue) || f.createdFor.toLowerCase().includes(searchValue) || f.weekNumber.toLowerCase().includes(searchValue) || f.startDate.toLowerCase().includes(searchValue) || f.endDate.toLowerCase().includes(searchValue))
        if(searchValue != ""){
            showCreatedBills(filter)
        } else {
            showCreatedBills(_createdBills)
        }
    })

    $('.mitarbeiter_content_container').on('click', '.checkBill', function(){
        let billID = $(this).parent().parent().parent().data('billid')
        let bill = _createdBills.find(b => b.id == billID)
        if(bill != null){
            $.ajax({
                url: "scripts/edit/bill.php",
                type: "POST",
                data: {
                    id: bill.id,
                },
                beforeSend: function() { toggleLoading(true) },
                success: function(response) {
                    getData_createdBills(function(array){
                        _createdBills = JSON.parse(array)
                        _createdBillsLoaded = true
                        showCreatedBills()
                        updateAccountActivity(_currentUsername + " hat die Rechnung #"+bill.id+" als bezahlt hinterlegt! (" + bill.createdFor + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: "Rechnung (#"+_currentBill.id+") wurde als bezahlt hinterlegt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Rechnung | EDIT", LOGTYPE.ERROR)
                }
            })
        }
    })

    $('.bill_view_next_btn').click(() => {
        _viewBillAppendStartCount += _viewBillAppendCount
        initViewBill()
    })

    $('.bill_view_prev_btn').click(() => {
        _viewBillAppendStartCount -= _viewBillAppendCount
        if(_viewBillAppendStartCount <= 0){ _viewBillAppendStartCount = 0 }
        initViewBill()
    })
})

function showCreatedBills(array = _createdBills){
    $('.mitarbeiter_content_container').html('')
    array.forEach((bill) => {
        let billEntrys = JSON.parse(bill.data)
        let container = '\
            <div class="mitarbeiter_entry" data-billid="'+bill.id+'">\
                <div class="mitarbeiter_entry_header">\
                    <div class="mitarbeiter_entry_user">\
                        <span class="mitarbeiter_entry_user_title">R-'+getCurrentYear()+'-'+getBillNumber(bill.id)+'</span>\
                    </div>\
                    <div class="mitarbeiter_entry_btns">\
                        <em class="mdi mdi-check checkBill" style="display: '+(bill.state == 0 ? "flex" : "none")+'"></em>\
                        <em class="mdi mdi-eye viewBill"></em>\
                        <em class="mdi mdi-delete deleteBill" style="display: '+(bill.state == 0 ? "flex" : "none")+'"></em>\
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
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Bezahlstatus:</div>\
                            <div class="mitarbeiter_entry_col_desc '+(bill.state == 0 ? "bill_danger" : "bill_success")+'">'+(bill.state == 0 ? "Kein Zahlungseingang" : "Bezahlt")+'</div>\
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

    let appended = 0
    let billData = JSON.parse(_currentBill.data)
    _viewBillAppendStartMaxCount = billData.length
    billData.forEach((entry) => {
        let mainData = JSON.parse(entry.mainData)[0]
        let choosedData = JSON.parse(entry.choosedData)
        let isState = (mainData.payType.toLowerCase() == "staatlich" ? true : false)
        let entryContainer = '\
            <div class="bill_view_entry">\
                <div class="bill_view_entrys_header_col entry_col">'+convertTimestampDateOnly(entry.timestamp)+'</div>\
                <div class="bill_view_entrys_header_col entry_col">'+mainData.customerName+'</div>\
                <div class="bill_view_entrys_header_col entry_col">'+generateChoosedData(choosedData)+'</div>\
                <div class="bill_view_entrys_header_col entry_col">$'+(isState ? parseFloat(mainData.netto).toFixed(2) : parseFloat(mainData.brutto).toFixed(2))+'</div>\
            </div>\
        '
        appended++
        if(appended <= _viewBillAppendCount && appended >= _viewBillAppendStartCount){
            $('.bill_view_entrys_list').append(entryContainer)
        }
        addBillPrice((isState ? parseFloat(mainData.netto).toFixed(2) : parseFloat(mainData.brutto).toFixed(2)))
    })
    $('#viewBill_price').html('$'+_currentBillPrice.toFixed(2))
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
    _currentBillPrice += parseFloat(value)
}

function generateChoosedData(data){
    let choosedData = ""
    data.forEach((d) => {
        if(d.name.toLowerCase() == "reparaturset"){
            if(!choosedData.includes("Reparaturset")){
                choosedData += d.name + ", "
            }
        }
        if(d.name.toLowerCase().includes("gebühren")){
            if(!choosedData.toLowerCase().includes("gebühren")){
                choosedData += d.name + ", "
            }
        }
        if(d.name.toLowerCase().includes(("überprüft" || "durchgeführt"))){
            if(!choosedData.includes("Inspektion")){
                choosedData += "Inspektion, "
            }
        }
    })
    let s = choosedData.substring(0, choosedData.length - 2)
    return s.substring(0, 40) + '' + (s.length > 40 ? '..' : '')
}