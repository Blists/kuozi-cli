import project from "../../config/project/project.env";
import urls from "./../utils/urls";

import axios from "axios";
import store from "store";

axios.defaults.headers["x-requested-with"] = "XMLHttpRequest";

let fetch = function (method, baseURL, url, data, options, noLoading, noToast, vue) {
    return new Promise((resolve, reject) => {
        let token = store.get("$token");
        let o = options || { headers: {} };
        o.method = method;
        o.baseURL = baseURL;
        o.url = url;
        o.data = data;
        o.headers = o.headers || {};
        o.headers["x-token"] = token;
        if (!noLoading) {
            vue && vue.$loading();
        }
        axios(o)
            .then(data => {
                let res = data.data;
                if (!noLoading) {
                    vue && vue.$loaded();
                }
                if (res.code == 0) {
                    if (res.data === null || res.data === undefined) {
                        resolve({});
                    } else {
                        resolve(res.data);
                    }
                } else {
                    if (res.code == 999 && vue.$route.name != "index") {
                        sessionStorage.setItem("$path", decodeURIComponent(vue.$route.fullPath));
                        vue && vue.$router.replace({ name: "login" });
                    } else if (res.code == 404) {
                        vue && vue.$router.replace({ name: "notFound" });
                    } else {
                        if (!noToast) {
                            vue && vue.$toast(res.message);
                        }
                    }
                    reject({ res: res });
                }
            })
            .catch(error => {
                if (!noToast) {
                    if (error.response && error.response.status) {
                        switch (error.response.status) {
                            case 404:
                                vue && vue.$toast(`错误代码404`);
                                break;
                            case 502:
                                vue && vue.$toast(`服务器正在升级,请稍后再试`);
                                break;
                            case 504:
                                vue && vue.$toast(`网络已断开`);
                                break;
                            default:
                                vue && vue.$toast(`请求服务异常,请稍后再试（${error.response.status}）`);
                                break;
                        }
                    }
                }
                if (!noLoading) {
                    vue && vue.$loaded();
                }
                reject({ error: error });
            });
    });
};

let $get = function (restKey, join, options, noLoading, noToast, vue) {
    if (typeof restKey === "string") {
        restKey = ["default", restKey];
    }
    let projectConfig = project.projectConfig[restKey[0]];
    let url = join ? urls[restKey[1]].url + "/" + join : urls[restKey[1]].url;
    gioTrack(restKey[1], url);
    return fetch("get", projectConfig.baseURL + (projectConfig.rootPath ? "/" + projectConfig.rootPath : ""), url, null, options, noLoading, noToast, vue);
};

let $post = function (restKey, params, join, options, noLoading, noToast, vue) {
    if (typeof restKey === "string") {
        restKey = ["default", restKey];
    }
    let projectConfig = project.projectConfig[restKey[0]];
    let url = join ? urls[restKey[1]].url + "/" + join : urls[restKey[1]].url;
    gioTrack(restKey[1], url, params);
    return fetch("post", projectConfig.baseURL + (projectConfig.rootPath ? "/" + projectConfig.rootPath : ""), url, params, options, noLoading, noToast, vue);
};

let gioTrack = (restKey, url, params) => {
    let urlObj = JSON.parse(JSON.stringify(urls[restKey]));
    if (urlObj.ignore) return;
    urlObj.url = url;
    if (!urlObj.ignoreParams && params) {
        urlObj.params = params;
    }
    // gio && gio("track", "action", { name: urlObj.name });
};

export { fetch, $get, $post };
