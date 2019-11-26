<template>
    <div class="index"></div>
</template>
<script>
import forward from "./../mixin/forward.js";
export default {
    mixins: [forward],
    data() {
        return {
            fail: {
                auth: false,
                login: false
            }
        };
    },
    created() {
        // 开始登录校验
        window.intercept = true;
        this.auth();
    },
    methods: {
        // TODO 检查登录
        // token有效 forward(true)
        // token有效 forward(false)
        auth() {
            this.forward(false);
        }
    }
};
</script>
<style lang="less" scoped>
</style>