<template>
    <div class="ui-nomore" :class="{center:type=='center'&&!nomore,bottom:type=='bottom'||nomore}" v-if="show||nomore">
        <div class="ui-nomore-msg" v-if="msg" v-text="nomore?nomoreText:msg"></div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        value: {},
        type: {
            type: String,
            default: "bottom"
        },
        nomore: {
            type: Boolean,
            default: false
        },
        nomoreText: {
            default: "没有更多了~"
        },
        msg: {
            type: [String, Boolean],
            default: "暂无"
        }
    },
    data() {
        return {
            show: false
        };
    },
    created() {},
    watch: {
        value() {
            if (!this.value || Object.values(this.value).length == 0) {
                this.show = true;
            }
        }
    }
};
</script>

<style lang="less">
.ui-nomore {
    &.center {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
    }
    &.bottom {
        height: 80px;
        line-height: 80px;
    }
    .ui-nomore-msg {
        text-align: center;
        font-size: 13px;
        color: #999;
    }
}
</style>
