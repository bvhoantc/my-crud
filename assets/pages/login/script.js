var DFT = function ($) {
    var bindClick = function(){
        $(document).on('click', '#btn-login', function () {
            console.log("aloo");
            requestManagement();
        });
    }
    function requestManagement(){
        console.log("2");
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
                    title: 'Cảnh báo !',
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
            if (!$('.login-content')[0]) {
                // scrollbar('html', 'rgba(0,0,0,0.3)', '5px');
            }
            bindClick();
        },
        uncut: function () {
            //$('#frm-login').validationEngine('detach');
        }
    };
}(jQuery);