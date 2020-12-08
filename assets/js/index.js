$(function () {
    $(".nav-item").on("mouseenter", function () {
        $(this).contents("a").children(".bottom_border").stop().show();
        $(this).children(".nav-child").stop().fadeIn();
    })

    $(".nav-item").on("mouseleave", function () {
        $(this).contents("a").children(".bottom_border").stop().fadeOut();
        $(this).children(".nav-child").stop().fadeOut();
    })
    $(".nav-tree li").on("click", function () {
        if ($(this).children("dl").is(':visible')) {
            $(this).children("dl").hide();

        } else {
            $(this).children("dl").show();
            $(this).addClass("chosen");
            $(this).siblings("li").removeClass("chosen")
            $(this).siblings("li").children("dl").hide();
        }
    })
    $(".offBtn").on("click", function () {
        out();
    })

    $(".nav-child a").on("click", function (e) {
        e.stopPropagation();
    })
    getUserInfo();

    function out() {
        var message = "确定退出吗？"
        if (confirm(message) === true) {
            localStorage.removeItem("token");
            location.href = '/login.html';
        }
        else {
            return
        }

    }
})
function renderAvater(user) {
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎  " + name)
    if (user.pic !== '') {
        $(".pic_img").prop("src", user.user_pic).show();
        $(".text-avater").hide();
    } else {
        $(".pic_img").hide();
        var first = name[0];
        $(".text-avater").html(first);
    }
}

function getUserInfo() {
    $.ajax({
        methods: "get",
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return console.log("获取失败");
            }
            renderAvater(res.data);

        },
    })
}