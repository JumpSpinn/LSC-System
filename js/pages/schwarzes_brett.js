var _messages = []
var _messagesLoaded = false
var _currentEditMessage = null

var MESSAGE_STATES = [
    {
        id: 0,
        name: "Allgemein"
    },
    {
        id: 1,
        name: "Bewerber"
    },
    {
        id: 2,
        name: "Besprechung"
    },
    {
        id: 3,
        name: "Wichtig"
    }
]

var _currentEnteredState = ""
var _messageStateID = 0

$(() => {
    if(hasPermission(PAGE_PERMISSION_TYPES.SCHWARZESBRETT_CREATE)){
        $('#create_message').css('display', 'flex')
    }

    toggleLoading(true)
    getData_messages(function(array){
        _messages = JSON.parse(array)
        _messagesLoaded = true
        showMessages()
    })

    $('#create_message').click(() => {
        $('#new_message_title').val('')
        $('#new_message_msg').val('')
        $('#new_message_state').val('')
        showPopup('popup_new_message')
    })

    $('#close_new_message').click(() => {
        closePopup()
    })

    $('#close_edit_message').click(() => {
        closePopup()
    })

    $('#close_delete_message').click(() => {
        closePopup()
    })

    $('#new_message_save').click(() => {
        let title = $('#new_message_title').val()
        let message = $('#new_message_msg').val()
        let state = $('#new_message_state').val()
        if(message && title){
            if(state != ""){
                let checkState = MESSAGE_STATES.find(i => i.name.toLowerCase() == state.toLowerCase())
                if(checkState == null){
                    new GNWX_NOTIFY({ text: "Gebe bitte eine gültige Wichtigkeit an (Allgemein, Besprechung, Wichtig)", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                    return
                }
            }
            $.ajax({
                url: "scripts/add/message.php",
                type: "POST",
                data: {
                    title: title,
                    createdTimestamp: getCurrentTimestamp(),
                    lastEditTimestamp: getCurrentTimestamp(),
                    message: message.replace(/\n\r?/g, '<br />'),
                    state: (state == "" ? 0 : _messageStateID) 
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_messages(function(array){
                        _messages = JSON.parse(array)
                        _messagesLoaded = true
                        closePopup()
                        showMessages()
                        updateAccountActivity(_currentUsername + " hat eine neue Mitteilung erstellt!", LOGTYPE.ADDED)
                        new GNWX_NOTIFY({ text: "Mitteilung wurde erfolgreich erstellt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Schwarzes Brett | NEW", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.schwarzes_brett_content_container').on('click', '.editMessage', function(){
        let messageID = $(this).parent().parent().parent().data('id')
        let message = _messages.find(i => i.id == messageID)
        if(message != null){
            _currentEditMessage = message

            // Convert Title for correct view
            let rawTitle = _currentEditMessage.title
            let convertedTitle = rawTitle.replaceAll("&amp;", "&")
            $('#edit_message_title').val(convertedTitle)

            // Convert Message for correct view
            let rawMessage = _currentEditMessage.message
            let convertedMessage = rawMessage.replaceAll("&lt;br /&gt;", "\r\n").replaceAll("&amp;", "&").replaceAll("&quot;", "'")
            $('#edit_message_msg').val(convertedMessage)

            let state = MESSAGE_STATES.find(i => i.id == _currentEditMessage.state)
            $('#edit_message_state').val(state.name)
            showPopup('popup_edit_message')
        }
    })

    $('#edit_message_save').click(() => {
        let title = $('#edit_message_title').val()
        let message = $('#edit_message_msg').val()
        let state = $('#edit_message_state').val()
        if(message && title){
            if(state != ""){
                let checkState = MESSAGE_STATES.find(i => i.name.toLowerCase() == state.toLowerCase())
                if(checkState == null){
                    new GNWX_NOTIFY({ text: "Gebe bitte eine gültige Wichtigkeit an (Allgemein, Besprechung, Wichtig)", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                    return
                } else {
                    _messageStateID = checkState.id
                }
            }
            $.ajax({
                url: "scripts/edit/message.php",
                type: "POST",
                data: {
                    id: _currentEditMessage.id,
                    title: title,
                    lastEditTimestamp: getCurrentTimestamp(),
                    message: message.replace(/\n\r?/g, '<br />'),
                    state: (state == "" ? 0 : _messageStateID) 
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_messages(function(array){
                        _messages = JSON.parse(array)
                        _messagesLoaded = true
                        closePopup()
                        showMessages()
                        updateAccountActivity(_currentUsername + " hat eine Mitteilung bearbeitet (ID: " + _currentEditMessage.id + ")!", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: "Mitteilung wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Schwarzes Brett | EDIT", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.schwarzes_brett_content_container').on('click', '.deleteMessage', function(){
        let messageID = $(this).parent().parent().parent().data('id')
        let message = _messages.find(i => i.id == messageID)
        if(message != null){
            _currentEditMessage = message
            showPopup('popup_delete_message')
        }
    })

    $('#delete_message_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/message.php",
            type: "POST",
            data: {
                id: _currentEditMessage.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_messages(function(array){
                    _messages = JSON.parse(array)
                    _messagesLoaded = true
                    closePopup()
                    showMessages()
                    updateAccountActivity(_currentUsername + " hat eine Mitteilung gelöscht (ID: " + _currentEditMessage.id + ")!", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: "Mitteilung wurde gelöscht!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Schwarzes Brett | DELETE", LOGTYPE.ERROR)
            }
        })
    })

    $('#new_message_state').keyup(function(e) {
        _currentEnteredState = $(this).val().toLowerCase()
        showStates()
    })

    $('#edit_message_state').keyup(function(e) {
        _currentEnteredState = $(this).val().toLowerCase()
        showStates()
    })

    $('.page_popup_suggestions').on('click', '.changeMessageState', function(){
        let stateID = $(this).data('id')
        let state = MESSAGE_STATES.find(i => i.id == stateID)
        if(state != null){
            _messageStateID = state.id
            $('#new_message_state').val(state.name)
            $('#edit_message_state').val(state.name)
            _currentEnteredState = ""
            showStates()
        }
    })
})

function showMessages(array = _messages){
    if(!_messagesLoaded) return

    let canEdit = hasPermission(PAGE_PERMISSION_TYPES.SCHWARZESBRETT_EDIT)
    let canDelete = hasPermission(PAGE_PERMISSION_TYPES.SCHWARZESBRETT_DELETE)

    $('.schwarzes_brett_content_container').html('')
    array.sort((a, b) => { return b.lastEditTimestamp - a.lastEditTimestamp; })
    array.sort((a, b) => { return b.state - a.state; })
    array.forEach((msg) => {
        let state = MESSAGE_STATES.find(i => i.id == msg.state)
        let message = msg.message.replaceAll('&lt;br /&gt;', '<br />')
        let container = '\
            <div class="schwarzes_brett_entry_container" data-id="'+msg.id+'">\
                <div class="schwarzes_brett_header">\
                    <div class="schwarzes_brett_header_details">\
                        <span class="schwarzes_brett_header_title">'+msg.title+'<p class="messageState_'+msg.state+'">'+state.name+'</p></span>\
                        <span class="schwarzes_brett_header_subtitle">Erstellt von '+msg.createdMember+' am '+convertTimestamp(msg.createdTimestamp)+'</span>\
                        <span class="schwarzes_brett_header_subtitle">Letzte Bearbeitung von '+msg.lastEditMember+' am '+convertTimestamp(msg.lastEditTimestamp)+'</span>\
                    </div>\
                    <div class="schwarzes_brett_btns">\
                        <em class="mdi mdi-lead-pencil editMessage" style="display: '+(canEdit ? 'flex' : 'none')+'"></em>\
                        <em class="mdi mdi-trash-can deleteMessage" style="display: '+(canDelete ? 'flex' : 'none')+'"></em>\
                    </div>\
                </div>\
                <div class="schwarzes_brett_content">'+message+'</div>\
            </div>\
        '
        $('.schwarzes_brett_content_container').append(container)
    })
    toggleLoading(false)

    $('.schwarzes_brett_content').each(function(){
        var str = $(this).html()
        var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\-.]*(\?\S+)?)?)?)/ig
        var replaced_text = str.replace(regex, "<a href='$1' target='_blank' class='schwarzes_brett_content_link'>$1</a>")
        $(this).html(replaced_text)
    })
}

function showStates(){
    $('.page_popup_suggestions').html('')
    let findStates = MESSAGE_STATES.filter(p => p.name.toLowerCase().includes(_currentEnteredState.toLowerCase()))
    if(findStates.length > 0){
        $('.page_popup_suggestions').html('')
        findStates.forEach((state) => {
            let container = '<div class="page_popup_suggestion changeMessageState" data-id="'+state.id+'">'+state.name+'</div>'
            $('.page_popup_suggestions.messageStates').append(container)
        })
    }
    if(_currentEnteredState == ""){
        $('.page_popup_suggestions').html('')
    }
}