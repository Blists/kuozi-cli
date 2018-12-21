<template>
    <div class="index"></div>
</template>
<script>
import forward from "./../mixin/forward.js";
import { login } from "../router/routerConfig.js";
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
        if (login) {
            this.auth();
        } else {
            this.forward();
        }
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
