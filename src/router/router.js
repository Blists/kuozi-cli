/**
 * Created by kuo zi on 2016/10/12.
 */
import Vue from "vue";
import Router from "vue-router";
import Loading from "@yy/yy-loading";

// 是否登录控制
import { dynamic, login, needlogin, nologin } from "./routerConfig";

import routes from "./routers";

Vue.use(Router);

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
        obj[k].meta = obj[k].meta || {};
        obj[k].meta.login = login;
        // 配置需要登录页面
        if (needlogin[k]) {
            obj[k].meta = obj[k].meta || {};
            obj[k].meta.login = true;
        }
        // 配置不需要登录页面
        if (nologin[k]) {
            obj[k].meta = obj[k].meta || {};
            obj[k].meta.login = false;
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
    // scrollBehavior: (to, from, savedPosition) => {
    //     console.log(savedPosition);
    //     setTimeout(() => {
    //         savedPosition = savedPosition || { x: 0, y: 0 };
    //         window.scrollTo(savedPosition.x, savedPosition.y);
    //     }, 250);
    // },
    routes: routesArray
});

// 路由跳转钱操作
router.beforeEach((to, form, next) => {
    Loading.$loaded();
    // 登录过滤
    if (window.intercept && to.meta.login && !window.login) {
        sessionStorage.setItem("$path", to.fullPath);
        next({ name: "login" });
    } else {
        next();
    }
});

export default router;