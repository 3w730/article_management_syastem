$(function () {
    $(".info_card_form").on("submit", function (e) {
        e.preventDefault();
        var reg_nickname = /^[^\s]{1,6}$/;
        var reg_email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!reg_nickname.test($(".nickname").val())) {
            info($(".info_1"), "用户名长度需要在1-6位间");
            $(".nickname")[0].select();
            return
        }
        if (!$(".email").val()) {
            info($(".info_1"), "邮箱不能为空");
            $(".email")[0].select();
            return
        }
        if (!reg_email.test($(".email").val())) {
            info($(".info_1"), "邮箱格式不正确");
            $(".email")[0].select();
            return
        }
        $.ajax({
            method: "post",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    info($(".login_information span"), "修改失败")
                    return
                } else {
                    info($(".login_information span"), "修改成功")
                    window.parent.getUserInfo();
                }

            }
        })

    })

    $("input[type=text]").on("focus", function () {
        $(this).css("outline", "#FF5722 solid 1px")
    })
    $("input[type=text]").on("blur", function () {
        $(this).css("outline", "none")
    })

    $("#btn_reset").on("click", function (e) {
        e.preventDefault();
        initUserinfo();
    })

    initUserinfo();
    function initUserinfo() {
        $.ajax({
            methods: "get",
            url: "/my/userinfo",
            success: function (res) {
                $(".username").val(res.data.username);
                $(".nickname").val(res.data.nickname);
                $(".email").val(res.data.email);
                $(".card_form_id").val(res.data.id)
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