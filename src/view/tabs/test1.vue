<template>
    <ui-layout>
        页面传参：{{$tab.params}}
        <input type="text" v-model="msg" placeholder="请输入" />
        随机码：{{random}}
        <div style="height:2000px" />滚动到底部
    </ui-layout>
</template>

<script>
export default {
    data() {
        return {
            msg: "",
            random: Math.random(),
            p1: this.$tab.params.p1
        };
    }
};
</script>

<style>
</style>
