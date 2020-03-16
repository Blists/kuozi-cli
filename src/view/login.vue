<template>
    <ui-layout>
        <ui-head slot="top" title="登录" no-back />
        <button @click="login">登录</button>
    </ui-layout>
</template>

<script>
import forward from "../mixin/forward";
export default {
    mixins: [forward],
    methods: {
        login() {
            this.$loading();
            setTimeout(() => {
                sessionStorage.setItem("$forwardReplace", true);
                this.forward({}, "token");
            }, 300);
        }
    }
};
</script>

<style>
</style>
