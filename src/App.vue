<template>
    <div class="app">
        <transition :name="transitionName">
            <vue-page-stack>
                <router-view class="app-router-view" />
            </vue-page-stack>
        </transition>
    </div>
</template>
<script>
import { STRING } from "./utils/constants";
import { toNoTransitionPage } from "./router/routerConfig";
export default {
    data() {
        return { transitionName: "forward" };
    },
    watch: {
        $route(to, from) {
            this.transitionName = (from.name && from.name != "index" && (!toNoTransitionPage[to.name] || to.params[STRING.VNK + "-dir"] === "back") && to.params && to.params[STRING.VNK + "-dir"]) || "";
        }
    }
};
</script>
<style lang="less">
@import "./style/variables.less";
// 页面过渡时间
@time: 500ms;
.app {
    position: relative;
    height: 100%;
    overflow: hidden;
}
.app-router-view {
    position: absolute;
    width: 100%;
}
.forward-enter-active,
.forward-leave-active,
.back-enter-active,
.back-leave-active {
    transition: opacity @time, transform @time;
}
.forward-enter,
.back-leave-active {
    opacity: 0.5;
    transform: translateX(100%);
}
.forward-leave-active,
.back-enter {
    opacity: 0.5;
    transform: translateX(-100%);
}
</style>