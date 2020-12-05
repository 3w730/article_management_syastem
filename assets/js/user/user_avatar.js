$(function () {
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)
    $(".avatar_btn").on('click', function (e) {
        $(".file").click();

    })
    $(".file").on("change", function (e) {
        var file = e.target.files[0]
        console.log(e.target.files);
        if (e.target.files.length === 0) {
            info($(".login_information span"), "请选择图片");
        } else {
            var newImgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        }
    })
    $(".avatar_sure").on("click", function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                info($(".login_information span"), res.message);
                if (res.status === 0) {
                    window.parent.getUserInfo();
                }
            }
        })

    })

    function info(ele, information) {
        ele.html(information);
        ele.parent().fadeIn();
        setTimeout(function () {
            $(ele).parent().fadeOut();
        }, 800)
    }
})