<template>
    <div class="ui-layout" :class="{full}">
        <div class="ui-layout-top">
            <slot name="top" />
        </div>
        <div ref="scroll" class="ui-layout-container">
            <div class="scroll-container" :class="{'no-scroll':noScroll,'flex-container':flex}">
                <slot />
            </div>
        </div>
        <div class="ui-layout-bottom">
            <slot name="bottom" />
        </div>
    </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
    props: {
        full: {
            type: Boolean,
            default: false
        },
        noScroll: {
            type: Boolean,
            default: false
        },
        flex: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    created() {
        if (this.noScroll || this.flex) {
            //
        } else {
            this.$nextTick(() => {
                this.$refs.scroll && new BScroll(this.$refs.scroll, {
                    click: true,
                    mouseWheel: true
                });
            });
        }
    }
};
</script>

<style lang="less">
.ui-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .ui-layout-container {
        flex: 1;
        overflow: hidden;
        .scroll-container {
            &.no-scroll {
                height: 100%;
            }
            &.flex-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                overflow: hidden;
            }
        }
    }
    &.full {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
