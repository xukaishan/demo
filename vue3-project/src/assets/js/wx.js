export function wxShare(params) {//需先在html中引入https://res.wx.qq.com/open/js/jweixin-1.2.0.js
    var defaults = {
        ctx: "http://upad.youxuepai.com/youxuepaiNetworkCenter/",//获取公众号权限地址
        url: window.location.href,// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: "",//分享图片类链接
        title: "",//分享标题
        desc: "",//分享描述
    };
    var settings = $.extend({}, defaults, params);//传入的配置
    
    $.ajax({
        url: settings.ctx + "weixin/getSignPackage?jsoncallback=?&url=" + encodeURIComponent(settings.url),
        type: "GET",
        dataType: "jsonp",
        jsonp: 'jsoncallback',
        success: function (sign) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wx18f0ea27a2433148', // 必填，公众号的唯一标识
                timestamp: sign.timestamp, // 必填，生成签名的时间戳
                nonceStr: sign.nonceStr, // 必填，生成签名的随机串
                signature: sign.signature,// 必填，签名，见附录1
                jsApiList: [
                    "onMenuShareTimeline",
                    "onMenuShareAppMessage",
                    "onMenuShareWeibo",
                    "onMenuShareQZone",
                    "onMenuShareQQ"
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.onMenuShareTimeline({
                    title: settings.title, // 分享标题
                    desc: settings.desc,  //分享描述
                    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: settings.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareAppMessage({
                    title: settings.title, // 分享标题
                    desc: settings.desc, // 分享描述
                    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: settings.imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareWeibo({
                    title: settings.title, // 分享标题
                    desc: settings.desc, // 分享描述
                    link: window.location.href, // 分享链接
                    imgUrl: settings.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareQQ({
                    title: settings.title, // 分享标题
                    desc: settings.desc, // 分享描述
                    link: window.location.href, // 分享链接
                    imgUrl: settings.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareQZone({
                    title: settings.title, // 分享标题
                    desc: settings.desc, // 分享描述
                    link: window.location.href, // 分享链接
                    imgUrl: settings.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

            });
        }
    });
   
}