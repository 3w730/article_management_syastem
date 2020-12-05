$(function () {
    $(".info_pwd_form").on("submit", function (e) {
        e.preventDefault();
        var reg_ = /^[^\s]{6,}$/
        var flag = false
        $("input").each(function (index, ele) {
            console.log(ele);
            if ($(ele).val() === '') {
                flag = true;
                info($(".info_1"), "必填项不能为空");
                $(ele)[0].select();
                return
            }
        })
        if (flag) {
            return
        }
        if (!reg_.test($(".newpwd").val())) {
            info($(".info_1"), "密码强度太弱了哦");
            $(".newpwd")[0].select();
            return
        }
        if ($(".repwd").val() !== $(".newpwd").val()) {
            info($(".info_1"), "两次密码输入不一致");
            $(".repwd")[0].select();
            return
        }
        $.ajax({
            method: "post",
            url: '/my/updatepwd',
            data: {
                oldPwd: $(".oldpwd").val(),
                newPwd: $(".newpwd").val(),
            },
            success: function (res) {
                info($(".login_information span"), res.message);
                if (res.status === 1) {
                    $(".oldpwd")[0].select();
                } else {
                    $(".info_pwd_form")[0].reset();
                }
            }
        })

    })

    function info(ele, information) {
        ele.html(information);
        ele.parent().fadeIn();
        setTimeout(function () {
            $(ele).parent().fadeOut();
        }, 1000)
    }
})