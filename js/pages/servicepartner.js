var _servicePartners = []
var _servicePartnersLoaded = false

var _customers = []
var _customersLoaded = false

var _currentEditServicePartner = null

var _currentEnteredCustomer = ""

$(() => {
    if(hasPermission(PAGE_PERMISSION_TYPES.SERVICEPARTNER_CREATE)){
        $('#create_partner').css('display', 'flex')
    }

    toggleLoading(true)
    getData_servicePartners(function(array){
        _servicePartners = JSON.parse(array)
        _servicePartnersLoaded = true
        showServicePartners()
    })

    getData_customers(function(array){
        _customers = JSON.parse(array)
        _customersLoaded = true
        showServicePartners()
    })

    $('#create_partner').click(() => {
        $('#new_partner_customerName').val('')
        $('#new_partner_contactName').val('')
        $('#new_partner_plz').val('')
        $('#new_partner_rabatt').val('')
        $('#new_partner_notice').val('')
        $('.page_popup_suggestions').html('')
        showPopup('popup_new_partner')
    })

    $('#close_new_partner').click(() => {
        closePopup()
    })

    $('#new_partner_save').click(() => {
        let customerName = $('#new_partner_customerName').val()
        let contactName = $('#new_partner_contactName').val()
        let plz = $('#new_partner_plz').val()
        let rabatt = $('#new_partner_rabatt').val()
        let notice = $('#new_partner_notice').val()
        if(customerName && contactName && plz && rabatt){
            if(isNaN(plz)){
                new GNWX_NOTIFY({ text: "PLZ darf keine Zeichen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(isNaN(rabatt)){
                new GNWX_NOTIFY({ text: "Rabatt darf keine Zeichen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(rabatt > 100){
                new GNWX_NOTIFY({ text: "Rabatt darf nicht höher als 100% sein!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(rabatt == ""){ rabatt = 0 }

            let checkCustomer = _customers.find(i => i.name.toLowerCase() == customerName.toLowerCase())
            if(checkCustomer == null){
                new GNWX_NOTIFY({ text: "Kunde existiert nicht in der Kundenkartei!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }

            $.ajax({
                url: "scripts/add/servicePartner.php",
                type: "POST",
                data: {
                    createdTimestamp: getCurrentTimestamp(),
                    lastEditTimestamp: getCurrentTimestamp(),
                    customerName: customerName,
                    contactName: contactName,
                    plz: parseInt(plz),
                    rabatt: parseInt(rabatt),
                    notice: notice.replace(/\n\r?/g, '<br />')
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_servicePartners(function(array){
                        _servicePartners = JSON.parse(array)
                        _servicePartnersLoaded = true
                        closePopup()
                        showServicePartners()
                        updateAccountActivity(_currentUsername + " hat ein neuen Servicepartner angelegt! ("+ customerName +" | "+ contactName +")", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: customerName + " wurde als neuer Servicepartner hinterlegt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Servicepartner | NEW", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.mitarbeiter_content_container').on('click', '.editpartner', function(){
        let partnerID = $(this).parent().parent().parent().data('id')
        let servicePartner = _servicePartners.find(i => i.id == partnerID)
        if(servicePartner != null){
            _currentEditServicePartner = servicePartner
            $('.page_popup_suggestions').html('')
            $('#edit_partner_customerName').val(_currentEditServicePartner.customerName)
            $('#edit_partner_contactName').val(_currentEditServicePartner.contactName)
            $('#edit_partner_plz').val(_currentEditServicePartner.plz)
            $('#edit_partner_rabatt').val((_currentEditServicePartner.rabatt == 0 ? "" : _currentEditServicePartner.rabatt))
            $('#edit_partner_notice').val(_currentEditServicePartner.notice.replaceAll("&lt;br /&gt;", "\r\n"))
            showPopup('popup_edit_partner')
        }
    })

    $('#close_edit_partner').click(() => {
        closePopup()
    })

    $('#edit_partner_save').click(() => {
        let customerName = $('#edit_partner_customerName').val()
        let contactName = $('#edit_partner_contactName').val()
        let plz = $('#edit_partner_plz').val()
        let rabatt = $('#edit_partner_rabatt').val()
        let notice = $('#edit_partner_notice').val()
        if(customerName && contactName && plz){
            if(isNaN(plz)){
                new GNWX_NOTIFY({ text: "PLZ darf keine Zeichen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(isNaN(rabatt)){
                new GNWX_NOTIFY({ text: "Rabatt darf keine Zeichen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(rabatt > 100){
                new GNWX_NOTIFY({ text: "Rabatt darf nicht höher als 100% sein!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(rabatt == ""){ rabatt = 0 }

            let checkCustomer = _customers.find(i => i.name.toLowerCase() == customerName.toLowerCase())
            if(checkCustomer == null){
                new GNWX_NOTIFY({ text: "Kunde existiert nicht in der Kundenkartei!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }

            $.ajax({
                url: "scripts/edit/servicePartner.php",
                type: "POST",
                data: {
                    id: _currentEditServicePartner.id,
                    lastEditTimestamp: getCurrentTimestamp(),
                    customerName: customerName,
                    contactName: contactName,
                    plz: parseInt(plz),
                    rabatt: parseInt(rabatt),
                    notice: notice.replace(/\n\r?/g, '<br />')
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_servicePartners(function(array){
                        _servicePartners = JSON.parse(array)
                        _servicePartnersLoaded = true
                        closePopup()
                        showServicePartners()
                        updateAccountActivity(_currentUsername + " hat ein Servicepartner bearbeitet! ("+ customerName +" | "+ contactName +")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: customerName + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Servicepartner | EDIT", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.mitarbeiter_content_container').on('click', '.deletePartner', function(){
        let partnerID = $(this).parent().parent().parent().data('id')
        let servicePartner = _servicePartners.find(i => i.id == partnerID)
        if(servicePartner != null){
            _currentEditServicePartner = servicePartner
            showPopup('popup_delete_partner')
        }
    })

    $('#close_delete_partner').click(() => {
        closePopup()
    })

    $('#delete_partner_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/servicePartner.php",
            type: "POST",
            data: {
                id: _currentEditServicePartner.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_servicePartners(function(array){
                    _servicePartners = JSON.parse(array)
                    _servicePartnersLoaded = true
                    closePopup()
                    showServicePartners()
                    updateAccountActivity(_currentUsername + " hat ein Servicepartner entfernt! ("+ _currentEditServicePartner.customerName +" | "+ _currentEditServicePartner.contactName +")", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: _currentEditServicePartner.customerName + " wurde als Servicepartner entfernt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Servicepartner | DELETE", LOGTYPE.ERROR)
            }
        })
    })

    $('#edit_partner_customerName').keyup(function(e) {
        _currentEnteredCustomer = $(this).val().toLowerCase()
        showCustomers()
    })

    $('#new_partner_customerName').keyup(function(e) {
        _currentEnteredCustomer = $(this).val().toLowerCase()
        showCustomers()
    })

    $('.page_popup_suggestions').on('click', '.changeCustomer', function(){
        let customerID = $(this).data('id')
        let customer = _customers.find(i => i.id == customerID)
        if(customer != null){
            $('#edit_partner_customerName').val(customer.name)
            $('#new_partner_customerName').val(customer.name)
            _currentEnteredCustomer = ""
            showCustomers()
        }
    })

    $('#search').on('input', function(){
        let searchValue = $(this).val().toLowerCase()
        let filter = _servicePartners.filter(f => f.customerName.toLowerCase().includes(searchValue))
        if(searchValue != ""){
            showServicePartners(filter)
        } else {
            showServicePartners(_servicePartners)
        }
    })
})

function showCustomers(){
    $('.page_popup_suggestions').html('')
    let findCustomers = _customers.filter(p => p.name.toLowerCase().includes(_currentEnteredCustomer.toLowerCase()))
    if(findCustomers.length > 0){
        $('.page_popup_suggestions').html('')
        findCustomers.forEach((customer) => {
            let container = '<div class="page_popup_suggestion changeCustomer" data-id="'+customer.id+'">'+customer.name+'</div>'
            $('.page_popup_suggestions.customerName').append(container)
        })
    }
    if(_currentEnteredCustomer == ""){
        $('.page_popup_suggestions').html('')
    }
}

function showServicePartners(array = _servicePartners){
    if(!_customersLoaded || !_servicePartnersLoaded) return
    $('.mitarbeiter_content_container').html('')

    let canEdit = hasPermission(PAGE_PERMISSION_TYPES.SERVICEPARTNER_EDIT)
    let canDelete = hasPermission(PAGE_PERMISSION_TYPES.SERVICEPARTNER_DELETE)

    array.sort((a, b) => { return a.id - b.id; })
    array.forEach((partner) => {
        let message = partner.notice.replaceAll('&lt;br /&gt;', '<br />')
        let container = '\
            <div class="mitarbeiter_entry" data-id="'+partner.id+'">\
                <div class="mitarbeiter_entry_header">\
                    <div class="mitarbeiter_entry_user">\
                        <span class="mitarbeiter_entry_user_title">'+partner.customerName+'</span>\
                        <span class="mitarbeiter_entry_user_subtitle">Erstellt von '+partner.createdMember+' am '+convertTimestamp(partner.createdTimestamp)+'</span>\
                        <span class="mitarbeiter_entry_user_lastAction">Letzte Bearbeitung von '+partner.lastEditMember+' am '+convertTimestamp(partner.lastEditTimestamp)+'</span>\
                    </div>\
                    <div class="mitarbeiter_entry_btns">\
                        <em class="mdi mdi-lead-pencil editpartner" style="display: '+(canEdit ? 'flex' : 'none')+'"></em>\
                        <em class="mdi mdi-trash-can deletePartner" style="display: '+(canDelete ? 'flex' : 'none')+'"></em>\
                    </div>\
                </div>\
                <div class="mitarbeiter_entry_details">\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Ansprechpartner:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+partner.contactName+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Wohnsitz (PLZ):</div>\
                            <div class="mitarbeiter_entry_col_desc">'+partner.plz+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Rabatt:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(partner.rabatt == 0 ? "kein Rabatt" : partner.rabatt + "%")+'</div>\
                        </div>\
                    </div>\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Abmachung:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(message == "" ? "keine Abmachung eingetragen" : message)+'</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        '
        $('.mitarbeiter_content_container').append(container)
    })
    toggleLoading(false)
}