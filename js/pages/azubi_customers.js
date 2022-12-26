var _kunden = []
var _kundenLoaded = false

var _currentEditKunde = null

$(() => {
    toggleLoading(true)
    getData_customers(function(array){
        _kunden = JSON.parse(array)
        _kundenLoaded = true
        showKunden()
    })

    $('.mitarbeiter_content_container').on('click', '.switchCustomer', function(){
        let kundenID = $(this).parent().parent().parent().data('id')
        let kunden = _kunden.find(i => i.id == kundenID)
        if(kunden != null){
            _currentEditKunde = kunden
            showPopup('popup_switch_customer')
        }
    })

    $('.mitarbeiter_content_container').on('click', '.deleteCustomer', function(){
        let kundenID = $(this).parent().parent().parent().data('id')
        let kunden = _kunden.find(i => i.id == kundenID)
        if(kunden != null){
            _currentEditKunde = kunden
            showPopup('popup_delete_customer')
        }
    })

    $('#close_switch_customer').click(() => {
        closePopup()
    })

    $('#close_delete_customer').click(() => {
        closePopup()
    })

    $('#switch_customer_confirm').click(() => {
        $.ajax({
            url: "scripts/switchCustomer.php",
            type: "POST",
            data: {
                id: _currentEditKunde.id,
                syncedTo: CUSTOMERS_SYNCEDTO.MAIN
            },
            beforeSend: function() { },
            success: function(response) {
                getData_customers(function(array){
                    _kunden = JSON.parse(array)
                    _kundenLoaded = true
                    closePopup()
                    showKunden()
                    updateAccountActivity(_currentUsername + " hat den Kunden " + _currentEditKunde.name + " in die Kundenkartei verschoben!", LOGTYPE.EDITED)
                    new GNWX_NOTIFY({ text: _currentEditKunde.name + " wurde erfolgreich in die Kundenkartei aufgenommen!", position: "bottom-left", class: "gnwx-success", autoClose: 3500 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Azubi-Kundenkartei | SWITCH", LOGTYPE.ERROR)
            }
        })
    })

    $('#delete_customer_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/customer.php",
            type: "POST",
            data: {
                id: _currentEditKunde.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_customers(function(array){
                    _kunden = JSON.parse(array)
                    _kundenLoaded = true
                    closePopup()
                    showKunden()
                    updateAccountActivity(_currentUsername + " hat einen Kunden gelöscht! (" + _currentEditKunde.name + ")", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: _currentEditKunde.name + " wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 3500 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Azubi-Kundenkartei | DELETE", LOGTYPE.ERROR)
            }
        })
    })
})

function showKunden(array = _kunden){
    if(!_kundenLoaded) return
    $('.mitarbeiter_content_container').html('')
    array.sort((a, b) => { return a.number - b.number; })
    let filteredArray = array.filter(i => i.syncedTo == CUSTOMERS_SYNCEDTO.SCHOOL)
    filteredArray.forEach((kunde) => {
        let container = '\
            <div class="mitarbeiter_entry" data-id="'+kunde.id+'">\
                <div class="mitarbeiter_entry_header">\
                    <div class="mitarbeiter_entry_user">\
                        <span class="mitarbeiter_entry_user_title">'+kunde.name+'</span>\
                        <span class="mitarbeiter_entry_user_subtitle">Kundennummer: '+kunde.number+'</span>\
                        <span class="mitarbeiter_entry_user_lastAction">Erstellt von '+kunde.createdMember+' am '+convertTimestamp(kunde.createdTimestamp)+'</span>\
                    </div>\
                    <div class="mitarbeiter_entry_btns">\
                        <em class="mdi mdi-swap-horizontal switchCustomer"></em>\
                        <em class="mdi mdi-trash-can deleteCustomer"></em>\
                    </div>\
                </div>\
                <div class="mitarbeiter_entry_details">\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Eingereist am:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+kunde.enterState+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Telefonnummer:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(kunde.phonenumber == 0 ? "-" : kunde.phonenumber)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Rabatt:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(kunde.rabatt == 0 ? "Nein" : kunde.rabatt + "%")+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Gesperrt:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(kunde.disabled == 0 ? "Nein" : "Ja")+'</div>\
                        </div>\
                    </div>\
                    <div class="mitarbeiter_entry_row" '+(kunde.notice == "" ? "style='height: 0px; margin-top: -20px;'" : "")+'>\
                        <div class="mitarbeiter_entry_col" '+(kunde.notice == "" ? "style='display: none'" : "")+'>\
                            <div class="mitarbeiter_entry_col_header">Notiz zum Kunden:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(kunde.notice == "" ? "-" : kunde.notice)+'</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        '
        $('.mitarbeiter_content_container').append(container)
    })
    toggleLoading(false)
}