$(function () {
    $(".add_btn").on("click", function () {
        $(".add_page_btn").html("确认添加").css("marginLeft", "120px")
        $(".add_page_reset").show();
        $(".add_page").show();
        $(".add_page_bg").show();
    })

    $(".add_page span").on("click", function () {
        $(".add_page").hide();
        $(".add_page_bg").hide();
    })

    $(".add_page_form").on("submit", function (e) {
        var flag = false;
        e.preventDefault();
        $(".add_page_form input").each(function (index, ele) {
            if ($(ele).val() === '') {
                info($(".info_1"), "必填项不能为空");
                ele.select();
                flag = true;
                return
            }
        })
        if (flag) {
            return
        }
        $.ajax({
            method: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                info($(".login_information span"), res.message);
                if (res.status === 1) {
                    return
                }
                if (res.status === 0) {
                    initTable();
                    $(".add_page span").click();
                }

            }
        })
    })
    $("tbody").on("click", ".edit_btn", function () {
        var id = $(this).attr("data-id");

        $.ajax({
            method: "get",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status === 0) {
                    $(".add_btn").click();
                    $(".name").val(res.data.name);
                    $(".alias").val(res.data.alias);
                    $(".add_page_reset").hide();
                    $(".add_page_btn").html("确认修改").css("marginLeft", "200px")

                }
            }
        })

    })

    $("tbody").on("click", ".del_btn", function () {
        var id = $(this).attr("data-id");
        $.ajax({
            method: 'get',
            url: "/my/article/deletecate/" + id,
            success: function (res) {
                info($(".login_information span"), res.message);
                initTable();
            }
        })
    })


    initTable();
    function initTable() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function (res) {
                var tab = template("tpl_table", res)
                $(".article_cate_table tbody").html(tab);
            }
        })
    }

    function info(ele, information) {
        ele.html(information);
        ele.parent().fadeIn();
        setTimeout(function () {
            $(ele).parent().fadeOut();
        }, 800)
    }
})