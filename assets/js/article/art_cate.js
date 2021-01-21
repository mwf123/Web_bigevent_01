$(function () {
    var layer = layui.layer

    initArtCateList()

    // 1.获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 2.添加显示区域
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        // 利用框架代码,显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: "添加文章分类",
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        })
    })

    // 3.提交-添加文章分类
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单默认提交事件
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 4.显示修改 form 表单 
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', ".btn-edit", function () {
        // 利用框架代码,显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: "修改文章分类",
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        })

        // 获取自定义属性和id 都要在 点击事件里面
        var id = $(this).attr('data-id')
        console.log(id);
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        });
    })

    // 5.提交-修改文章分类
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止表单默认提交事件
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('更新分类信息成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexEdit)
            }
        })
    })

    // 6.删除
    $('tbody').on('click', ".btn-delete", function () {
        // 获取id
        var id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 渲染页面
                    initArtCateList();
                    layer.msg("文章类别删除成功！")
                    layer.close(index);
                }
            });
        });
    })


})