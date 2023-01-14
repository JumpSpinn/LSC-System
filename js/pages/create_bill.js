var _createdBills = []
var _createdBillsLoaded = false

var _currentBill = null

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
                        <em class="mdi mdi-eye"></em>\
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