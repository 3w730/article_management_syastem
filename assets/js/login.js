$(function () {
    $("#link").on('click', function () {
        $(".bg").show();
        $(".login").show();
    })

    $("#title span").on("click", function (e) {
        e.stopPropagation();
        $(".mask").hide();
        $(".login").hide();
    })
    $("#title").on("mousedown", function (e) {
        var x = e.pageX - ($(".login")[0].offsetLeft);
        var y = e.pageY - ($(".login")[0].offsetTop);
        $(document).on('mousemove', move)

        function move(e) {
            $(".login").css("left", e.pageX - x + 'px');
            $(".login").css("top", e.pageY - y + 'px')
        }

        $(document).on("mouseup", function () {
            $(document).off("mousemove", move)
        })

    })
    $(".to_register").on("click", function () {
        $("#username").val("");
        $("#password").val("");
        $("#repassword").val("");
        $("#repass").show();
        $(this).hide();
        $("#loginBtn").val("注册")
        $(".to_sign_in").show();
    })

    $(".to_sign_in").on("click", function () {
        $("#username").val("");
        $("#password").val("");
        $("#repass").hide();
        $(this).hide();
        $("#loginBtn").val("登录")
        $(".to_register").show();
    })

    $("#login").on("submit", function (e) {
        e.preventDefault();
        var reg_password = /^[^\s]{6,12}$/;
        var reg_username = /^[^\s]+$/
        if (!reg_username.test($("#username").val())) {
            info($(".info_1"), "用户名不能为空且不能含空格");
            $("#username")[0].select();
            return
        }
        if (!reg_password.test($("#password").val())) {
            info($(".info_1"), "输入密码必须为6-12位，且不能为空");
            $("#password")[0].select();
            return
        }
        if ($('#repass').is(':visible') && $("#password").val() !== $("#repassword").val()) {
            info($(".info_1"), "两次输入密码不一致")
            $("#repassword")[0].select();
            return
        }
        var data = {
            username: $("#username").val(),
            password: $("#password").val()
        }
        if ($('#repass').is(':visible')) {
            $.post('/api/reguser', data, function (res) {
                var name = $("#username").val();
                info($(".login_information span"), res.message);
                if (res.status != 0) {
                    $("#username")[0].select();
                    return
                }
                else {
                    $(".to_sign_in").click();
                    $("#username").val(name)
                }
            })
        }
        if (!$("#repass").is(':visible')) {
            $.ajax({
                url: '/api/login',
                method: 'POST',
                data: $(this).serialize(),
                success: function (res) {
                    info($(".login_information span"), res.message)

                    if (res.status !== 0) {
                        $("#password").select();
                        return
                    }
                    setTimeout(function () {
                        localStorage.setItem('token', res.token)
                        location.href = '/index.html'
                    }, 300)
                }
            })
        }
    })

    function info(ele, information) {
        ele.html(information);
        ele.parent().fadeIn();
        setTimeout(function () {
            $(ele).parent().fadeOut();
        }, 800)
    }
})