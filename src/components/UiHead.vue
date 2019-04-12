<template>
    <div class="ui-head" :class="{'transparent':transparent,white:white,'hr-bottom':!noBottom,'no-top':isWx}">
        <template v-if="!allSlot">
            <div class="head-btns">
                <template v-if="!noBack">
                    <a v-if="close" class="head-back" href="close"></a>
                    <div v-else class="head-back" @click="back"></div>
                </template>
                <slot name="left"></slot>
                <div class="head-btns-container"></div>
                <slot name="right"></slot>
            </div>
            <div class="head-title" :class="{'head-title-text':title}">
                <span v-if="title" v-text="title"></span>
                <slot name="title"></slot>
            </div>
        </template>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        title: {},
        transparent: {
            type: Boolean,
            default: false
        },
        backClick: {
            type: Function
        },
        noBack: {
            type: Boolean,
            default: false
        },
        close: {
            type: Boolean,
            default: false
        },
        noBottom: {
            type: Boolean,
            default: false
        },
        allSlot: {
            type: Boolean,
            default: false
        },
        white: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        back() {
            if (this.backClick) {
                this.backClick();
            } else {
                this.$back();
            }
        }
    }
};
</script>

<style lang="less">
@import "../style/variables.less";
.head-height {
    height: @ztl1 + @head-height;
}
.ui-head {
    position: relative;
    z-index: 1;
    // background: @info;
    padding-top: @ztl1;
    &.no-top {
        padding-top: 0;
        &.transparent {
            height: @head-height;
        }
    }
    &.transparent {
        position: absolute;
        width: 100%;
        height: @ztl1 + @head-height;
        &:after {
            content: none;
        }
    }
    &.white {
        background: white;
        .photo-btn {
            display: none;
        }
    }
    .slot-head {
        display: flex;
    }
    .head-title {
        height: @head-height;
        &.head-title-text {
            width: 100%;
            line-height: @head-height;
            text-align: center;
            font-size: 18px;
            color: @info;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .head-title-line1 {
            text-align: center;
            font-size: 14px;
            color: #333;
        }
        .head-title-line2 {
            text-align: center;
            font-size: 10px;
            color: #333;
        }
    }
    .head-btns {
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: @head-height;
        cursor: pointer;
    }
    .head-back {
        width: 35px;
        background: url("../assets/img/Path@2x.png") no-repeat center;
        background-size: 9px 17px;
        cursor: pointer;
    }
    .btn-search {
        width: 35px;
        background: url("../assets/img/Combined Shape@2x.png") no-repeat center;
        background-size: 16px auto;
        cursor: pointer;
    }
    .btn-more {
        width: 35px;
        background: url("../assets/img/More Icon@2x.png") no-repeat center;
        background-size: 4px auto;
        cursor: pointer;
    }
    .btn-text {
        padding: 0 10px;
        line-height: @head-height;
        color: @info;
        cursor: pointer;
    }
    .head-btns-container {
        flex: 1;
    }
    .btn-msg {
        position: relative;
        width: 40px;
        height: @head-height;
        background: url("../assets/img/消息 信封@2x.png") no-repeat center;
        background-size: auto 17px;
        cursor: pointer;
        > .no-read {
            position: absolute;
            top: 6px;
            right: 5px;
            width: 14px;
            height: 14px;
            line-height: 14px;
            text-align: center;
            border-radius: 100%;
            background: red;
            > span {
                display: block;
                color: white;
                font-size: 8px;
                &.jia10 {
                    transform: scale(0.7);
                }
                &.jia100 {
                    transform: scale(0.5);
                    margin-right: 3px;
                }
            }
        }
    }
    .btn-setting {
        width: 40px;
        height: @head-height;
        background: url("../assets/img/ic_setttings@2x.png") no-repeat center;
        background-size: auto 20px;
        cursor: pointer;
    }
    .btn-kefu {
        width: 40px;
        height: @head-height;
        margin-left: 5px;
        background: url("../assets/img/客服@2x.png") no-repeat center;
        background-size: auto 20px;
        cursor: pointer;
    }
    .photo-btn {
        width: 100px;
        height: @head-height;
        background: url("../assets/img/Group@2x 2 2.png") no-repeat center;
        background-size: auto 15px;
        > input {
            width: 100%;
            height: 100%;
            opacity: 0;
        }
        cursor: pointer;
    }
}
</style>
