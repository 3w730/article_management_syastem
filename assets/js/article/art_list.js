$(function () {
    var laypage = layui.laypage;
    var layer = layui.layer;

    $(".article_list_sel").on("click", function () {
        if (!$(this).children("dl").is(':visible')) {
            $(this).children(".list_sel_edge").addClass("rotate");
            $(this).siblings(".article_list_sel").children("dl").hide();
            $(this).siblings(".article_list_sel").children(".list_sel_edge").removeClass("rotate");
        }
        else {
            $(this).children(".list_sel_edge").removeClass("rotate");
        }
        $(this).children("dl").fadeToggle()
    })

    $(".list_sel_dl").on("click", ".list_sel_dd", function () {
        $(this).parents(".list_sel_dl").siblings(".list_sel_ipt").val($(this).text());
        $(this).parents(".list_sel_dl").siblings(".list_sel_ipt").attr("data-Id", $(this).attr("data-Id"));
        $(this).parents(".list_sel_dl").siblings(".list_sel_ipt").attr("data-state", $(this).attr("data-state"));
    })

    $("tbody").on("click", ".edit_btn", function () {
        var id = $(this).attr("data-id");
        var cate_name = $(this).parents("td").siblings("#cate_name").html();
        console.log(cate_name);
        console.log(id);
        location.href = "/article/art_mod.html?id=" + id  +'&cate_name=' + cate_name
    })

    $("tbody").on("click", ".del_btn", function () {
        var len = $(".del_btn").length;
        var id = $(this).attr("data-id")
        layer.confirm("确认删除?", { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    info($(".login_information span"), res.message);
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initList();
                }
            })
            layer.close(index);
        })

    })
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    $(".list_screen").on("submit", function (e) {
        e.preventDefault();
        var cate_id = $(".list_sel_ipt[name=cate_id]").attr("data-Id")
        var state = $(".list_sel_ipt[name=state]").attr("data-state");
        q.cate_id = cate_id;
        q.state = state;
        initList();
    })



    initCate()
    initList();

    template.defaults.imports.retime = function (date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = stime(dt.getMonth() + 1);
        var d = stime(dt.getDate());

        var h = stime(dt.getHours());
        var mn = stime(dt.getMinutes());
        var s = stime(dt.getSeconds());


        return y + '-' + m + "-" + d + " " + h + ':' + mn + ':' + s;
    }
    function initList() {
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                var data = template("tpl_table", res);
                $(".article_list_table tbody").html(data)
                renderPage(res.total)
            }
        })
    }

    function stime(n) {
        if (n < 10) {
            n = '0' + n;
        }
        return n
    }

    function info(ele, information) {
        ele.html(information);
        ele.parent().fadeIn();
        setTimeout(function () {
            $(ele).parent().fadeOut();
        }, 600)
    }

    function initCate() {
        $.ajax({
            method: "get",
            url: '/my/article/cates',
            success: function (res) {
                var data = template("list_cate", res);
                $(".article_list_body .article_list_sel:first-child dl").html(data)
            }
        })
    }

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initList();
                }
            }
        })
    }
})