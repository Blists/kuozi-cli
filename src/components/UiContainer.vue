<template>
    <div ref="scroll" class="ui-container">
        <div class="ui-container" :class="{'no-scroll':noBs,'flex-container':flex}">
            <slot />
        </div>
    </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
    props: {
        noBs: {
            type: Boolean,
            default: false
        },
        flex: {
            type: Boolean,
            default: false
        }
    },
    created() {
        if (this.noBs || this.flex) {
            //
        } else {
            this.$nextTick(() => {
                this.$refs.scroll &&
                    new BScroll(this.$refs.scroll, {
                        click: true,
                        mouseWheel: true
                    });
            });
        }
    }
};
</script>

<style lang="less">
.ui-container {
    overflow: hidden;
    .ui-container {
        &.no-scroll {
            height: 100%;
            overflow: auto;
        }
        &.flex-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }
    }
}
</style>