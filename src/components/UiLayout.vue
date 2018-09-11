<template>
    <div class="ui-layout" :class="{full:full}">
        <div v-if="!flex" ref="top" class="ui-layout-top">
            <slot name="top"></slot>
        </div>
        <div :style="style" class="ui-layout-container" :class="{flex:flex}">
            <slot></slot>
        </div>
        <div v-if="!flex" ref="bottom" class="ui-layout-bottom">
            <slot name="bottom"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        full: {
            type: Boolean,
            default: false
        },
        flex: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            style: {
                paddingTop: 0,
                paddingBottom: 0
            },
            top: {},
            bottom: {}
        };
    },
    mounted() {
        if (this.flex) return;
        this.top = this.$refs.top;
        this.bottom = this.$refs.bottom;
        let config = { attributes: true, characterData: true, childList: true, subtree: true };
        let observer1 = new MutationObserver(this.resizeTop);
        observer1.observe(this.top, config);
        let observer2 = new MutationObserver(this.resizeBottom);
        observer2.observe(this.bottom, config);
        this.resizeTop();
        this.resizeBottom();
    },
    methods: {
        resizeTop() {
            setTimeout(() => {
                this.style.paddingTop = this.top.clientHeight + "px";
            }, 50);
        },
        resizeBottom() {
            setTimeout(() => {
                this.style.paddingBottom = this.bottom.clientHeight + "px";
            }, 50);
        }
    }
};
</script>

<style lang="less">
.ui-layout {
    height: 100%;
    .ui-layout-container {
        &.flex {
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
    }
    .ui-layout-top {
        position: fixed;
        top: 0;
        width: 100%;
    }
    .ui-layout-bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
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
