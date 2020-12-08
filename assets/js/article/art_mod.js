$(function () {
    initCate();
    initEditor();
    var $image = $('#image')
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    var j = {
        id: '',
        cate_name: ''
    }
    getData(location.search)
    console.log(j);
    $image.cropper(options)
    initContent();
    var art_state = '已发布';
    $(".article_mod_form").on("submit", function (e) {
        e.preventDefault();
        var flag = false;
        $(".article_mod_form .mod_input").each(function (index, ele) {
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
        fd.set("cate_id", j.cate_id);
        fd.append("state", art_state);
        fd.append("Id", j.id)
        editArticle(fd);
    })

    $(".article_save_btn").on("click", function (e) {
        e.preventDefault();
        art_state = "草稿";
        $(".article_mod_form").submit();
    })
    $(".article_mod_btn").on("click", function () {
        art_state = "已发布";
    })

    $(".mod_cate").on("click", function () {
        if (!$(this).siblings("dl").is(':visible')) {
            $(this).siblings(".mod_sel_edge").addClass("rotate");
        } else {
            $(this).siblings(".mod_sel_edge").removeClass("rotate");
        }

        $(this).siblings("dl").fadeToggle();
    })

    $(".list_sel_dl").on("click", ".list_sel_dd", function () {
        $(this).parents(".list_sel_dl").siblings(".pub_cate").val($(this).text());
        $(this).parents(".list_sel_dl").siblings(".pub_cate").attr("data-id", $(this).attr("data-id"));
        $(".mod_cate").click();
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
    function initContent() {
        $.ajax({
            method: 'get',
            url: '/my/article/' + j.id,
            success: function (res) {
                if (res.status === 0) {
                    $("#title").val(res.data.title);
                    $("#state").val(j.cate_name);
                    j['cate_id'] = res.data.cate_id;
                    var Imgurl = "http://ajax.frontend.itheima.net" + res.data.cover_img
                    $("#image").attr("src", "http://ajax.frontend.itheima.net" + res.data.cover_img)
                    $image
                        .cropper('destroy')
                        .attr('src', Imgurl)
                        .cropper(options)
                    $("#content").html(res.data.content);
                }
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

    function editArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status === 0) {
                    info($(".login_information span"), res.message)
                    setTimeout(function () {
                        location.href = "/article/art_list.html"
                    }, 600)


                }
            }
        })
    }

    function getData(t) {
        t = t.substr(1)
        t = t.split('&');
        id = t[0].split('=')[1]
        j.id = id;
        j.cate_name = t[1].split('=')[1];
        j.cate_name = decodeURI(j.cate_name)
    }
})