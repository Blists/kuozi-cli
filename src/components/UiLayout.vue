<template>
    <div class="ui-layout">
        <div class="ui-layout-top">
            <slot name="top" />
        </div>
        <UiScrollView ref="scrollView" @scroll="scroll" @refresh="refresh" :disabled-refresh="noRefresh" :flex="flex">
            <slot></slot>
        </UiScrollView>
        <div class="ui-layout-bottom">
            <slot name="bottom" />
        </div>
    </div>
</template>

<script>
import UiScrollView from "./UiScrollView.vue";
export default {
    components: { UiScrollView },
    props: {
        flex: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            noRefresh: true,
        };
    },
    created() {
        if (this._events.refresh) {
            this.noRefresh = false;
        }
    },
    methods: {
        scroll(e) {
            this.$emit("scroll", e);
        },
        refresh() {
            this.$emit("refresh");
        },
        refreshed() {
            this.$refs.scrollView.refreshed();
        },
    },
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
}
</style>
