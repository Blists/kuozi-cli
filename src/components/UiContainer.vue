<template>
    <div class="ui-container" @scroll="scroll">
        <slot></slot>
    </div>
</template>

<script>
export default {
    methods: {
        scroll($event) {
            this.$emit("scroll", $event);
        }
    }
};
</script>

<style lang="less">
.ui-container {
    flex: 1;
    overflow: auto;
}
</style>
