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
        let billID = $(this).parent().parent().data('billid')
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
        let container = '\
            <div class="bill_container" data-billid="'+bill.id+'">\
                <div class="bill_details">Rechnung #'+bill.id+' | '+bill.createdBy+' | '+convertTimestamp(bill.createdTimestamp)+' | '+bill.createdFor+'</div>\
                <div class="bill_actions">\
                    <em class="mdi mdi-eye"></em>\
                    <em class="mdi mdi-delete deleteBill"></em>\
                </div>\
            </div>\
        '
        $('.mitarbeiter_content_container').append(container)
    })
    toggleLoading(false)
}