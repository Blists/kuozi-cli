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
    // 登录过滤
    if (window.intercept && to.meta.login && !window.login) {
        sessionStorage.setItem("$path", to.fullPath);
        next({ name: "login", query: { forwardReplace: true } });
    } else {
        next();
    }
});

export default router;
