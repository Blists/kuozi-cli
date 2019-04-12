<template>
    <div class="ui-layout" :class="{full:full}">
        <div class="ui-layout-container">
            <slot></slot>
        </div>
        <div v-if="!noHome" class="btn-home" @click="$to({name:'article'})">首页</div>
    </div>
</template>

<script>
export default {
    props: {
        full: {
            type: Boolean,
            default: false
        },
        noHome: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return { show: false };
    },
    // created() {
    //     if (!this.noHome && this.$route.query.back && this.$route.query.back == "article") {
    //         this.show = true;
    //     }
    // }
};
</script>

<style lang="less">
@import "../style/variables.less";
.ui-layout {
    height: 100%;
    overflow: hidden;
    background: white;
    // position: relative;
    .ui-layout-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
    }
    &.full {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
    }
}
.btn-home {
    position: fixed;
    z-index: 99;
    bottom: 95px;
    right: 25px;
    width: 48px;
    height: 48px;
    background: #97c2ef url("../assets/img/home.png") no-repeat center 6px;
    background-size: auto 20px;
    border-radius: 100%;
    box-shadow: 0px 6px 40px 0px #b2c5e6;
    padding-top: 24px;
    text-align: center;
    font-size: 10px;
    color: white;
}
@media screen and (min-width: @max-width) {
    .ui-layout {
        &.full {
            width: @max-width;
            left: 50%;
            margin-left: -@max-width / 2;
        }
    }
    
    .btn-home {
        right: 50%;
        margin-right: 36 - @max-width / 2;
    }
}
</style>
