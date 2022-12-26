var ACCOUNT_STATES = [
    {
        id: 0,
        name: "Aktiv"
    },
    {
        id: 1,
        name: "Urlaub"
    },
    {
        id: 2,
        name: "Fehlend"
    },
    {
        id: 3,
        name: "Krank"
    },
    {
        id: 4,
        name: "Suspendiert"
    }
]

function getAccountStateName(accountState) {
    let stateName = ''
    const accountStateNames = {
        '0': 'Aktiv',
        '1': 'Urlaub',
        '2': 'Fehlend',
        '3': 'Krank',
        '4': 'Suspendiert'
    }
    stateName = accountStateNames[accountState] ?? 'Es konnte kein Rang gefunden werden!'
    return stateName;
}