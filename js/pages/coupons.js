var _gutscheine = []
var _gutscheineLoaded = false
var _currentEditGutschein = null

$(() => {
    toggleLoading(true)
    getData_coupons(function(array){
        _gutscheine = JSON.parse(array)
        _gutscheineLoaded = true
        showGutscheine()
    })

    $('#create_coupon').click(() => {
        $('#new_coupon_code').val('')
        $('#new_coupon_type').val('')
        $('#new_coupon_value').val('')
        showPopup('popup_new_coupon')
    })

    $('#close_new_coupon').click(() => {
        closePopup()
    })

    $('#close_edit_coupon').click(() => {
        console.log('close')
        closePopup()
    })

    $('#close_delete_coupon').click(() => {
        closePopup()
    })

    $('#new_coupon_save').click(() => {
        let code = $('#new_coupon_code').val()
        let type = $('#new_coupon_type').val()
        let value = $('#new_coupon_value').val()
        if(code && type && value){
            if(isNaN(value)){
                new GNWX_NOTIFY({ text: "Rabatthöhe darf nur Zahlen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/add/coupon.php",
                type: "POST",
                data: {
                    code: code,
                    type: type,
                    createdTimestamp: getCurrentTimestamp(),
                    value: parseInt(value)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_coupons(function(array){
                        _gutscheine = JSON.parse(array)
                        _gutscheineLoaded = true
                        closePopup()
                        showGutscheine()
                        updateAccountActivity(_currentUsername + " hat einen neuen Gutschein erstellt", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: "Gutschein wurde erfolgreich erstellt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Gutscheine | NEW", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.mitarbeiter_content_container').on('click', '.editGutschein', function(){
        let couponID = $(this).parent().parent().parent().data('id')
        let coupon = _gutscheine.find(i => i.id == couponID)
        if(coupon != null){
            _currentEditGutschein = coupon
            $('#edit_coupon_code').val(_currentEditGutschein.code)
            $('#edit_coupon_type').val(_currentEditGutschein.type)
            $('#edit_coupon_value').val(_currentEditGutschein.value)
            showPopup('popup_edit_coupon')
        }
    })

    $('#edit_coupon_save').click(() => {
        let code = $('#edit_coupon_code').val()
        let type = $('#edit_coupon_type').val()
        let value = $('#edit_coupon_value').val()
        if(code && type && value){
            if(isNaN(value)){
                new GNWX_NOTIFY({ text: "Rabatthöhe darf nur Zahlen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            $.ajax({
                url: "scripts/edit/coupon.php",
                type: "POST",
                data: {
                    id: _currentEditGutschein.id,
                    code: code,
                    type: type,
                    value: parseInt(value)
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_coupons(function(array){
                        _gutscheine = JSON.parse(array)
                        _gutscheineLoaded = true
                        closePopup()
                        showGutscheine()
                        updateAccountActivity(_currentUsername + " hat einen Gutschein bearbeitet! (" + code + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: "Gutschein wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Gutscheine | EDIT", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('#close_delete_coupon').click(() => {
        closePopup()
    })

    $('.mitarbeiter_content_container').on('click', '.deleteGutschein', function(){
        let couponID = $(this).parent().parent().parent().data('id')
        let coupon = _gutscheine.find(i => i.id == couponID)
        if(coupon != null){
            _currentEditGutschein = coupon
            showPopup('popup_delete_coupon')
        }
    })

    $('#delete_coupon_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/coupon.php",
            type: "POST",
            data: {
                id: _currentEditGutschein.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_coupons(function(array){
                    _gutscheine = JSON.parse(array)
                    _gutscheineLoaded = true
                    closePopup()
                    showGutscheine()
                    updateAccountActivity(_currentUsername + " hat einen Gutschein gelöscht! (" + _currentEditGutschein.id + ")", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: "Gutschein wurde erfolgreich gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Gutscheine | DELETE", LOGTYPE.ERROR)
            }
        })
    })

    $('#search').on('input', function(){
        let searchValue = $(this).val().toLowerCase()
        let filter = _gutscheine.filter(f => f.code.toLowerCase().includes(searchValue))
        if(searchValue != ""){
            showGutscheine(filter)
        } else {
            showGutscheine(_gutscheine)
        }
    })
})

function showGutscheine(array = _gutscheine){
    if(!_gutscheineLoaded) return
    $('.mitarbeiter_content_container').html('')
    array.sort((a, b) => { return a.id - b.id; })
    let containers = []
    array.forEach((coupon) => {
        let container = '\
            <div class="mitarbeiter_entry" data-id="'+coupon.id+'">\
                <div class="mitarbeiter_entry_header">\
                    <div class="mitarbeiter_entry_user">\
                        <span class="mitarbeiter_entry_user_title">'+coupon.code+'</span>\
                        <span class="mitarbeiter_entry_user_subtitle">'+coupon.type+'</span>\
                        <span class="mitarbeiter_entry_user_lastAction">Erstellt von '+coupon.createdMember+' am '+convertTimestamp(coupon.createdTimestamp)+'</span>\
                    </div>\
                    <div class="mitarbeiter_entry_btns">\
                        <em class="mdi mdi-lead-pencil editGutschein"></em>\
                        <em class="mdi mdi-trash-can deleteGutschein"></em>\
                    </div>\
                </div>\
                <div class="mitarbeiter_entry_details">\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Rabatthöhe:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+coupon.value+'%</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Eingelöst für:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(coupon.redeemedCustomer == null ? "-" : coupon.redeemedCustomer)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Eingelöst von:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(coupon.redeemedMember == null ? "-" : coupon.redeemedMember)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Eingelöst am:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+ (coupon.redeemedTimestamp == 0 ? "-" : convertTimestamp(coupon.redeemedTimestamp)) +'</div>\
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