<template>
    <ui-layout ref="scrollView" flex @refresh="refresh">
        <ui-head slot="top" title="局部滚动整体下拉刷新" />
        <div style="height: 100px">固定在上面的内容</div>
        <div class="list-wrap">
            <div v-for="i in 100" :key="i" class="list">中间滚动区域{{ i }}</div>
        </div>
    </ui-layout>
</template>

<script>
export default {
    data() {
        return {
            msg: "",
            rs: {},
        };
    },
    methods: {
        refresh() {
            setTimeout(() => {
                this.$refs.scrollView.refreshed();
            }, 3000);
        },
    },
};
</script>

<style lang="less" scoped>
.list-wrap {
    flex: 1;
    overflow: auto;
}
.list {
    height: 100px;
    background: #eee;
}
</style>

