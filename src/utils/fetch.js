import project from "../../config/project/project.env";
import urls from "./../utils/urls";

import axios from "axios";
import { STRING } from "./constants";

import Loading from "@yy/yy-loading";

axios.defaults.headers["x-requested-with"] = "XMLHttpRequest";

let fetch = function (method, baseURL, url, data, options, noLoading, noToast, vue) {
    return new Promise((resolve, reject) => {
        options.method = method;
        options.baseURL = baseURL;
        options.url = url;
        options.data = data;
        options.headers["x-token"] = localStorage.get(STRING.TOKEN);
        if (!noLoading) {
            Loading.$loading();
        }
        axios(options)
            .then(data => {
                let res = data.data;
                if (!noLoading) {
                    Loading.$loaded();
                }
                if (res.code == 0) {
                    if (!options.raw && (res.data === null || res.data === undefined)) {
                        resolve({});
                    } else {
                        resolve(res.data);
                    }
                } else {
                    if (res.code == 999 && vue.$route.name != "index" && vue.$route.name != "login") {
                        sessionStorage.setItem("$path", vue.$route.fullPath);
                        vue && vue.$to({ name: "login" });
                    } else {
                        if (!noToast) {
                            vue && vue.$yyToast.show(res.message);
                        }
                    }
                    reject();
                }
            })
            .catch(error => {
                if (!noToast) {
                    if (error.response && error.response.status) {
                        switch (error.response.status) {
                            case 404:
                                vue && vue.$yyToast.show(`错误代码404`);
                                break;
                            case 502:
                                vue && vue.$yyToast.show(`服务器正在升级,请稍后再试`);
                                break;
                            case 504:
                                vue && vue.$yyToast.show(`网络已断开`);
                                break;
                            default:
                                vue && vue.$yyToast.show(`请求服务异常,请稍后再试（${error.response.status}）`);
                                break;
                        }
                    }
                }
                if (!noLoading) {
                    Loading.$loaded();
                }
                reject();
            });
    });
};

let $get = function (restKey, join, options, noLoading, noToast, vue) {
    let { baseURL, url, ops } = fetchObj(restKey, join, options);
    return fetch("get", baseURL, url, null, ops, noLoading, noToast, vue);
};

let $post = function (restKey, params, join, options, noLoading, noToast, vue) {
    let { baseURL, url, ops } = fetchObj(restKey, join, options);
    return fetch("post", baseURL, url, params, ops, noLoading, noToast, vue);
};

let $put = function (restKey, join, params, options, noLoading, noToast, vue) {
    let { baseURL, url, ops } = fetchObj(restKey, join, options);
    return fetch("put", baseURL, url, params, ops, noLoading, noToast, vue);
};

let $delete = function (restKey, join, params, options, noLoading, noToast, vue) {
    let { baseURL, url, ops } = fetchObj(restKey, join, options);
    return fetch("delete", baseURL, url, params, ops, noLoading, noToast, vue);
};

let fetchObj = function (restKey, join, options = {}) {
    if (typeof restKey === "string") {
        restKey = ["default", restKey];
    }
    let projectConfig = project.projectConfig[restKey[0]];
    let baseURL = projectConfig.baseURL + "/" + projectConfig.rootPath;
    let url = urls[restKey[1]].url + (join ? "/" + join : "");
    let ops = Object.assign({ headers: {} }, options);
    return { baseURL, url, ops };
};

export { fetch, $get, $post, $put, $delete };
