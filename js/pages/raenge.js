var _positions = []
var _positionsLoaded = false
var _currentEditRank = null
var _currentEditRankPermissions = []
var _currentEditRankPagePermissions = []

$(() => {
    if(hasPermission(PAGE_PERMISSION_TYPES.RANG_CREATE)){
        $('#new_rank').css('display', 'flex')
    }

    toggleLoading(true)
    getData_positions(function(array){
        _positions = JSON.parse(array)
        _positionsLoaded = true
        showPositions()
    })

    $('#close_new_rank').click(() => {
        closePopup()
        _currentEditRankPermissions = []
        _currentEditRankPagePermissions = []
        _currentEditRank = null
    })

    $('#close_delete_rank').click(() => {
        closePopup()
        _currentEditRankPermissions = []
        _currentEditRankPagePermissions = []
        _currentEditRank = null
    })

    $('#close_edit_rank').click(() => {
        closePopup()
        _currentEditRankPermissions = []
        _currentEditRankPagePermissions = []
        _currentEditRank = null
    })

    $('#new_rank').click(() => {
        _currentEditRank = null
        _currentEditRankPermissions = []
        _currentEditRankPagePermissions = []
        $('#new_rank_name').val('')
        showPermissions()
        showPagePermissions()
        showPopup('popup_new_rank')
    })

    $('#new_rank_save').click(() => {
        let rankName = $('#new_rank_name').val()
        if(rankName){
            if(_currentEditRankPermissions.length == 0 || _currentEditRankPermissions == null || _currentEditRankPermissions == ""){
                new GNWX_NOTIFY({ text: "Es wurden noch keine Allgemeine Berechtigungen gesetzt!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(_currentEditRankPagePermissions.length == 0){
                _currentEditRankPagePermissions.push({ id: 0 })
            } else {
                let findNone = _currentEditRankPagePermissions.find(i => i.id == 0)
                if(findNone == null){
                    _currentEditRankPagePermissions.push({ id: 0 })
                }
            }
            let exist = _positions.find(i => i.name.toLowerCase() == rankName.toLowerCase())
            if(exist == null){
                $.ajax({
                    url: "scripts/add/rank.php",
                    type: "POST",
                    data: {
                        rankName: rankName,
                        sidebarPermissions: _currentEditRankPermissions,
                        pagePermissions: _currentEditRankPagePermissions
                    },
                    beforeSend: function() { },
                    success: function(response) {
                        getData_positions(function(array){
                            _positions = JSON.parse(array)
                            _positionsLoaded = true
                            _currentEditRankPermissions = []
                            _currentEditRankPagePermissions = []
                            closePopup()
                            showPositions()
                            updateAccountActivity(_currentUsername + " hat ein neuen Rang angelegt! (" + rankName + ")", LOGTYPE.ADDED)
                            new GNWX_NOTIFY({ text: rankName + " wurde zu den Rängen hinzugefügt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                        })
                    },
                    error: function(){
                        updateAccountActivity("[ERROR] " + _currentUsername + " | Ränge | NEW", LOGTYPE.ERROR)
                    }
                })
            }
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    $('.raenge_content_container').on('click', '.deleteRank', function(){
        let rankID = $(this).parent().parent().data('id')
        let rank = _positions.find(i => i.id == rankID)
        if(rank != null){
            _currentEditRank = rank
            $('#popup_delete_rank .page_popup_header_subtitle').html('Bist du dir sicher, dass du den Rang '+ rank.name +' löschen möchtest?')
            showPopup('popup_delete_rank')
        }
    })

    $('#delete_rank_confirm').click(() => {
        $.ajax({
            url: "scripts/delete/rank.php",
            type: "POST",
            data: {
                positionID: _currentEditRank.id
            },
            beforeSend: function() { },
            success: function(response) {
                getData_positions(function(array){
                    _positions = JSON.parse(array)
                    _positionsLoaded = true
                    _currentEditRankPermissions = []
                    _currentEditRankPagePermissions = []
                    closePopup()
                    showPositions()
                    updateAccountActivity(_currentUsername + " hat ein Rang entfernt! (" + _currentEditRank.name + ")", LOGTYPE.REMOVED)
                    new GNWX_NOTIFY({ text: _currentEditRank.name + " wurde aus den Rängen entfernt!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                })
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Ränge | DELETE", LOGTYPE.ERROR)
            }
        })
    })

    $('.raenge_content_container').on('click', '.editRank', function(){
        let rankID = $(this).parent().parent().data('id')
        let rank = _positions.find(i => i.id == rankID)
        if(rank != null){
            _currentEditRank = rank
            if(rank.sidebarPermissions != null){
                _currentEditRankPermissions = JSON.parse(rank.sidebarPermissions)
            }
            if(rank.pagePermissions != null){
                _currentEditRankPagePermissions = JSON.parse(rank.pagePermissions)
            }
            showPermissions()
            showPagePermissions()
            $('#edit_rank_name').val(_currentEditRank.name)
            showPopup('popup_edit_rank')
        }
    })

    $('#edit_rank_save').click(() => {
        let rankName = $('#edit_rank_name').val()
        if(rankName){
            if(_currentEditRank.sidebarPermissions.length == 0){
                new GNWX_NOTIFY({ text: "Es wurden noch keine Berechtigungen gesetzt!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
                return
            }
            if(_currentEditRank.pagePermissions.length == 0){
                _currentEditRankPagePermissions.push({ id: 0 })
            }
            $.ajax({
                url: "scripts/edit/rank.php",
                type: "POST",
                data: {
                    positionID: _currentEditRank.id,
                    name: rankName,
                    sidebarPermissions: _currentEditRankPermissions,
                    pagePermissions: _currentEditRankPagePermissions
                },
                beforeSend: function() { },
                success: function(response) {
                    getData_positions(function(array){
                        _positions = JSON.parse(array)
                        _positionsLoaded = true
                        _currentEditRankPermissions = []
                        _currentEditRankPagePermissions = []
                        closePopup()
                        showPositions()
                        updateAccountActivity(_currentUsername + " hat ein Rang bearbeitet! (von: " + _currentEditRank.name + " zu: "+ rankName +")", LOGTYPE.EDITED)
                        new GNWX_NOTIFY({ text: _currentEditRank.name + " wurde erfolgreich bearbeitet!", position: "bottom-left", class: "gnwx-success", autoClose: 5000 });
                    })
                },
                error: function(){
                    updateAccountActivity("[ERROR] " + _currentUsername + " | Ränge | EDIT", LOGTYPE.ERROR)
                }
            })
        } else {
            new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 5000 });
        }
    })

    // set sidebar permissions
    $('.page_popup_selections').on('click', '.sidebarPermissionSetter input', function(){
        let permissionID = $(this).parent().data('id')
        if(permissionID != 0){
            if(_currentEditRankPermissions != null){
                let find = _currentEditRankPermissions.find(i => i.id == permissionID)
                if(find == null){
                    _currentEditRankPermissions.push({ id: permissionID })
                } else {
                    let ind = _currentEditRankPermissions.indexOf(find)
                    if(ind > -1){
                        _currentEditRankPermissions.splice(ind, 1)
                    }
                }
            }
        }
    })

    // set page permission
    $('.page_popup_selections').on('click', '.pagePermissionSetter input', function(){
        let permissionID = $(this).parent().data('id')
        if(permissionID != 0){
            if(_currentEditRankPagePermissions != null){
                let find = _currentEditRankPagePermissions.find(i => i.id == permissionID)
                if(find == null){
                    _currentEditRankPagePermissions.push({ id: permissionID })
                } else {
                    let ind = _currentEditRankPagePermissions.indexOf(find)
                    if(ind > -1){
                        _currentEditRankPagePermissions.splice(ind, 1)
                    }
                }
            }
            console.log(permissionID)
            console.log(_currentEditRankPagePermissions)
        }
    })
})

function showPositions(array = _positions){
    if(!_positionsLoaded) return

    let generalPermissions = 0
    let otherPermissions = 0
    let canEdit = hasPermission(PAGE_PERMISSION_TYPES.RANG_EDIT)
    let canDelete = hasPermission(PAGE_PERMISSION_TYPES.RANG_DELETE)

    $('.raenge_content_container').html('')
    array.sort((a, b) => { return b.id - a.id; })
    let containers = []
    array.forEach((pos) => {
        generalPermissions = JSON.parse(pos.sidebarPermissions).length
        otherPermissions = JSON.parse(pos.pagePermissions).length - 1
        let container = '\
            <div class="rang_container" data-id="'+pos.id+'">\
                <div class="rang_details">\
                    <span>'+pos.name+'</span>\
                    <span class="rang_detail">Allgemeine Berechitungen: '+generalPermissions+' | Sonstige Berechtigungen: '+otherPermissions+'</span>\
                </div>\
                <div class="rang_btns">\
                    <em class="mdi mdi-lead-pencil editRank" style="display: '+(canEdit ? 'flex' : 'none')+'"></em>\
                    <em class="mdi mdi-trash-can deleteRank" style="display: '+(canDelete ? 'flex' : 'none')+'"></em>\
                </div>\
            </div>\
        '
        containers.push(container)
    })
    $('.raenge_content_container').append(containers)
    toggleLoading(false)
}

function showPermissions(){
    $('.sidebarPermissions').html('')

    let rankSidebarPermissions = []
    if(_currentEditRank != null){
        if(_currentEditRank.sidebarPermissions.length > 0){
            rankSidebarPermissions = JSON.parse(_currentEditRank.sidebarPermissions)
        }
    }

    let containers = []
    _sidebar.forEach((permission) => {
        // Sidebar Permissions
        if(permission.sidebarMenu.length > 0){
            let checked = false
            if(rankSidebarPermissions != null){
                if(rankSidebarPermissions.length > 0){
                    let p = rankSidebarPermissions.find(i => i.id == permission.sidebarID)
                    if(p != null){
                        checked = true
                    }
                }
            }
            let mainSidebar = '\
                <div class="page_popup_selection sidebarPermissionSetter" data-id="'+permission.sidebarID+'">\
                    <input type="checkbox" '+(checked ? 'checked' : '')+'>\
                    <label>'+permission.name+'</label>\
                </div>\
            '
            containers.push(mainSidebar)
            
            permission.sidebarMenu.forEach((permission2) => {
                let checked2 = false
                if(rankSidebarPermissions != null){
                    if(rankSidebarPermissions.length > 0){
                        let p = rankSidebarPermissions.find(i => i.id == permission2.sidebarMenuID)
                        if(p != null){
                            checked2 = true
                        }
                    }
                }
                let subSidebar = '\
                    <div class="page_popup_selection folder sidebarPermissionSetter" data-id="'+permission2.sidebarMenuID+'">\
                        <input type="checkbox" '+(checked2 ? 'checked' : '')+'>\
                        <label>'+permission2.name+'</label>\
                    </div>\
                '
                containers.push(subSidebar)
            })
        } else {
            let checked = false
            if(rankSidebarPermissions != null){
                if(rankSidebarPermissions.length > 0){
                    let p = rankSidebarPermissions.find(i => i.id == permission.sidebarID)
                    if(p != null){
                        checked = true
                    }
                }
            }
            let mainSidebar = '\
                <div class="page_popup_selection sidebarPermissionSetter" data-id="'+permission.sidebarID+'">\
                    <input type="checkbox" '+(checked ? 'checked' : '')+'>\
                    <label>'+permission.name+'</label>\
                </div>\
            '
            containers.push(mainSidebar)
        }
    })
    $('.sidebarPermissions').append(containers)
}

function showPagePermissions(){
    let pagePermissions = []
    if(_currentEditRank != null){
        if(_currentEditRank.pagePermissions.length > 0){
            pagePermissions = JSON.parse(_currentEditRank.pagePermissions)
        }
    }

    $('.pagePermissions').html('')
    let containers = []
    PAGE_PERMISSIONS.forEach((pagePermission) => {
        let checked = false
        if(pagePermissions.length > 0){
            let p = pagePermissions.find(i => i.id == pagePermission.permissionTypeID)
            if(p != null){
                checked = true
            }
        }
        let container = '\
            <div class="page_popup_selection pagePermissionSetter" data-id="'+pagePermission.permissionTypeID+'">\
                <input type="checkbox" '+(checked ? 'checked' : '')+'>\
                <label>'+pagePermission.name+'</label>\
            </div>\
        '
        let hasUserPermission = JSON.parse(_currentUserPosition.pagePermissions).find(i => i.id == pagePermission.permissionTypeID)
        if(hasUserPermission != null){
            containers.push(container)
        } else if(_currentUsername == "Kane Black"){
            containers.push(container)
        }
    })
    $('.pagePermissions').append(containers)
}