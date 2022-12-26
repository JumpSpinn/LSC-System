var _mitarbeiter = []
var _positions = []

var _mitarbeiterLoaded = false
var _positionsLoaded = false

$(()=> {
    toggleLoading(true)

    getData_accounts(function(array){
        _mitarbeiter = JSON.parse(array)
        _mitarbeiterLoaded = true
        showMitarbeiter()
    })

    getData_positions(function(array){
        _positions = JSON.parse(array)
        _positionsLoaded = true
        showMitarbeiter()
    })

    $('#search').on('input', function(){
        let searchValue = $(this).val().toLowerCase()
        let filter = _mitarbeiter.filter(f => f.firstname.toLowerCase().includes(searchValue) || f.lastname.toLowerCase().includes(searchValue))
        if(searchValue != ""){
            showMitarbeiter(filter)
        } else {
            showMitarbeiter(_mitarbeiter)
        }
    })
})

function showMitarbeiter(array = _mitarbeiter){
    if(!_mitarbeiterLoaded || !_positionsLoaded) return
    $('.mitarbeiter_content_container').html('')
    array.sort((a, b) => { return b.positionID - a.positionID; })
    array.forEach((user) => {
        let diffTimestamp = getCurrentTimestamp() - user.memberSince
        let daysInDuty = (diffTimestamp / 86400).toFixed(0)
        let userPosition = _positions.find(p => p.id == user.positionID)
        var container = '\
            <div class="mitarbeiter_entry" data-id="'+user.id+'">\
                <div class="mitarbeiter_entry_header">\
                    <div class="mitarbeiter_entry_user">\
                        <span class="mitarbeiter_entry_user_title">'+user.firstname+' '+user.lastname+'</span>\
                        <span class="mitarbeiter_entry_user_subtitle">'+(userPosition == null ? 'Kein Rang zugeordnet!' : userPosition.name)+'</span>\
                        <span class="mitarbeiter_entry_user_lastAction">Letzte Aktivität: '+(user.lastAction == 0 ? "-" : convertTimestamp(user.lastAction))+'</span>\
                    </div>\
                    <div class="mitarbeiter_entry_btns">\
                        <em class="mdi mdi-lead-pencil edit_current_member"></em>\
                        <em class="mdi mdi-trash-can delete_current_member"></em>\
                    </div>\
                </div>\
                <div class="mitarbeiter_entry_details">\
                    <div class="mitarbeiter_entry_row">\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Eingestellt am:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+convertTimestamp(user.memberSince)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Telefonnummer:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(user.phonenumber == "" ? "-" : user.phonenumber)+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Diensttage:</div>\
                            <div class="mitarbeiter_entry_col_desc">'+(daysInDuty == 1 ? daysInDuty + " Tag" : daysInDuty + " Tage")+'</div>\
                        </div>\
                        <div class="mitarbeiter_entry_col">\
                            <div class="mitarbeiter_entry_col_header">Aktueller Status:</div>\
                            <div class="mitarbeiter_entry_col_desc mitarbeiterState_'+user.state+'">'+(user.state == "" ? getAccountStateName(0) : getAccountStateName(user.state))+'</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        '
        $('.mitarbeiter_content_container').append(container)
    })
    toggleLoading(false)
}