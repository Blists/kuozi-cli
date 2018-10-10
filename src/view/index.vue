<template>
    <div class="full-height">

    </div>
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
@import "../style/variables.less";
.full-height {
    background: white;
}

.auth {
    margin-top: 80%;
    text-align: center;
    color: @info;
    &.auth-fail {
        color: black;
    }
}
</style>
