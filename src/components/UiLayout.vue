<template>
    <div class="ui-layout" :class="{full}">
        <div class="ui-layout-top">
            <slot name="top" />
        </div>
        <UiContainer
            ref="scroll"
            class="ui-layout-container"
            :no-bs="noBs"
            :flex="flex"
            :pull-up-load="pullUpLoad"
            :pull-down-refresh="pullDownRefresh"
            @pull-up="pullUp"
            @pull-down="pullDown"
        >
            <slot />
        </UiContainer>
        <div class="ui-layout-bottom">
            <slot name="bottom" />
        </div>
    </div>
</template>

<script>
import UiContainer from "./UiContainer";
export default {
    components: { UiContainer },
    props: {
        full: {
            type: Boolean,
            default: false
        },
        noBs: {
            type: Boolean,
            default: false
        },
        flex: {
            type: Boolean,
            default: false
        },

        pullUpLoad: {
            type: Boolean,
            default: false
        },
        bottomText: {},
        bottomLoadingText: {},
        bottomNoMoreText: {},
        pullDownRefresh: {
            type: Boolean,
            default: false
        },
        topText: {},
        topLoadingText: {}
    },
    data() {
        return {};
    },
    methods: {
        refresh() {
            this.$refs.scroll.refresh();
        },
        uploaded(nomore) {
            this.$refs.scroll.uploaded(nomore);
        },
        pullUp() {
            this.$emit("pull-up");
        },
        downloaded() {
            this.$refs.scroll.downloaded();
        },
        pullDown() {
            this.$emit("pull-down");
        }
    }
};
</script>

<style lang="less">
@import "./../style/variables";
.ui-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: @hr;
    .ui-layout-container {}
    &.full {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
