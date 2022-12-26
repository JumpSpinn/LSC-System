var _currentSearchValue = ""

$(() => {
    // set search value
    $('.system_page').on('input', '.page_search_container input', function(e){
        _currentSearchValue = $(this).val().toLowerCase()
    })

    // show, hide search
    $('.system_page').on('click', '.page_search_icon', function(){
        showSearch()
    })

    // keydown events
    $(document).on('keydown', function(e){
        if(e.which === 27){ // ESC
            if(_searchShowed){
                showSearch()
            }
        }
    })

    // click events
    $(document).on("mousedown", function(e) {
        if(e.target.localName == 'input'){ } else {
            if(_searchShowed){
                showSearch()
            }
        }
    })
})

function showSearch(){
    if($('.page_search_container').hasClass('active')){
        setTimeout(() => {
            _searchShowed = false
            _currentSearchValue = ""
        }, 1);
        $('.page_search_container').removeClass('active')
    } else {
        setTimeout(() => {
            _searchShowed = true
            _currentSearchValue = ""
        }, 1);
        $('.page_search_container input').focus()
        $('.page_search_container input').val('')
        $('.page_search_container').addClass('active')
    }
}