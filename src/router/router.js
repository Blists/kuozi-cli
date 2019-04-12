/**
 * Created by kuo zi on 2016/10/12.
 */
import Vue from "vue";
import Router from "vue-router";

// 是否登录控制
import { dynamic, login, needlogin, nologin } from "./routerConfig";

Vue.use(Router);

// let { routes } = require("./router." + (process.env.SPLIT ? "split" : "full") + ".js");
// let { routes } = process.env.ASYNCROUTE ? process.env.RO2UTECONFIG : require("./router.full.js");
// let routes = process.env.RO2UTECONFIG;
let routes = ROUTECONFIG;
let routesArray = [];
let routesObj2Array = (array, obj) => {
    for (let k in obj) {
        if (obj[k].children) {
            let children = [];
            routesObj2Array(children, obj[k].children);
            obj[k].children = children;
        }
        // 配置通配符匹配
        if (dynamic[k]) {
            obj[k].path = obj[k].path + dynamic[k];
        }
        // 配置默认login
        obj[k].meta = obj[k].met || {};
        obj[k].meta.login = login;
        // 配置需要登录页面
        if (needlogin[k]) {
            obj[k].meta = obj[k].met || {};
            obj[k].meta.login = true;
        }
        // 配置不需要登录页面
        if (nologin[k]) {
            obj[k].meta = obj[k].met || {};
            obj[k].meta.login = false;
        }
        if (obj[k].name == "article") {
            array.push({
                path: "/",
                meta: obj[k].meta,
                component: obj[k].component
            });
        }
        array.push(obj[k]);
    }
};
routesObj2Array(routesArray, routes);
routesArray.push({
    path: "/",
    redirect: "/home"
});

let router = new Router({
    // history模式需要后台支持
    // mode: "history",
    // scrollBehavior: () => ({ y: 0 }),
    routes: routesArray
});

// 路由跳转钱操作
router.beforeEach((to, form, next) => {
    setTimeout(() => {
        // 登录过滤
        if (window.intercept && to.meta.login && !window.login) {
            sessionStorage.setItem("$path", to.fullPath);
            next({ name: "login" });
        } else {
            next();
        }
    }, 10);
});

export default router;
