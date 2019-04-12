/**
 * Created by kuo zi on 2016/10/18.
 */
import Vue from "vue";
import axios from "axios";
import store from "store";

import project from "../../config/project/project.env";

import urls from "./../utils/urls";
import { fetch, $get, $post } from "../utils/fetch";

import UiLayout from "../components/UiLayout.vue";
import UiHead from "../components/UiHead.vue";
import UiContainer from "../components/UiContainer.vue";
import UiNomore from "../components/UiNomore.vue";
import UiImg from "../components/UiImg.vue";
import { titles } from "../router/routerConfig";

// 全局混合
Vue.mixin({
    components: { UiLayout, UiHead, UiContainer, UiNomore, UiImg },
    data() {
        return {
            isWx: navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger",
            PageSize: 15,
            Store: store,
            login: window.login
        };
    },
    created() {
        try {
            let routername = this.$route.name;
            document.title = titles[routername] ? titles[routername] : titles.default;
        } catch (error) {}
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
        /**
         * [$back description]返回事件
         * @return {[type]} [description]
         */
        $back(step) {
            this.$store.commit("transition", "pop-out");
            if (this.$route.query.back) {
                this.$to({ name: this.$route.query.back });
            } else {
                window.history.go(Number(step) ? step : -1);
            }
            setTimeout(() => {
                this.$store.commit("transition", "pop-in");
            }, 100);
        },
        $to(p) {
            this.$router.push(p);
        },
        $close() {
            if (typeof pbE != "undefined" && pbE.SYS()) {
                window.location.href = "./close";
            } else {
                window.history.go(-1);
            }
        },
        $loading() {
            this.$store.commit("loading");
        },
        $loaded() {
            this.$store.commit("loaded");
        },
        /**
         * [$encodeURI description] encode url 默认encode当前url
         * @param  {[type]} url [description]
         * @return {[type]}     [description]
         */
        $encodeURI(url) {
            return window.encodeURIComponent(url ? url : window.location);
        },
        /**
         * [$decodeURI description] decode url
         * @param  {[type]} url [description]
         * @return {[type]}     [description]
         */
        $decodeURI(url) {
            return window.decodeURIComponent(url);
        },
        $getParam(key, url) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
            var r = (url ? url : window.location).search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        onBottomLoaded(key) {
            var $loadmore = this.$refs[key];
            $loadmore.bottomStatus = "pull";
            $loadmore.bottomDropped = false;
            this.$nextTick(() => {
                $loadmore.translate = 0;
            });
            if (!$loadmore.bottomAllLoaded && !$loadmore.containerFilled) {
                $loadmore.fillContainer();
            }
        },
        pageLoading(text) {
            this.lastIndicator = new Date().getTime();
            this.$indicator.open({
                text: text ? text : "加载中...",
                spinnerType: "fading-circle"
            });
            setTimeout(() => {
                if (new Date().getTime() - this.lastIndicator >= 1000 * 10) {
                    this.pageLoaded();
                }
            }, 1000 * 10);
        },
        pageLoaded() {
            this.$indicator.close();
        },
        loadMoreLoaded(pageNo, ref = "loadmore") {
            let time = 0;
            let interval = setInterval(() => {
                if (this.$refs[ref] || time >= 30) {
                    clearInterval(interval);
                    if (pageNo == 1) {
                        this.$refs[ref].onTopLoaded();
                    } else {
                        this.$refs[ref].onBottomLoaded();
                    }
                }
                time++;
            }, 100);
        }
    },
    beforeDestroy() {
        // this.$loaded ? this.$loaded() : null;
        // this.$loaded ? this.$loaded() : null;
        // this.$indicator ? this.$indicator.close() : null;
    }
});
