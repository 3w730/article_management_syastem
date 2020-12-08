$(function () {
    initCate();
    initEditor();
    var $image = $('#image')
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $image.cropper(options)

    var art_state = '已发布';
    $(".article_pub_form").on("submit", function (e) {
        e.preventDefault();
        var flag = false;
        $(".article_pub_form .pub_input").each(function (index, ele) {
            if ($(ele).val() === '') {
                info($(".info_1"), "必填项不能为空");
                flag = true;
                return
            }
        })
        if (flag) {
            return
        }
        var fd = new FormData($(this)[0]);
        fd.set("cate_id", $(".pub_cate").attr("data-id"));
        fd.append("state", art_state);
        pubArticle(fd);
    })

    $(".article_save_btn").on("click", function (e) {
        e.preventDefault();
        art_state = "草稿";
        $(".article_pub_form").submit();
    })
    $(".article_pub_btn").on("click", function () {
        art_state = "已发布";
    })

    $(".pub_cate").on("click", function () {
        if (!$(this).siblings("dl").is(':visible')) {
            $(this).siblings(".pub_sel_edge").addClass("rotate");
        } else {
            $(this).siblings(".pub_sel_edge").removeClass("rotate");
        }
        $(this).siblings("dl").fadeToggle();
    })

    $(".list_sel_dl").on("click", ".list_sel_dd", function () {
        $(this).parents(".list_sel_dl").siblings(".pub_cate").val($(this).text());
        $(this).parents(".list_sel_dl").siblings(".pub_cate").attr("data-id", $(this).attr("data-id"));
        $(".pub_cate").click();
    })

    $(".layui-btn-danger").on("click", function () {
        $(".change_danger").click();
    })

    $(".change_danger").on("change", function (e) {
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    })

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var data = template("list_cate", res);
                $(".list_sel_dl").html(data)
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

    function pubArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status === 0) {
                    if (fd.get("state") === '草稿') {
                        info($(".login_information span"), "存草稿成功")
                    }
                    else {
                        info($(".login_information span"), "文章发布成功")
                    }
                    $(".article_pub_form")[0].reset();
                }
            }
        })
    }
})