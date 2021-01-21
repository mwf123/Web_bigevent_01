$(function () {

    var layer = layui.layer;
    var form = layui.form;
    // 1.获取文章分类
    initCate();
    // 封装函数
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败！")
                }
                // 获取成功后进行 赋值 渲染
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 
                form.render();
            }
        });
    }

    // 2.初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击 选择封面 按钮 选择图片
    $('#btnChoseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 5.渲染文章封面
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]

        // 非空校验
        if (file === undefined) {
            return;
        }

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.修改状态  （设置默认事件为 已发布 这样就不用给它添加点击事件了）
    var state = "已发布";
    // $('#btnSave1').on('click', function () {
    //     state = "已发布";
    // })
    $('#btnSave2').on('click', function () {
        state = "草稿";
    })

    // 7.文章发布
    $('#form-pub').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 创建 FormData对象
        var fd = new FormData($(this)[0]);
        // 添加状态
        fd.append('state', state);
        // console.log(...fd);
        // 生成二进制文件图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发送 ajax 要在  toBlob()函数 里面
                // console.log(...fd);
                publistArticle(fd);
            })
    })

    // 8.封装发布文章
    function publistArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败！")
                }
                layer.msg("发布文章成功！")
                // 延迟 并跳转
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    // window.parent.document.getElementById("form_list").click();
                    window.parent.parent.document.getElementById('art_list').click();
                }, 1500)
            }
        });
    }
})