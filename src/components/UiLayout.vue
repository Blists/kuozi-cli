<template>
    <div class="ui-layout" :class="{full}">
        <div class="ui-layout-top">
            <slot name="top" />
        </div>
        <UiContainer class="ui-layout-container" :no-bs="noBs" :flex="flex">
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
        }
    },
    data() {
        return {};
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
