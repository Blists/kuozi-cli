<template>
    <transition :name="noFade?'':'fade'">
        <div class="ui-layer" v-if="show" @click="hide">
            <div class="layer-body" :class="{middle:postion=='middle',left:postion=='left',right:postion=='right',bottom:postion=='bottom',full:full,'ovisible':overflowVisible}" @click.stop=";">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        postion: {
            type: String,
            default: "middle"
        },
        full: {
            type: Boolean,
            default: false
        },
        noFade: {
            type: Boolean,
            default: false
        },
        overflowVisible: {
            type: Boolean,
            default: false
        },
        modalClose: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        hide() {
            if (!this.modalClose) return;
            this.$emit("update:show", false);
            this.$emit("close");
        }
    },
    watch: {
        show: {
            immediate: true,
            handler(val, v) {
                if (this.full && v !== undefined) {
                    this.$store.commit("showTaber", !val);
                }
            }
        }
    }
};
</script>

<style lang="less">
.ui-layer {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 998;
    background: rgba(0, 0, 0, 0.6);
    .layer-body {
        position: absolute;
        max-height: 80%;
        overflow: auto;
        &.ovisible {
            overflow: visible;
        }
        &.full {
            width: 100%;
            height: 100%;
            max-height: 100%;
        }
        &.middle {
            width: 100%;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        &.left {
            position: absolute;
            height: 100%;
            max-height: 100%;
            left: 0;
        }
        &.right {
            position: absolute;
            height: 100%;
            max-height: 100%;
            right: 0;
        }
        &.bottom {
            position: absolute;
            width: 100%;
            bottom: 0;
        }
    }
}
.layer-content {
    margin: 0 50px;
    background: white;
    border-radius: 6px;
    &.overflow-hidden {
        overflow: hidden;
    }
    .layer-question {
        padding: 45px 10px;
        font-size: 16px;
        color: #333;
        text-align: center;
    }
}
.layer-btns {
    display: flex;
    background: white;
    border-radius: 0 0 6px 6px;
    overflow: hidden;
    .layer-btn {
        flex: 1;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 16px;
        border-right: 1px solid #ccc;
        &:last-child {
            border-right: none;
        }
    }
}
.cell-btn {
    height: 60px;
    text-align: center;
    line-height: 60px;
    background: white;
    font-size: 18px;
    color: #666666;
    cursor: pointer;
    &.info {
        color: @info;
    }
    &.del {
        color: #f45574;
    }
    &.bold {
        font-weight: bold;
    }
    &:last-child {
        border-radius: 0 0 6px 6px;
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
    > .layer-body {
        &.left {
            transition: left 0.5s;
        }
        &.right {
            transition: right 0.5s;
        }
        &.bottom {
            transition: bottom 0.5s;
        }
    }
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
    > .layer-body {
        &.left {
            left: -100%;
        }
        &.right {
            right: -100%;
        }
        &.bottom {
            bottom: -100%;
        }
    }
}
</style>
