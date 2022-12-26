var BH_DATA_GENERAL_TYPES = {
    GEWINNSPANNE: 1,
    STEUERN: 2,
    MOTORSCHADEN_PROZENT: 3,
    EINPARKDAUER_MIN: 4
}

var LOGTYPE = {
    ADDED: 0,
    EDITED: 1,
    REMOVED: 2,
    LOGGEDIN: 3,
    ERROR: 4
}

var CUSTOMERS_SYNCEDTO = {
    MAIN: 0,
    SCHOOL: 1
}

var _searchShowed = false

function getCurrentTimestamp() {
    let timestamp = Math.round(new Date().getTime() / 1000)
    return timestamp
}

function convertTimestamp(timestamp, bool) {
    var date = new Date(timestamp * 1000);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yy = date.getFullYear().toString().substring(0);
    var hh = String(date.getHours()).padStart(2, '0');
    var m = String(date.getMinutes()).padStart(2, '0');
    var ss = String(date.getSeconds()).padStart(2, '0');

    if (bool) {
        return (dd + '.' + mm + '.' + yy + " um " + hh + ":" + m + " Uhr");
    } else {
        return (dd + '.' + mm + '.' + yy + " " + hh + ":" + m);
    }
}

function updateAccountActivity(message, logType = 0){
    $.ajax({
        url: "scripts/updateAccountActivity.php",
        type: "POST",
        data: {
            lastAction: getCurrentTimestamp()
        },
        beforeSend: function() { },
        success: function(response) { }
    })

    $.ajax({
        url: "scripts/add/activityLog.php",
        type: "POST",
        data: {
            timestamp: getCurrentTimestamp(),
            message: message,
            logType: logType
        },
        beforeSend: function() { },
        success: function(response) { }
    })
}

function translateDate(date){
    let split = date.split('-')
    let day = split[2]
    let month = split[1]
    let year = split[0]
    let translatedDate = day + "." + month + "." + year
    return translatedDate
}

function toggleLoading(toggle){
    $('.loading_wrapper').css('display', (toggle ? 'flex' : 'none'))
    $('.lds-ellipsis').css('display', (toggle ? 'flex' : 'none'))
}

var PAGE_PERMISSION_TYPES = {
    NONE: 0,
    // Schwarzes Brett
    SCHWARZESBRETT_CREATE: 1,
    SCHWARZESBRETT_EDIT: 2,
    SCHWARZESBRETT_DELETE: 3,
    // Fuhrpark Rechte
    FUHRPARK_CREATE: 4,
    FUHRPARK_EDIT: 5,
    FUHRPARK_DELETE: 6,
    // Lagerbestand
    LAGER_CREATE: 7,
    LAGER_EDIT: 8,
    LAGER_DELETE: 9,
    // Servicepartner
    SERVICEPARTNER_CREATE: 10,
    SERVICEPARTNER_EDIT: 11,
    SERVICEPARTNER_DELETE: 12,
    // Buchhaltung | Main
    BUCHHALTUNG_CHECK: 13,
    BUCHHALTUNG_RECHNUNG: 17,
    // Ränge
    RANG_CREATE: 14,
    RANG_EDIT: 15,
    RANG_DELETE: 16,
}

var PAGE_PERMISSIONS = [
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.SCHWARZESBRETT_CREATE,
        name: "Mitteilungen erstellen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.SCHWARZESBRETT_EDIT,
        name: "Mitteilungen bearbeiten"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.SCHWARZESBRETT_DELETE,
        name: "Mitteilungen löschen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.FUHRPARK_CREATE,
        name: "Fuhrparkeinträge erstellen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.FUHRPARK_EDIT,
        name: "Fuhrparkeinträge bearbeiten"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.FUHRPARK_DELETE,
        name: "Fuhrparkeinträge löschen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.LAGER_CREATE,
        name: "Lagerbestände erstellen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.LAGER_EDIT,
        name: "Lagerbestände bearbeiten"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.LAGER_DELETE,
        name: "Lagerbestände löschen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.SERVICEPARTNER_CREATE,
        name: "Servicepartner erstellen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.SERVICEPARTNER_EDIT,
        name: "Servicepartner bearbeiten"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.SERVICEPARTNER_DELETE,
        name: "Servicepartner löschen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.BUCHHALTUNG_CHECK,
        name: "Buchhaltung überprüfen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.RANG_CREATE,
        name: "Ränge erstellen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.RANG_EDIT,
        name: "Ränge bearbeiten"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.RANG_DELETE,
        name: "Ränge löschen"
    },
    {
        permissionTypeID: PAGE_PERMISSION_TYPES.BUCHHALTUNG_RECHNUNG,
        name: "Rechnungen erstellen"
    }
]

function hasPermission(permissionType){
    let result = false
    let find = JSON.parse(_currentUserPosition.pagePermissions).find(i => i.id == permissionType)
    if(find != null){ result = true }
    return result
}