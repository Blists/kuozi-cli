<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    created() {
        this.$store.commit("spinner", false);
        let path = window.location.hash.replace("#", "");
        if (path.match("/login") || path.match("/index")) {
            sessionStorage.setItem("$path", "");
        }
        sessionStorage.setItem("$path", path);
        this.$router.replace({ name: "index" });
    },
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
