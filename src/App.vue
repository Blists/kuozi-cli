<template>
    <div class="app">
        <navigation>
            <router-view></router-view>
        </navigation>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    created() {
        sessionStorage.removeItem("VUE_NAVIGATION");
        this.$store.commit("spinner", false);
        let path = window.location.hash.replace("#", "");
        if (path.match("/login") || path.match("/index")) {
            sessionStorage.setItem("$path", "");
        }
        sessionStorage.setItem("$path", path);
        this.$router.replace({ name: "index", query: { forwardReplace: true } });
    },
    methods: {},
    computed: {
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
.app {
    height: 100%;
}
</style>