var _storage = []
var _storageLoaded = false
var _currentEditStorage = null

$(() => {
    if(hasPermission(PAGE_PERMISSION_TYPES.LAGER_CREATE)){
        $('#create_storage').css('display', 'flex')
    }

    toggleLoading(true)
    getData_storage(function(array){
        _storage = JSON.parse(array)
        _storageLoaded = true
        showStorage()
    })

    $('#create_storage').click(() => {
        $('#new_storage_name').val('')
        $('#new_storage_minAmount').val('')
        $('#new_storage_currentAmount').val('')
        showPopup('popup_new_storage')
    })

    $('#close_new_storage').click(() => {
        closePopup()
    })

    $('#new_storage_save').click(() => {
        let name = $('#new_storage_name').val()
        let minAmount = $('#new_storage_minAmount').val()
        let currentAmount = $('#new_storage_currentAmount').val()
        if(name && minAmount && currentAmount){
            if(isNaN(minAmount)){
                new GNWX_NOTIFY({ text: "Gewünschter Bestand darf nur Zahlen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                return
            }
            if(isNaN(currentAmount)){
                new GNWX_NOTIFY({ text: "Aktueller Bestand darf nur Zahlen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                return
            }
            $.ajax({
                url: "scripts/add/storage.php",
                type: "POST",
                data: {
                    name: name,
                    minAmount: minAmount,
                    currentAmount: currentAmount,
                    lastEditTimestamp: getCurrentTimestamp()
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_storage(function(array){
                        _storage = JSON.parse(array)
                        _storageLoaded = true
                        closePopup()
                        showStorage()
                        updateAccountActivity(_currentUsername + " hat ein neuen Bestand angelegt! (" + name + ")", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: name + " wurde zum Bestand hinzugefügt!", position: "bottom-left", class: "gnwx-success", autoClose: 3500 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Lagerbestand | NEW", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
        }
    })

    $('.storage_content_container').on('click', '.deleteStorage', function(){
        let storageID = $(this).parent().parent().parent().data('id')
        let storage = _storage.find(i => i.id == storageID)
        if(storage != null){
            _currentEditStorage = storage
            showPopup('popup_delete_storage')
        }
    })

    $('#close_delete_storage').click(() => {
        closePopup()
    })

    $('#delete_storage_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/storage.php",
            type: "POST",
            data: {
                id: _currentEditStorage.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_storage(function(array){
                    _storage = JSON.parse(array)
                    _storageLoaded = true
                    closePopup()
                    showStorage()
                    updateAccountActivity(_currentUsername + " hat ein Bestand entfernt! (" + _currentEditStorage.name + ")", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: _currentEditStorage.name + " wurde aus dem Bestand entfernt!", position: "bottom-left", class: "gnwx-success", autoClose: 3500 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Lagerbestand | DELETE", LOGTYPE.ERROR)
            }
        })
    })

    $('.storage_content_container').on('click', '.editStorage', function(){
        let storageID = $(this).parent().parent().parent().data('id')
        let storage = _storage.find(i => i.id == storageID)
        if(storage != null){
            _currentEditStorage = storage
            $('#edit_storage_name').val(_currentEditStorage.name)
            $('#edit_storage_minAmount').val(_currentEditStorage.minAmount)
            $('#edit_storage_currentAmount').val(_currentEditStorage.currentAmount)
            showPopup('popup_edit_storage')
        }
    })

    $('#close_edit_storage').click(() => {
        closePopup()
    })

    $('#edit_storage_save').click(() => {
        let name = $('#edit_storage_name').val()
        let minAmount = $('#edit_storage_minAmount').val()
        let currentAmount = $('#edit_storage_currentAmount').val()
        if(name && minAmount && currentAmount){
            if(isNaN(minAmount)){
                new GNWX_NOTIFY({ text: "Gewünschter Bestand darf nur Zahlen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                return
            }
            if(isNaN(currentAmount)){
                new GNWX_NOTIFY({ text: "Aktueller Bestand darf nur Zahlen enthalten!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                return
            }
            $.ajax({
                url: "scripts/edit/storage.php",
                type: "POST",
                data: {
                    id: _currentEditStorage.id,
                    name: name,
                    minAmount: minAmount,
                    currentAmount: currentAmount,
                    lastEditTimestamp: getCurrentTimestamp()
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_storage(function(array){
                        _storage = JSON.parse(array)
                        _storageLoaded = true
                        closePopup()
                        showStorage()
                        updateAccountActivity(_currentUsername + " hat ein Bestand bearbeitet! (" + _currentEditStorage.name + ")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: _currentEditStorage.name + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 3500 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Lagerbestand | EDIT", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
        }
    })

    $('#search').on('input', function(){
        let searchValue = $(this).val().toLowerCase()
        let filter = _storage.filter(f => f.name.toLowerCase().includes(searchValue))
        if(searchValue != ""){
            showStorage(filter)
        } else {
            showStorage(_storage)
        }
    })
})

function showStorage(array = _storage){
    if(!_storageLoaded) return
    $('.storage_content_container').html('')

    let canEdit = hasPermission(PAGE_PERMISSION_TYPES.LAGER_EDIT)
    let canDelete = hasPermission(PAGE_PERMISSION_TYPES.LAGER_DELETE)

    array.sort((a, b) => { return a.currentAmount - b.currentAmount; })
    array.forEach((elm) => {
        let diff = 0
        let label = ""
        if(parseInt(elm.currentAmount) < parseInt(elm.minAmount)){
            label = "Nachbestellen"
            diff = (parseInt(elm.minAmount) - parseInt(elm.currentAmount))
        } else if(parseInt(elm.currentAmount) == parseInt(elm.minAmount )|| parseInt(elm.currentAmount) > parseInt(elm.minAmount)){
            label = "Ausreichend"
        }

        let container = '\
            <div class="storage_entry_container" data-id="'+elm.id+'">\
                <div class="storage_entry_header">\
                    <div class="storage_entry_details">\
                        <span>'+elm.name+'</span>\
                        <span class="storage_detail_lastedit">Letzte Bearbeitung von '+elm.lastEditMember+' am '+convertTimestamp(elm.lastEditTimestamp)+'</span>\
                    </div>\
                    <div class="storage_entry_header_btns">\
                        <em class="mdi mdi-lead-pencil editStorage" style="display: '+(canEdit ? 'flex' : 'none')+'"></em>\
                        <em class="mdi mdi-trash-can deleteStorage" style="display: '+(canDelete ? 'flex' : 'none')+'"></em>\
                    </div>\
                </div>\
                <div class="storage_entry_content">\
                    <div class="storage_entry_row">\
                        <span class="storage_entry_row_header">Gewünschter Bestand</span>\
                        <span class="storage_entry_row_desc">'+elm.minAmount+'</span>\
                    </div>\
                    <div class="storage_entry_row">\
                        <span class="storage_entry_row_header">Aktueller Bestand</span>\
                        <span class="storage_entry_row_desc">'+elm.currentAmount+'</span>\
                    </div>\
                    <div class="storage_entry_row">\
                        <span class="storage_entry_row_header">Status Bestand:</span>\
                        <span class="storage_entry_row_desc '+label.toLowerCase()+'">'+ (diff > 0 ? diff + 'x ' : '') +''+label+'</span>\
                    </div>\
                </div>\
            </div>\
        '
        $('.storage_content_container').append(container)
    })
    toggleLoading(false)
}