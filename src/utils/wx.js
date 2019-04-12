// 微信config接口注入权限验证配置
export let wxConfig = info => {
    wx.config({
        debug: info.debug ? info.debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: info.appId, // 必填，公众号的唯一标识
        timestamp: info.timestamp, // 必填，生成签名的时间戳
        nonceStr: info.noncestr, // 必填，生成签名的随机串
        signature: info.signature, // 必填，签名，见附录1
        // jsApiList: info.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(function() {
        // 隐藏所有菜单
        // wx.hideOptionMenu();
        // wx.showMenuItems({
        //     menuList: [] // 要显示的菜单项，所有menu项见附录3
        // });
        resetShare();
    });
};
// 微信支付相关
export let wxPay = params => {
    return new Promise(function(resolve, reject) {
        WeixinJSBridge.invoke(
            "getBrandWCPayRequest",
            {
                appId: params.appid,
                timeStamp: params.timeStamp,
                nonceStr: params.nonceStr,
                package: params.package,
                signType: "MD5",
                paySign: params.sign
            },
            function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    // 支付成功
                    resolve(1);
                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                    // 取消支付
                    reject("取消支付");
                } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                    // 支付失败
                    console.error(res);
                    resolve(0);
                }
            }
        );
    });
};
// 分享到朋友圈和好友
export let shareAll = info => {
    shareTimeline(info);
    shareAppMessage(info);
};
// 注册分享到朋友圈
export let shareTimeline = info => {
    wx.onMenuShareTimeline({
        title: info.title, // 分享标题
        link: creatLink(info), // 分享链接
        imgUrl: info.imgUrl, // 分享图标
        success: info.success
    });
    // 显示分享到朋友圈
    wx.showMenuItems({ menuList: ["menuItem:share:timeline"] }); // 要显示的菜单项，所有menu项见附录3
};
// 注册分享好友
export let shareAppMessage = info => {
    wx.onMenuShareAppMessage({
        title: info.title, // 分享标题
        desc: info.desc, // 分享描述
        link: creatLink(info), // 分享链接
        imgUrl: info.imgUrl, // 分享图标
        type: info.type ? info.type : "", // 分享类型,music、video或link，不填默认为link
        dataUrl: info.dataUrl ? info.dataUrl : "", // 如果type是music或video，则要提供数据链接，默认为空
        success: info.success
    });
    // 显示分享好友
    wx.showMenuItems({ menuList: ["menuItem:share:appMessage"] }); // 要显示的菜单项，所有menu项见附录3
};

export let wxReload = info => {
    window.location = creatLink(info);
};

function creatLink(info) {
    let path = info.path ? encodeURIComponent(info.path) : "";
    return (
        window.location.origin +
        (window.location.pathname.match("index.html") ? window.location.pathname.replace("index.html", "redirect.html") : window.location.pathname + "redirect.html") +
        (path ? `?path=${path}` : "") +
        (info.inviter ? `&inviter=${info.inviter}` : "") +
        (info.noBack ? `&noBack=true` : "")
    );
}

export let resetShare = () => {
    shareTimeline({
        title: "「期望财经」 为投资者提供最有价值的信息",
        imgUrl: "https://www.qiwcj.com/fsimg/logo"
    });
    shareAppMessage({
        title: "「期望财经」 为投资者提供最有价值的信息",
        desc: "连接大宗产业与期货投资，邀您与各行业资深人士探讨学习，共同成长",
        imgUrl: "https://www.qiwcj.com/fsimg/logo"
    });
};

export let closeWindow = () => {
    wx.closeWindow();
};
