/**
 * Created by kuo zi on 2016/10/12.
 */
import Vue from "vue";
import Router from "vue-router";

import index from "./../view/index.vue";
import Login from "./../view/login.vue";
import home from "./../view/home";

Vue.use(Router);

let router = new Router({
    // history模式需要后台支持
    // mode: "history",
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
            name: "index",
            path: "/index",
            component: index,
            meta: { login: false }
        },
        {
            name: "login",
            path: "/login",
            component: Login,
            meta: { login: false }
        },
        {
            name: "home",
            path: "/home",
            component: home,
            meta: { login: true }
        }
    ]
});

// 路由跳转前操作
router.beforeEach((to, form, next) => {
    if (to && to.name === "index") {
        sessionStorage.setItem("$forwardReplace", true);
        next();
    } else {
        if (form && form.name) {
            // 登录过滤
            if (to.meta.login && !window.login) {
                sessionStorage.setItem("$path", to.fullPath);
                sessionStorage.setItem("$forwardReplace", true);
                next({ name: "login" });
            } else {
                next();
            }
        } else {
            // 刷新页面
            let path = window.location.hash.replace("#", "");
            if (path != "/" && ! path.match("/login") && ! path.match("/index")) {
                sessionStorage.setItem("$path", path);
            }
            next({ name: "index" });
        }
    }
});

export default router;
