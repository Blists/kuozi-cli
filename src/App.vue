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
export default {
    data() {
        return { transitionName: "forward" };
    },
    created() {
        let path = window.location.hash.replace("#", "");
        if (path.match("/login") || path.match("/index")) {
            sessionStorage.setItem("$path", "");
        }
        sessionStorage.setItem("$path", path);
    },
    mounted() {
        this.$nextTick(() => {
            this.$to({ name: "index" });
        });
    },
    watch: {
        $route(to, from) {
            this.transitionName = (from.name && to.params && to.params["vnk-dir"]) || "";
        }
    },
    computed: {
        transition() {
            return this.$store.state.transition;
        },
        spinner() {
            return this.$store.state.spinner;
        },
        loading() {
            return this.$store.state.loading;
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
    transition: opacity @time, transform @time;
    width: 100%;
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