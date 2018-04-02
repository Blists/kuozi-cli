/**
 * Created by kuo zi on 2016/10/12.
 */
import Vue from "vue";
import store from "./../store/store";
import Router from "vue-router";

// 是否登录控制
import { login, needlogin, nologin } from "./loginIntercept";

Vue.use(Router);

let { routes } = require("./router." + (process.env.SPLIT ? "split" : "full") + ".js");

let routesArray = [];
let routesObj2Array = (array, obj) => {
    for (let k in obj) {
        if (obj[k].children) {
            let children = [];
            routesObj2Array(children, obj[k].children);
            obj[k].children = children;
        }
        // 配置默认login
        obj[k].meta = obj[k].met || {};
        obj[k].meta.login = login;
        // console.log(login);
        // 配置需要登录页面
        for (let page of needlogin) {
            if (k == page) {
                obj[k].meta = obj[k].met || {};
                obj[k].meta.login = true;
                break;
            }
        }
        // 配置不需要登录页面
        for (let page of nologin) {
            if (k == page) {
                obj[k].meta = obj[k].met || {};
                obj[k].meta.login = false;
                break;
            }
        }
        array.push(obj[k]);
    }
};
routesObj2Array(routesArray, routes);

let router = new Router({
    // history模式需要后台支持
    // mode: "history",
    // scrollBehavior: () => ({ y: 0 }),
    routes: routesArray
});

let back = false;
window.addEventListener("popstate", e => {
    back = true;
});

//路由跳转钱操作
router.beforeEach((to, form, next) => {
    setTimeout(() => {
        if (back) {
            store.commit("transition", "pop-out");
        }
        // 登录过滤
        if (window.intercept && to.meta.login && !window.login) {
            next({ name: "login", query: { path: to.fullPath } });
        } else {
            next();
        }
        back = false;
    }, 10);
});

export default router;
