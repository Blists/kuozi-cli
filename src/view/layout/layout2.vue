<template>
    <ui-layout flex>
        <ui-head slot="top" title="局部滚动局部下拉刷新" />
        <div style="height: 100px">固定在上面的内容</div>
        <UiScrollView ref="scrollView" @refresh="refresh">
            <div v-for="i in 100" :key="i" style="height: 20px">中间滚动区域{{ i }}</div>
        </UiScrollView>
    </ui-layout>
</template>

<script>
import UiScrollView from "../../components/UiScrollView";
export default {
    components: { UiScrollView },
    methods: {
        refresh() {
            setTimeout(() => {
                this.$refs.scrollView.refreshed();
            }, 3000);
        },
    },
};
</script>

<style>
</style>
