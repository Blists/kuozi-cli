<template>
    <ui-layout flex>
        <ui-head slot="top" title="固定顶部" />
        <div style="height:100px;">
            我也固定在上面
        </div>
        <div class="flex-1 over-auto">
            <div v-for="i in 100" :key="i" style="height:20px">中间滚动区域{{i}}，滚动条是ui-container的滚动条</div>
        </div>
        <div slot="bottom">固定在底部</div>
    </ui-layout>
</template>

<script>
export default {};
</script>

<style>
</style>
