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

    $('.mitarbeiter_content_container').on('click', '.editCustomer', function(){
        let customerID = $(this).parent().parent().parent().data('id')
        let customer = _kunden.find(i => i.id == customerID)
        if(customer != null){
            _currentEditKunde = customer
            $('#edit_customer_name').val(_currentEditKunde.name)
            $('#edit_customer_phonenumber').val(_currentEditKunde.phonenumber)
            $('#edit_customer_rabatt').val(_currentEditKunde.rabatt)
            $('#edit_customer_notice').val(_currentEditKunde.notice)
            $('#edit_customer_disabled').val(_currentEditKunde.disabled)
            $('#edit_customer_isState').val(_currentEditKunde.isState)
            let dateSplit = _currentEditKunde.enterState.split('.')
            $('#edit_customer_enterState').val(dateSplit[2] + "-" + dateSplit[1] + "-" + dateSplit[0])
            showPopup('popup_edit_customer')
        }
    })

    $('.mitarbeiter_content_container').on('click', '.deleteCustomer', function(){
        let customerID = $(this).parent().parent().parent().data('id')
        let customer = _kunden.find(i => i.id == customerID)
        if(customer != null){
            _currentEditKunde = customer
            showPopup('popup_delete_customer')
        }
    })

    $('#close_edit_customer').click(() => {
        closePopup()
    })

    $('#close_delete_customer').click(() => {
        closePopup()
    })

    $('#close_new_customer').click(() => {
        closePopup()
    })

    $('#edit_customer_save').click(() => {
        let name = $('#edit_customer_name').val()
        let enterState = $('#edit_customer_enterState').val()
        let phonenumber = $('#edit_customer_phonenumber').val()
        let rabatt = $('#edit_customer_rabatt').val()
        let notice = $('#edit_customer_notice').val()
        let isState = $('#edit_customer_isState').val()
        let disabled = $('#edit_customer_disabled').val()
        if(name && enterState && rabatt){
            if(isNaN(rabatt)){
                new GNWX_NOTIFY({ text: "Rabatt darf nur Zahlen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(rabatt > 100){
                new GNWX_NOTIFY({ text: "Rabatt darf nicht höher als 100% sein!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(isNaN(phonenumber)){
                new GNWX_NOTIFY({ text: "Telefonnummer darf nur Zahlen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/edit/customer.php",
                type: "POST",
                data: {
                    id: _currentEditKunde.id,
                    name: name,
                    enterState: translateDate(enterState),
                    phonenumber: parseInt(phonenumber),
                    rabatt: parseInt(rabatt),
                    notice: notice,
                    disabled: parseInt(disabled),
                    isState: isState
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_customers(function(array){
                        _kunden = JSON.parse(array)
                        _kundenLoaded = true
                        closePopup()
                        showKunden()
                        updateAccountActivity(_currentUsername + " hat einen Kunden bearbeitet! (" + _currentEditKunde.name + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: _currentEditKunde.name + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Kundenkartei | EDIT", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
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
                    new GNWX_NOTIFY({ text: _currentEditKunde.name + " wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Kundenkartei | DELETE", LOGTYPE.ERROR)
            }
        })
    })

    $('#create_customer').click(() => {
        $('#new_customer_name').val('')
        $('#new_customer_enterState').val('')
        $('#new_customer_phonenumber').val('')
        $('#new_customer_rabatt').val('')
        $('#new_customer_notice').val('')
        $('#new_customer_isState').val('')
        $('#new_customer_disabled').val('')
        showPopup('popup_new_customer')
    })

    $('#new_customer_save').click(() => {
        let name = $('#new_customer_name').val()
        let enterState = $('#new_customer_enterState').val()
        let phonenumber = $('#new_customer_phonenumber').val()
        let rabatt = $('#new_customer_rabatt').val()
        let notice = $('#new_customer_notice').val()
        let isState = $('#new_customer_isState').val()
        let disabled = $('#new_customer_disabled').val()

        ADD_NEW_CUSTOMER(
            name,
            translateDate(enterState),
            (phonenumber == "" ? 0 : phonenumber),
            (rabatt == "" ? 0 : rabatt),
            notice,
            (disabled == "" ? 0 : disabled),
            isState
        )
    })

    $('#search').on('input', function(){
        let searchValue = $(this).val().toLowerCase()
        let filter = _kunden.filter(f => f.name.toLowerCase().includes(searchValue))
        if(searchValue != ""){
            showKunden(filter)
        } else {
            showKunden(_kunden)
        }
    })
})

function showKunden(array = _kunden){
    if(!_kundenLoaded) return
    $('.mitarbeiter_content_container').html('')
    array.sort((a, b) => { return a.number - b.number; })
    let filteredArray = array.filter(i => i.syncedTo == CUSTOMERS_SYNCEDTO.MAIN)
    let containers = []
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
                        <em class="mdi mdi-lead-pencil editCustomer"></em>\
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
                            <div class="mitarbeiter_entry_col_header">Staatlich:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(kunde.isState == 0 ? "Nein" : "Ja")+'</div>\
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
        containers.push(container)
    })
    $('.mitarbeiter_content_container').append(containers)
    toggleLoading(false)
}