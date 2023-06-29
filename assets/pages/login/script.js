var DFT = function ($) {
    var bindClick = function(){
        $(document).on('click', '#btn-login', function () {
            requestManagement();
        });
        // Nhấn enter khi login
        $(document).on('keyup', '#password', function (e) {
            if(e.keyCode == 13){
                requestManagement()
            }
        });
    }
    function requestManagement(){
        var filter = _.chain($('.searchColumn')).reduce(function (memo, el) {
            if (!_.isEqual($(el).val(), '')) memo[el.name] = $(el).val();
            return memo;
        }, {}).value();
        $.post('/login', filter, function (resp) {
            console.log("resp",resp);
            if (_.isEqual(resp.code, 200)) {
                console.log("window.location.href",window.location.href);
                window.location.href = 'todo';
            } else {
                Swal.fire({
                    title: 'Thông báo !',
                    text: resp.message || '',
                    type: 'warning',
                    confirmButtonColor: "#DD6B55",
                    closeOnConfirm: false
                })
            }
        });
    }

    return {
        init: function () {
            bindClick();
        },
        uncut: function () {
            $(document).off('keyup', '#btn-login');
            $(document).off('click', '#btn-login');
        }
    };
}(jQuery);