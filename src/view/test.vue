<template>
    <ui-layout>
        <ui-head slot="top" title="测试" />
        <div>测试页面</div>
        <div>
            <button @click="$to({name:'home'})">再去首页，重新加载</button>
        </div>
        <router-view />
    </ui-layout>
</template>

<script>
export default {
    data() {
        return { msg: "测试" };
    },
    created() {},
    methods: {}
};
</script>

<style lang="less" scoped>
</style>
