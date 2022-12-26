// NEUEN KUNDEN ANLEGEN
function ADD_NEW_CUSTOMER(name, enterState, phonenumber, rabatt, notice, disabled, isState, syncedTo = 0){
    if(name && enterState){
        if(phonenumber != ""){
            if(isNaN(phonenumber)){
                new GNWX_NOTIFY({ text: "Telefonnummer darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                return
            }
        }
        if(rabatt != ""){
            if(isNaN(rabatt)){
                new GNWX_NOTIFY({ text: "Rabatt darf nur aus Zahlen bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                return
            }
            if(rabatt > 100){
                new GNWX_NOTIFY({ text: "Rabatt darf nicht höher als 100% sein!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                return
            }
        }
        if(disabled != ""){
            if(isNaN(disabled)){
                new GNWX_NOTIFY({ text: "Sperrstatus für den Kunden darf nur 0 oder 1 bestehen!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                return
            }
        }

        $.ajax({
            url: "scripts/checkCustomerName.php",
            type: "POST",
            data: {
                name: name
            },
            beforeSend: function() { },
            success: function(response) {
                if(response == 2){
                    new GNWX_NOTIFY({ text: "Unbekannter Fehler! #305", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                    return
                }
                if(response == 0){ // Kunde existiert bereits
                    new GNWX_NOTIFY({ text: "Kunde existiert bereits in der Kundenkartei!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
                } else { // Kunde wird in die Kundenkartei aufgenommen
                    var customerNumber = 0
                    GET_LATEST_CUSTOMER(function(array){
                        var latestCustomer = JSON.parse(array)
                        if(latestCustomer[0] == undefined){
                            customerNumber = 1000
                        } else {
                            var latestCustomerNumber = parseInt(latestCustomer[0].number)
                            customerNumber = latestCustomerNumber += 1
                        }

                        $.ajax({
                            url: "scripts/add/customer.php",
                            type: "POST",
                            data: {
                                name: name,
                                number: customerNumber,
                                createdTimestamp: getCurrentTimestamp(),
                                enterState: enterState,
                                phonenumber: phonenumber,
                                rabatt: rabatt,
                                notice: notice,
                                disabled: disabled,
                                syncedTo: parseInt(syncedTo),
                                isState: isState
                            },
                            beforeSend: function() { },
                            success: function(response) {
                                if(_currentPageFile == "customers"){
                                    getData_customers(function(array){
                                        _kunden = JSON.parse(array)
                                        _kundenLoaded = true
                                        closePopup()
                                        showKunden()
                                    })
                                    // success message
                                    updateAccountActivity(_currentUsername + " hat einen neuen Kunden ("+name+") angelegt (Kundenkartei)!", LOGTYPE.ADDED)
                                    new GNWX_NOTIFY({ text: name + " wurde erfolgreich in die Kundenkartei eingetragen!", position: "bottom-left", class: "gnwx-success", autoClose: 3500 });
                                }
                                if(_currentPageFile == "main_ab"){
                                    $.ajax({
                                        url: "scripts/searchCustomer_name.php",
                                        type: "POST",
                                        data: {
                                            name: _searchedCustomerName
                                        },
                                        beforeSend: function() { switchState(STATES.LOADING) },
                                        success: function(response) {
                                            if(response == 1){
                                                switchState(STATES.CANTFIND_WANTTOADD)
                                            } else {
                                                let split = response.split('_')
                                                _currentCustomerName = split[0]
                                                _currentCustomerNumber = parseInt(split[1])
                                                _currentCustomerRabatt = parseInt(split[2])
                                                _currentCustomerEnterState = split[3]
                                                if(split[4] == 1){
                                                    switchState(STATES.SERACH_CUSTOMER)
                                                    new GNWX_NOTIFY({ text: _currentCustomerName + " ist bei uns im System gesperrt & wird nicht mehr bearbeitet!", position: "bottom-left", class: "gnwx-danger", autoClose: 7500 });
                                                } else {
                                                    switchState(STATES.AUFTRAGSBLATT)
                                                    // success message
                                                    updateAccountActivity(_currentUsername + " hat einen neuen Kunden ("+name+") angelegt (Kundenkartei)!", LOGTYPE.ADDED)
                                                    new GNWX_NOTIFY({ text: name + " wurde erfolgreich in die Kundenkartei eingetragen!", position: "bottom-left", class: "gnwx-success", autoClose: 3500 });
                                                }
                                            }
                                        },
                                        error: function(){
                                            updateAccountActivity("[ERROR] " + _currentUsername + " | Auftragsblatt | Search Customer by Name", LOGTYPE.ERROR)
                                        }
                                    })
                                } else if(_currentPageFile == "azubi_ab"){
                                    $.ajax({
                                        url: "scripts/searchCustomer_name.php",
                                        type: "POST",
                                        data: {
                                            name: _searchedCustomerName
                                        },
                                        beforeSend: function() { switchState(STATES.LOADING) },
                                        success: function(response) {
                                            if(response == 1){
                                                switchState(STATES.CANTFIND_WANTTOADD)
                                            } else {
                                                let split = response.split('_')
                                                _currentCustomerName = split[0]
                                                _currentCustomerNumber = parseInt(split[1])
                                                _currentCustomerRabatt = parseInt(split[2])
                                                _currentCustomerEnterState = split[3]
                                                if(split[4] == 1){
                                                    switchState(STATES.SERACH_CUSTOMER)
                                                    new GNWX_NOTIFY({ text: _currentCustomerName + " ist bei uns im System gesperrt & wird nicht mehr bearbeitet!", position: "bottom-left", class: "gnwx-danger", autoClose: 7500 });
                                                } else {
                                                    switchState(STATES.AUFTRAGSBLATT)
                                                    // success message
                                                    updateAccountActivity(_currentUsername + " hat einen neuen Kunden ("+name+") angelegt (Kundenkartei-Ausbildung)!", LOGTYPE.ADDED)
                                                    new GNWX_NOTIFY({ text: name + " wurde erfolgreich in die Kundenkartei-Ausbildung eingetragen!", position: "bottom-left", class: "gnwx-success", autoClose: 3500 });
                                                }
                                            }
                                        },
                                        error: function(){
                                            updateAccountActivity("[ERROR] " + _currentUsername + " | Auftragsblatt-Ausbildung | Search Customer by Name", LOGTYPE.ERROR)
                                        }
                                    })
                                }
                            }
                        })
                    })
                }
            },
            error: function(){
                updateAccountActivity("[ERROR] " + _currentUsername + " | Kundenkartei | NEW", LOGTYPE.ERROR)
            }
        })
    } else {
        new GNWX_NOTIFY({ text: "Bitte alle Pflichtfelder ausfüllen!", position: "bottom-left", class: "gnwx-danger", autoClose: 3500 });
    }
}

function GET_LATEST_CUSTOMER(array){
    if(_currentUsername == "") return
    $.ajax({
        url: "scripts/getLatestCustomer.php",
        type: "POST",
        beforeSend: function(){ },
        success: array
    })
}