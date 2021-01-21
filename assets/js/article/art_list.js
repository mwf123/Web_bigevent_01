
$(function () {

    // 定义事件过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr);

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 封装补零函数
    function padZero(n) {
        return n < 10 ? "0" + n : n;
    }
    var layer = layui.layer;

    // 1.定义查询数据参数，将来查询文章使用
    var q = {
        pagenum: 1,   	//页码值
        pagesize: 2,  //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态，可选值有：已发布、草稿
    }
    initTable();
    // 2.获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 获取成功
                // layer.msg("获取文章列表成功！")
                // 渲染
                var strHtml = template('tpl-table', res)
                $('tbody').html(strHtml);

                // 调用分页
                renderPage(res.total);
            }
        });
    }

    // 3.初始化分类 (渲染文字分类)
    var form = layui.form;
    initCate()
    // 封装函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取失败！");
                }
                // 成功后赋值 渲染
                var strHtml = template('tpl-cate', res)
                $('[name=cate_id]').html(strHtml);
                // form.render() 就是根据 select 标签生成/渲染 dl放dd 
                // 如果我们赋值之后，发现数据没有同步出来，就可以调用 form.render() 
                form.render();
            }
        });
    }

    // 4.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // console.log('ok');
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })
    // 5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条数据
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调 
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr

                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    // 初始化文章列表
                    initTable()
                }
            }
        });
    }

    // 点击按钮 实现删除文章功能
    $('tbody').on('click', '.btn-delete', function () {

        // 获取 id 
        var Id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败！")
                    }

                    // 页面汇总删除按钮等于 1 ，页码 大于1 (满足这两个条件才进行 q.pagenum--)
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    // 删除成功  重新渲染页面
                    initTable();
                    layer.msg("删除成功！")
                    layer.close(index);

                }
            });
        });


    })
})
