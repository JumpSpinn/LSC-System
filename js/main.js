var _currentUsername = ""
var _currentSidebarID = 0
var _currentSidebarSubMenuID = 0
var _currentUserPosition = []
var _currentPageFile = ""
var _prevPageFile = ""
var _main_ab_isLoading = false

// DEBUG VALUES
var _debug = false

$(() => {
    if(_debug){
        _currentSidebarID = 1
        _currentSidebarSubMenuID = 0
        _currentUsername = "Kane Black"

        updateAccountActivity(_currentUsername + " hat sich eingeloggt!", LOGTYPE.LOGGEDIN)
        $('#checkPassword').css('display', 'none')

        _currentUserPosition.push({id: 10, name: 'Geschäftsführer', sidebarPermissions: [], pagePermissions: []})
        $('#currentLoggedInUserPosition').html(_currentUserPosition[0].name)
        $('#currentLoggedInUser').html('Kane Black')
        initSidebar()
        $('.system_container').css('display', 'flex')
    }
})

function showPopup(popupID){
    $('.page_popup_wrapper#' + popupID).css("display", "flex").hide().fadeIn(150)
}

function closePopup(){
    $('.page_popup_wrapper').fadeOut(150)
}

function loadjscssfile(filename, filetype){
    if(_currentUsername == "") return
    if (filetype=="js"){ //if filename is a external JavaScript file
     var fileref=document.createElement('script')
     fileref.setAttribute("type","text/javascript")
     fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
     var fileref=document.createElement("link")
     fileref.setAttribute("rel", "stylesheet")
     fileref.setAttribute("type", "text/css")
     fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
     document.getElementsByTagName("head")[0].appendChild(fileref)
}

function removejscssfile(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}

function initPage(){
    if(_currentPageFile == "") return
    if(_prevPageFile == _currentPageFile) return
    removejscssfile("js/pages" + _prevPageFile + ".js", "js")
    _prevPageFile = _currentPageFile
    $('.system_page').load("/pages/"+_currentPageFile+".html", function() {
        loadjscssfile("js/pages/" + _currentPageFile + ".js", "js")
        $(document).trigger($.Event('ContentsLoadedEvent'))
    })
    checkCurrentUserState()
}

function initSidebar(){
    if(_debug){
        var _userPermissions = _currentUserPosition[0].sidebarPermissions
    } else {
        var _userPermissions = JSON.parse(_currentUserPosition.sidebarPermissions)
    }

    $('.sidebar_links').html('')
    _sidebar.forEach((sidebar) => {
        let hasSidebarPermission = _userPermissions.find(i => i.id == sidebar.sidebarID)
        if(hasSidebarPermission != null || _debug){
            if(sidebar.sidebarMenu.length > 0){
                let sidebarContainer = '\
                    <li class="sidebar '+(_currentSidebarID == sidebar.sidebarID ? 'active' : '')+'" data-sidebarid="'+sidebar.sidebarID+'">\
                        <div class="iocn_link">\
                            <div class="sidebar_elm">\
                                <em class="'+sidebar.icon+'"></em>\
                                <span class="sidebar_link_name">'+sidebar.name+'</span>\
                                <em class="mdi mdi-chevron-down"></em>\
                                <em class="mdi mdi-chevron-up"></em>\
                            </div>\
                        </div>\
                        <ul class="sidebar_sub_menu">\
                            <li>'
                            sidebar.sidebarMenu.forEach((subSidebar) => {
                                let hasSubSidebarPermission = _userPermissions.find(i => i.id == subSidebar.sidebarMenuID)
                                if(hasSubSidebarPermission != null){
                                    sidebarContainer += '<div class="sidebar_elm '+(_currentSidebarSubMenuID == subSidebar.sidebarMenuID ? 'active' : 'none')+'" data-sidebarsubid="'+subSidebar.sidebarMenuID+'">'+subSidebar.name+'</div>'
                                }
                            })
                            '\
                            </li>\
                        </ul>\
                    </li>\
                '
                $('.sidebar_links').append(sidebarContainer)
            } else {
                let sidebarContainer = '\
                    <li class="sidebar '+(_currentSidebarID == sidebar.sidebarID ? 'active' : '')+'" data-sidebarid="'+sidebar.sidebarID+'">\
                        <div class="sidebar_elm">\
                            <em class="'+sidebar.icon+'"></em>\
                            <span class="sidebar_link_name">'+sidebar.name+'</span>\
                        </div>\
                    </li>\
                '
                $('.sidebar_links').append(sidebarContainer)
            }
        }
    })

    $.ajax({
        url: "scripts/updateAccountSidebar.php",
        type: "POST",
        data: {
            currentSidebarID: _currentSidebarID,
            currentSubSidebarID: _currentSidebarSubMenuID
        }
    })

    let sidebar = _sidebar.find(s => s.sidebarID == _currentSidebarID)
    if(sidebar != null){
        let hasSidebarPermission = _userPermissions.find(i => i.id == _currentSidebarID)
        if(hasSidebarPermission != null || _debug){
            if(_currentSidebarSubMenuID == 0){
                if(sidebar.file != ""){
                    _currentPageFile = sidebar.file
                }
            } else {
                let subSidebar = sidebar.sidebarMenu.find(s => s.sidebarMenuID == _currentSidebarSubMenuID)
                if(subSidebar != null){
                    let hasSubSidebarPermission = _userPermissions.find(i => i.id == _currentSidebarSubMenuID)
                    if(hasSubSidebarPermission != null){
                        if(subSidebar.file != ""){
                            _currentPageFile = subSidebar.file
                        }
                    }
                }
            }
        }
    }
    initPage()
}