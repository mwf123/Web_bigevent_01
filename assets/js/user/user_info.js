
$(function () {
    // 1.自定义验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (val) {
            if (val.length > 6) {
                return "昵称长度在 1~6 之间！"
            }
        }
    })

    // 2.调用获取和渲染用户信息函数
    initUserInfo();
    // 封装获取和渲染用户信息函数
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);

                // 利用 layui里的 form.val()进行赋值
                form.val("formUserInfo", res.data)
            }
        });
    }

    // 3.重置功能 表单重置
    // 给 form绑用 reset事件，给重置按钮绑用 click事件
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 重新渲染用户
        initUserInfo();
    })

    // 4.提交用户修改
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("用户修改信息失败！")
                }
                layer.msg("用户修改信息成功！")
                // window.parent 调用父页面中的更新用户信息和头像的方法
                window.parent.getUserInfo();
            }
        });
    })


})