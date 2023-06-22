var DFT = function ($) {
    var bindClick = function () {
        //Load lại trang
        $(document).on('click', '.zmdi-refresh', function(){
            _.LoadPage(window.location.hash);
        });

        // Chọn chuyển trang
        $(document).on('click', '.zpaging', function () {
            requestManagement($(this).attr('data-link'));
        });

        // Click nút Lọc/Search
        $(document).on('click', '#btn-search', function () {
            requestManagement();
        });

        // Nhấn enter khi search
        $(document).on('keyup', '#searchForm', function (e) {
            if (e.keyCode == 13) requestManagement();
        });
    };

    function requestManagement(page) {
        var filter = _.chain($('.searchColumn')).reduce(function (memo, el) {
            if (!_.isEqual($(el).val(), '')) memo[el.name] = $(el).val();
            return memo;
        }, {}).value();
        if (page) {
            filter.page = page;
        }
        _AjaxData('manage-customer-import?' + $.param(filter), 'GET', {}, function (resp) {
            if (resp.code == 200 && resp.data && resp.data.length > 0) {
                let html = '';
                resp.data.forEach((item, i) => {
                    html += `<tr>
                                <td class="text-center">${item.field_so_dien_thoai || ''}</td>
                                <td class="text-center">${item.field_ho_ten || ''}</td>
                                <td class="text-center">${item.sources || ''}</td>
                                <td class="text-center">${item.telco || ''}</td>
                                <td class="text-center">${item.checked == 0 ? 'Checking' : 'Checked'}</td>
                                <td class="text-center">
                                </td>
                            </tr>`
                });
                $('#manage-customer-import').html(html);
                $('#count-total').html('<b>' +
                        '<span class="">Tổng</span>: ' +
                        '<span class="bold c-red" id="count-total">' + resp.totalResult + '</span>' +
                        '</b>');
                return $('#paging').html(createPaging(resp.paging));
            }
            else {
                swal({
                    title: "Thông báo",
                    text: "Không tìm thấy dữ liệu phù hợp",
                    type: "warning", showCancelButton: false, confirmButtonColor: "#DD6B55", confirmButtonText: "Quay lại!"
                });
                $('#manage-customer-import').html('');
                $('#count-total').html('');
                return $('#paging').html(createPaging(resp.paging));
            }
        });
    };
    // Hiển thị dữ liệu phân trang
    var createPaging = function (paging) {
        if (!paging) return '';
        var firstPage = paging.first ? '<li><a class="zpaging" data-link="' + paging.first + '">&laquo;</a></li>' : '';
        var prePage = paging.previous ? '<li><a class="zpaging" data-link="' + paging.previous + '">&lsaquo;</a></li>' : '';
        var pageNum = '';
        for (var i = 0; i < paging.range.length; i++) {
            if (paging.range[i] == paging.current) {
                pageNum += '<li class="active"><span>' + paging.range[i] + '</span></li>';
            } else {
                pageNum += '<li><a class="zpaging" data-link="' + paging.range[i] + '">' + paging.range[i] + '</a></li>';
            }
        }
        var pageNext = paging.next ? '<li><a class="zpaging" data-link="' + paging.next + '">&rsaquo;</a></li>' : '';
        var pageLast = paging.last ? '<li><a class="zpaging" data-link="' + paging.last + '">&raquo;</a></li>' : '';
        return '<div class="paginate text-center">' + '<ul class="pagination">' + firstPage + prePage + pageNum + pageNext + pageLast + '</ul></div>';
    };

    return {
        init: function () {
            bindClick();
        },
        uncut: function () {
            // xóa sự kiện khi rời trang
            $(document).off('click', '.zpaging');
            $(document).off('click', '#btn-search');
            $(document).off('keyup', '#searchForm');
        }
    };
}(jQuery);
