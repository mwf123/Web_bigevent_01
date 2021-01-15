// 入口函数
$(function () {
    // 1.点击去注册账号，隐藏登录区域，显示注册区域
    $('#link_reg').on('click', function () {
        $('.login_box').hide();
        $('.reg_box').show();
    })
    // 2.点击去登录账号，隐藏注册区域，显示登录区域
    $('#link_login').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    })

    // 3.以数组形式自定义校验规则 (只要引入 Jayui.all.js就会多出 form)
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        // 3.1 密码规则
        pwd: [
            // 正则表达式
            /^[\S]{6,16}$/,
            // 提示信息
            "密码必须6-16位,且不能输入空格"
        ],
        // 3.2 校验两次密码是否一致
        repwd: function (val) {
            // --通过形参拿到的是确认密码框的内容
            // --还需拿到密码框中的内容
            // --然后进行一次判断，如果判断失败则 return 一个提示信息
            var pwd = $('.reg_box [name=password]').val().trim();
            if (pwd !== val.trim()) {
                return "两次密码输入不一致！"
            }
        }
    })

    // 4.监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 4.1 阻止表单默认提交
        e.preventDefault();
        // 4.2 发送 ajax 请求
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $('#form_reg [name=username]').val().trim(),
                password: $('#form_reg [name=password]').val().trim()
            },
            success: function (res) {
                // 如果错误返回判断值
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 注册成功后 触发“去登录”的点击事件
                layer.msg("注册成功，请登录！")
                $('#link_login').click();
                // 重置 form 表单
                $('#form_reg')[0].reset();
            }
        });
    })

    // 5.监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                // 校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，登录成功！')
                // 保存 token ，为了接口要使用 token
                localStorage.setItem("token", res.token);
                // 跳转
                location.href = "/index.html";
            }
        });
    })
}) 