<template>
    <ui-layout>
        <ui-head slot="top" title="登录" no-back></ui-head>
        <button @click="login">登录</button>
    </ui-layout>
</template>

<script>
import forward from "../mixin/forward";
export default {
    mixins: [forward],
    methods: {
        login() {
            this.forward({}, "token");
        }
    }
};
</script>

<style>
</style>
