<template>
    <ui-layout class="index" />
</template>
<script>
import forward from "./../mixin/forward.js";
import { login } from "../router/routerConfig.js";
export default {
    mixins: [forward],
    data() {
        return {};
    },
    created() {
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
        },
    },
};
</script>
<style lang="less" scoped>
@import "./../style/variables.less";
.index {
    // background: @gray url(./../assets/img/logo.png) no-repeat center 150px;
}
</style>
