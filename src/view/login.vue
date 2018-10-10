<template>
    <div>
        <div @click="login">登录</div>
    </div>
</template>
<script>
import forward from "./../mixin/forward";
export default {
    mixins: [forward],
    data() {
        return {
            
        }
    },
    methods: {
        login() {
            window.login = true;
            this.forward();
        }
    }
}
</script>
<style lang="less">
</style>
