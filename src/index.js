// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from "vue";
// js工具库 _
import ElementUI from "element-ui";
import "./../element-theme/index.css";

import "./style/style.less";
import router from "./router/router";
import store from "./store/store";
import "./directive/directive";
import "./mixin/mixin";
import "./filter/filter";
import App from "./App";


import VueTaber from "yy-taber";
import tabs from "./router/tab.js";

Vue.use(ElementUI, { size: "small" });

Vue.use(VueTaber);

const vueTaber = new VueTaber({
    tabs,
    persist: true
});

Vue.config.devtools = true;
new Vue({
    el: "#app",
    router,
    taber: vueTaber,
    store,
    render: h => h(App)
});
