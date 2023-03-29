var _logs = []
var _logsLoaded = false

$(() => {
    toggleLoading(true)
    getData_activityLogs(function(array){
        _logs = JSON.parse(array)
        _logsLoaded = true
        showLogs()
    })

    $('#search').on('input', function(){
        let searchValue = $(this).val().toLowerCase()
        let filter = _logs.filter(f => f.message.toLowerCase().includes(searchValue))
        if(searchValue != ""){
            showLogs(filter)
        } else {
            showLogs(_logs)
        }
    })
})

function showLogs(array = _logs){
    if(!_logsLoaded) return
    $('.mitarbeiter_content_container').html('')
    array.sort((a, b) => { return b.timestamp - a.timestamp; })
    let containers = []
    array.forEach((log) => {
        let container = '<div class="logs_entry logType_'+log.logType+'" data-id="'+log.id+'"><p>['+convertTimestamp(log.timestamp)+']</p> '+log.message+'</div>'
        containers.push(container)
    })
    $('.mitarbeiter_content_container').append(containers)
    toggleLoading(false)
}