// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 这个函数中，可以拿到我们给 ajax 提供的 配置对象
var baseURL = 'http://api-breakingnews-web.itheima.net'
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    // 1.添加根路径
    options.url = baseURL + options.url

    // 2.给有权限的路径设置 headers 请求头
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 3.登录拦截
    options.complete = function (res) {
        // console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status !== 0 && obj.message === "身份认证失败！") {
            // 1.清空本地 token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = '/login.html'
        }
    }
})