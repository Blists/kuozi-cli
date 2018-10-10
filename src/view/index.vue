<template>
    <div></div>
</template>
<script>
import forward from "./../mixin/forward.js";
export default {
    mixins: [forward],
    data() {
        return {
            auth: 0
        };
    },
    created() {
        window.intercept = true;
        this.forward();
        // let self = this;
        //登录状态检测
        // this.$get("auth")
        //     .then(res => {
        //         window.login = true;
        //     })
        //     .catch(() => {
        //         this.forward();
        //     });
    }
};
</script>
<style lang="less" scoped>
</style>
