var _sidebar = [
    {
        sidebarID: 1,
        name: "Schwarzes Brett",
        icon: "mdi mdi-human-male-board",
        file: "schwarzes_brett",
        sidebarMenu: []
    },
    {
        sidebarID: 2,
        name: "Verwaltung",
        icon: "mdi mdi-cog",
        file: "",
        sidebarMenu: [
            {
                sidebarMenuID: 21,
                name: "Buchhaltungsdaten",
                file: "data_bh",
            },
            {
                sidebarMenuID: 22,
                name: "Mitarbeiter",
                file: "mitarbeiter",
            },
            {
                sidebarMenuID: 23,
                name: "Ränge",
                file: "raenge"
            },
            {
                sidebarMenuID: 24,
                name: "Rechnungen",
                file: "create_bill"
            },
            {
                sidebarMenuID: 25,
                name: "Gutscheine",
                file: "coupons"
            },
            {
                sidebarMenuID: 26,
                name: "Kundenkartei",
                file: "customers"
            },
            {
                sidebarMenuID: 27,
                name: "Aktivitäten",
                file: "activityLogs"
            },
        ]
    },
    {
        sidebarID: 3,
        name: "Allgemein",
        icon: "mdi mdi-view-dashboard",
        file: "",
        sidebarMenu: [
            {
                sidebarMenuID: 34,
                name: "Mitarbeiter",
                file: "mitarbeiter_public",
            },{
                sidebarMenuID: 31,
                name: "Fuhrparkmanagement",
                file: "fuhrpark",
            },
            {
                sidebarMenuID: 32,
                name: "Lagerbestand",
                file: "lagerbestand",
            },
            {
                sidebarMenuID: 33,
                name: "Servicepartner",
                file: "servicepartner",
            }
        ]
    },
    {
        sidebarID: 4,
        name: "Hauptsystem",
        icon: "mdi mdi-calculator",
        file: "",
        sidebarMenu: [
            {
                sidebarMenuID: 42,
                name: "Auftragsblatt",
                file: "main_ab",
            },
            {
                sidebarMenuID: 43,
                name: "Buchhaltung",
                file: "main_bh",
            },
            {
                sidebarMenuID: 44,
                name: "Fahrzeugsuche",
                file: "vehicle_search",
            }
        ]
    },
    {
        sidebarID: 5,
        name: "Ausbildungssystem",
        icon: "mdi mdi-school",
        file: "",
        sidebarMenu: [
            {
                sidebarMenuID: 51,
                name: "Auftragsblatt - Ausbildung",
                file: "azubi_ab",
            },
            {
                sidebarMenuID: 52,
                name: "Buchhaltung - Ausbildung",
                file: "azubi_bh",
            },
            {
                sidebarMenuID: 53,
                name: "Kundenkartei - Ausbildung",
                file: "azubi_customers",
            }
        ]
    }
]

$(() => {
    $('.sidebar_elements').on('click', '.sidebar', function(){
        if(_main_ab_isLoading) return
        let sidebarID = $(this).data('sidebarid')
        if(_currentSidebarID == sidebarID) return
        _currentSidebarID = sidebarID

        let sidebar2 = _sidebar.find(s => s.sidebarID == sidebarID)
        if(sidebar2 != null){
            let subSidebar = sidebar2.sidebarMenu.find(s => s.file == _currentPageFile)
            if(subSidebar != null){
                _currentSidebarSubMenuID = subSidebar.sidebarMenuID
            }
        }
        initSidebar()

        $.ajax({
            url: "scripts/updateAccountSidebar.php",
            type: "POST",
            data: {
                currentSidebarID: _currentSidebarID,
                currentSubSidebarID: _currentSidebarSubMenuID
            },
            beforeSend: function() { },
            success: function(response) { }
        })

        let sidebar = _sidebar.find(s => s.sidebarID == _currentSidebarID)
        if(sidebar != null){
            if(_currentSidebarSubMenuID == 0){
                if(sidebar.file != ""){
                    _currentPageFile = sidebar.file
                }
            } else {
                let subSidebar = sidebar.sidebarMenu.find(s => s.sidebarMenuID == _currentSidebarSubMenuID)
                if(subSidebar != null){
                    if(subSidebar.file != ""){
                        _currentPageFile = subSidebar.file
                    }
                }
            }
        }

        if(_currentPageFile == "") return
        if(_prevPageFile == _currentPageFile) return
        removejscssfile("js/pages" + _prevPageFile + ".js", "js")
        _prevPageFile = _currentPageFile
        $('.system_page').load("/pages/"+_currentPageFile+".html", function() {
            loadjscssfile("js/pages/" + _currentPageFile + ".js", "js")
            $(document).trigger($.Event('ContentsLoadedEvent'))
        })
        checkCurrentUserState()
    })

    $('.sidebar_elements').on('click', '.sidebar .sidebar_elm', function(){
        if(_main_ab_isLoading) return
        let subSidebarID = $(this).data('sidebarsubid')
        if(subSidebarID != undefined){
            if(_currentSidebarSubMenuID == subSidebarID) return
            _currentSidebarSubMenuID = subSidebarID
            initSidebar()

            $.ajax({
                url: "scripts/updateAccountSidebar.php",
                type: "POST",
                data: {
                    currentSidebarID: _currentSidebarID,
                    currentSubSidebarID: _currentSidebarSubMenuID
                },
                beforeSend: function() { },
                success: function(response) { }
            })

            let sidebar = _sidebar.find(s => s.sidebarID == _currentSidebarID)
            if(sidebar != null){
                if(_currentSidebarSubMenuID == 0){
                    if(sidebar.file != ""){
                        _currentPageFile = sidebar.file
                    }
                } else {
                    let subSidebar = sidebar.sidebarMenu.find(s => s.sidebarMenuID == _currentSidebarSubMenuID)
                    if(subSidebar != null){
                        if(subSidebar.file != ""){
                            _currentPageFile = subSidebar.file
                        }
                    }
                }
            }

            if(_currentPageFile == "") return
            if(_prevPageFile == _currentPageFile) return
            removejscssfile("js/pages" + _prevPageFile + ".js", "js")
            _prevPageFile = _currentPageFile
            $('.system_page').load("/pages/"+_currentPageFile+".html", function() {
                loadjscssfile("js/pages/" + _currentPageFile + ".js", "js")
                $(document).trigger($.Event('ContentsLoadedEvent'))
            })
            checkCurrentUserState()
        } else {
            _currentSidebarSubMenuID = 0
        }
    })
})