$(function () {
    // 1.获取用户信息，并渲染头像
    getUserInfo();

    // 2.退出登录功能
    $('#btnlogout').on('click', function () {
        // 框架提供的询问框(提示用户是否确认退出)
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地 token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = '/login.html'
            // 3.是否关闭询问框
            layer.close(index);
        });
    })
})

// 封装一个获取用户信息的函数(必须是全局函数，因为后面还要用到)
function getUserInfo() {
    // 发送ajax
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！")
            }
            // 请求成功，渲染头像
            renderAvatar(res.data);
        }
    });
}
// 封装渲染头像函数
function renderAvatar(user) {
    // 1.渲染昵称||用户名
    var name = user.nickname || user.username
    $('#welcome').html("欢迎 " + name);
    // 2.渲染头像
    if (user.user_pic !== null) {
        // 图片头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text_avatar').hide();
    } else {
        // 文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text_avatar').show().html(first);
    }
}
// --toUppercase() 方法是将字符都转为大写