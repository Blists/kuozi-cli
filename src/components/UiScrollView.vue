<template>
    <VanPullRefresh class="scroll-view-wrap" v-model="refreshing" @refresh="refresh" :disabled="disabledRefresh || noRefresh">
        <div ref="scrollView" class="scroll-view" :class="{ 'flex-scroll-view': flex }" @scroll="scroll">
            <slot></slot>
        </div>
    </VanPullRefresh>
</template>

<script>
import { PullRefresh } from "vant";
export default {
    props: {
        flex: {
            type: Boolean,
            default: false,
        },
        disabledRefresh: {
            type: Boolean,
            default: false,
        },
    },
    components: { VanPullRefresh: PullRefresh },
    data() {
        return {
            scrollTop: 0,
            loading: false,
            finished: false,
            refreshing: false,
            noRefresh: true,
        };
    },
    created() {
        if (this._events.refresh) {
            this.noRefresh = false;
        }
    },
    activated() {
        if (this.$refs.scrollView) {
            this.$refs.scrollView.scrollTop = this.scrollTop;
        }
    },
    deactivated() {
        if (this.$refs.scrollView) {
            this.scrollTop = this.$refs.scrollView.scrollTop;
        }
    },
    methods: {
        scroll(e) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.$emit("scroll", e);
            }, 100);
        },
        refresh() {
            this.$emit("refresh");
        },
        refreshed() {
            this.refreshing = false;
        },
    },
};
</script>

<style lang="less">
.scroll-view-wrap {
    flex: 1;
    overflow: hidden;
    .scroll-view {
        height: 100%;
        overflow: auto;
        &.flex-scroll-view {
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
    }
}
</style>