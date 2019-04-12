<template>
    <ui-layout no-home>
        <ui-container>
            <router-view></router-view>
        </ui-container>
        <ui-taber></ui-taber>
    </ui-layout>
</template>

<script>
import UiTaber from "../components/UiTaber.vue";
export default {
    components: { UiTaber },
    created() {
        if (this.$route.name == "home") {
            this.$router.replace({ name: "article" });
        }
    }
};
</script>

<style lang="less">
</style>
