<template>
    <div class="ui-container" :class="{hidden:(hidden||hide)}" @scroll="scroll">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        name: {},
        hidden: { type: Boolean, default: false }
    },
    methods: {
        scroll($event) {
            $event.stopPropagation();
            $event.preventDefault();
        }
    },
    computed: {
        hide() {
            return this.name && this.$route.path.match("/" + this.name) && this.$route.name != this.name;
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
}
.ui-container {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    &.hidden {
        overflow: hidden;
    }
}
</style>
