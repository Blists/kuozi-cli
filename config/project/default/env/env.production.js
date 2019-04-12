const domain = "https://www.qiwcj.com";
module.exports = {
    projectConfig: {
        default: {
            name: "HT",
            rootPath: "htqh/portal",
            baseURL: domain
        },
        form: {
            name: "form",
            rootPath: "form/portal",
            baseURL: "domain",
        }
    },
    preImg: domain + "/fsimg/thumb_",
    // preImg: domain + "/fsimg/",
    preImgRaw: domain + "/fsimg/",
    socket: domain,
    redirectUrl: "https://www.qiwcj.com/static/app/index.html${url}",
    wxRedirectUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1754263ca21b30b9&redirect_uri=https%3A%2F%2Fwww.qiwcj.com%2Fstatic%2Fapp%2findex.html${url}&response_type=code&scope=snsapi_base&state=mineauth#wechat_redirect",
    jfsc: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1754263ca21b30b9&redirect_uri=https%3a%2f%2fwww.qiwcj.com%2fstatic%2fjifen%2findex.html%3fpath%3dhome%26merchantNum%3d10001&response_type=code&scope=snsapi_base&state=mineauth#wechat_redirect"
};
