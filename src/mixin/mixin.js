/**
 * Created by kuo zi on 2016/10/18.
 */
import Vue from "vue";
import store from "store";
import { getParam } from "@yy/yy-tools";
import Loading from "@yy/yy-loading";

import { fetch, $get, $post, $put, $delete } from "../utils/fetch";

import UiLayout from "../components/UiLayout.vue";
import UiHead from "../components/UiHead.vue";
import { STRING } from "../utils/constants";

Vue.component("ui-layout", UiLayout);
Vue.component("ui-head", UiHead);

// 全局混合
Vue.mixin({
    data() {
        return {
            PageSize: 15,
            Store: store
        };
    },
    methods: {
        /**
         *get请求
         * @param restKey [项目索引,url键]
         * @param join url拼接
         */
        $get(restKey, join, options, noLoading, noToast) {
            return $get(restKey, join, options, noLoading, noToast, this);
        },
        $getDirect(url, options, noLoading, noToast) {
            return fetch("get", "", url, null, options, noLoading, noToast, this);
        },
        /**
         *post请求
         * @param restKey [项目索引,url键]
         * @param params 请求参数
         */
        $post(restKey, params, join, options, noLoading, noToast) {
            return $post(restKey, params, join, options, noLoading, noToast, this);
        },
        $postDirect(url, params, options, noLoading, noToast) {
            return fetch("post", "", url, params, options, noLoading, noToast, this);
        },
        $put(restKey, join, params, options, noLoading, noToast) {
            return $put(restKey, join, params, options, noLoading, noToast, this);
        },
        $putDirect(url, params, options, noLoading, noToast) {
            return fetch("put", "", url, params, options, noLoading, noToast, this);
        },
        $del(restKey, join, params, options, noLoading, noToast) {
            return $delete(restKey, join, params, options, noLoading, noToast, this);
        },
        $delDirect(url, params, options, noLoading, noToast) {
            return fetch("delete$delete", "", url, params, options, noLoading, noToast, this);
        },
        $back() {
            this.$router.back();
        },
        $to(p, options = {}) {
            if (options.replace) {
                this.$router.replace(p);
            } else {
                this.$router.push(p);
            }
        },
        $loading() {
            Loading.$loading({ color: STRING.INFO });
        },
        $loaded() {
            Loading.$loaded();
        },
        $getParam(key, url) {
            return getParam(key, url);
        }
    }
});
