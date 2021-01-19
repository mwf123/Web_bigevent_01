
// 入口函数
$(function () {
    // 1.定义密码规则
    var form = layui.form;
    form.verify({
        // 1.所有密码
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 2.新密码
        newPwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return "原密码和新密码不能相同！"
            }
        },
        // 3.确认密码
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次新密码输入不一致！"
            }
        }
    })

    // 2.修改密码
    $('.layui-form').on('submit', function (e) {
        // 1.阻止表单默认提交行为
        e.preventDefault();
        // ajax
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                // 修改成功
                layui.layer.msg("修改密码成功！");
                // 重置表单
                $('.layui-form')[0].reset();
            }
        });
    })
})