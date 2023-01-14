var _createdBills = []
var _createdBillsLoaded = false

$(() => {
    getData_createdBills(function(array){
        _createdBills = JSON.parse(array)
        _createdBillsLoaded = true
        showCreatedBills()
    })
})

function showCreatedBills(){
    console.log(_createdBills)
}