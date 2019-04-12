/**
 * Created by kuo zi on 2016/10/19.
 */
import Vue from "vue";
import Vuex from "vuex";
import storage from "store";
import socket from "./modules/socket";
import socketListener from "./plugins/socketListener";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //加载中
        spinner: true,
        loading: false,
        // 过渡模式
        transition: false,
        showTaber: true
    },
    mutations: {
        spinner(state, param) {
            state.spinner = param;
        },
        loading(state) {
            state.loading = true;
        },
        loaded(state) {
            state.loading = false;
        },
        transition(state, p) {
            state.transition = p;
        },
        showTaber(state, p) {
            state.showTaber = p;
        }
    },
    actions: {},
    getters: {},
    modules: { socket },
    plugins: [socketListener()]
});

export default store;
