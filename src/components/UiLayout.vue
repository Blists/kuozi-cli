<template>
    <div class="ui-layout" :class="{full:full}">
        <div class="ui-layout-container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        full: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="less">
.ui-layout {
    height: 100%;
    background: white;
    .ui-layout-container {
        display: flex;
        flex-direction: column;
        height: 100%;
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
