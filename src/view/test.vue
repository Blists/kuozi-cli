<template>
    <ui-layout>
        <ui-head title="测试"></ui-head>
        <ui-container>
            <div>测试页面</div>
            <button @click="$to({name:'home'})">首页</button>
            <button @click="$to({name:'testDetail'})">部分子路由testDetail</button>
            <button @click="$to({name:'testDetail1'})">全屏子路由testDetail1</button>
            <router-view></router-view>
        </ui-container>
    </ui-layout>
</template>

<script>
export default {
    data() {
        return {
            msg: "测试"
        };
    },
    created() {},
    methods: {}
};
</script>

<style lang="less" scoped>

</style>
